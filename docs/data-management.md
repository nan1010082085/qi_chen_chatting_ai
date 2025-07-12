# 数据管理

本文档详细介绍 AI 聊天助手的数据存储、管理和持久化机制。

## 📊 数据结构

### 会话数据结构
```typescript
interface ChatSession {
  id: string;              // 会话唯一标识
  title: string;           // 会话标题
  messages: ChatMessage[]; // 消息列表
  createdAt: Date;         // 创建时间
  updatedAt: Date;         // 最后更新时间
}
```

### 消息数据结构
```typescript
interface ChatMessage {
  id: string;              // 消息唯一标识
  content: string;         // 消息内容
  role: 'user' | 'assistant'; // 消息角色
  timestamp: Date;         // 发送时间
  status: 'sending' | 'sent' | 'error'; // 发送状态
  error?: string;          // 错误信息（如果有）
  reasoning?: string;      // AI 思考过程（仅 AI 消息）
}
```

## 💾 存储机制

### IndexedDB 存储
应用使用 IndexedDB 作为主要的本地存储方案：

**优势：**
- 大容量存储（通常几百 MB 到几 GB）
- 异步操作，不阻塞主线程
- 支持复杂数据结构
- 持久化存储，浏览器关闭后数据不丢失

**数据库结构：**
```
Database: ChatAppDB
├── ObjectStore: sessions
│   ├── Key: sessionId (string)
│   └── Value: ChatSession object
```

### 存储服务
`IndexedDBService` 类提供完整的数据库操作：

```typescript
class IndexedDBService {
  // 初始化数据库
  async initDB(): Promise<void>
  
  // 获取所有会话
  async getAllSessions(): Promise<ChatSession[]>
  
  // 保存会话
  async saveSession(session: ChatSession): Promise<void>
  
  // 删除会话
  async deleteSession(sessionId: string): Promise<void>
  
  // 获取指定会话
  async getSession(sessionId: string): Promise<ChatSession | undefined>
  
  // 清空所有数据
  async clearAll(): Promise<void>
}
```

## 🔄 状态管理

### Pinia Store
使用 Pinia 进行全局状态管理：

```typescript
const useChatStore = defineStore('chat', () => {
  // 状态
  const sessions = ref<ChatSession[]>([]);
  const currentSessionId = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // 计算属性
  const currentSession = computed(() => 
    sessions.value.find(s => s.id === currentSessionId.value)
  );
  
  const currentMessages = computed(() => 
    currentSession.value?.messages || []
  );
  
  // 方法
  const createSession = async () => { /* ... */ };
  const switchSession = (sessionId: string) => { /* ... */ };
  const deleteSession = async (sessionId: string) => { /* ... */ };
  // ...
});
```

### 状态同步
所有状态变更都会自动同步到 IndexedDB：

1. **创建会话**：立即保存到数据库
2. **添加消息**：实时保存消息和会话状态
3. **更新标题**：立即保存标题变更
4. **删除操作**：立即从数据库删除

## 📝 数据操作

### 会话管理

#### 创建新会话
```typescript
const createSession = async (): Promise<string> => {
  const newSession: ChatSession = {
    id: generateId(),
    title: '新对话',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  sessions.value.push(newSession);
  await saveSessionToDB(newSession);
  
  return newSession.id;
};
```

#### 切换会话
```typescript
const switchSession = (sessionId: string): void => {
  const session = sessions.value.find(s => s.id === sessionId);
  if (session) {
    currentSessionId.value = sessionId;
  }
};
```

#### 删除会话
```typescript
const deleteSession = async (sessionId: string): Promise<void> => {
  // 从内存中删除
  const index = sessions.value.findIndex(s => s.id === sessionId);
  if (index !== -1) {
    sessions.value.splice(index, 1);
  }
  
  // 从数据库中删除
  await deleteSessionFromDB(sessionId);
  
  // 如果删除的是当前会话，切换到其他会话
  if (currentSessionId.value === sessionId) {
    currentSessionId.value = sessions.value[0]?.id || null;
  }
};
```

### 消息管理

#### 添加消息
```typescript
const addMessage = async (content: string, role: 'user' | 'assistant'): Promise<string> => {
  if (!currentSession.value) return '';
  
  const message: ChatMessage = {
    id: generateId(),
    content,
    role,
    timestamp: new Date(),
    status: role === 'user' ? 'sent' : 'sending'
  };
  
  currentSession.value.messages.push(message);
  currentSession.value.updatedAt = new Date();
  
  // 如果是第一条用户消息，更新会话标题
  if (role === 'user' && currentSession.value.messages.length === 1) {
    currentSession.value.title = content.slice(0, 20) + (content.length > 20 ? '...' : '');
  }
  
  await saveSessionToDB(currentSession.value);
  
  return message.id;
};
```

#### 更新消息状态
```typescript
const updateMessageStatus = async (
  messageId: string, 
  status: ChatMessage['status'], 
  error?: string
): Promise<void> => {
  if (!currentSession.value) return;
  
  const message = currentSession.value.messages.find(m => m.id === messageId);
  if (message) {
    message.status = status;
    if (error) message.error = error;
    
    currentSession.value.updatedAt = new Date();
    await saveSessionToDB(currentSession.value);
  }
};
```

#### 删除消息
```typescript
const deleteMessage = async (messageId: string): Promise<void> => {
  if (!currentSession.value) return;
  
  const index = currentSession.value.messages.findIndex(m => m.id === messageId);
  if (index !== -1) {
    currentSession.value.messages.splice(index, 1);
    currentSession.value.updatedAt = new Date();
    await saveSessionToDB(currentSession.value);
  }
};
```

## 🔄 数据同步

### 自动保存
所有数据变更都会自动保存：

1. **实时保存**：每次操作后立即保存到 IndexedDB
2. **批量优化**：对于频繁操作，使用防抖机制避免过度保存
3. **错误恢复**：保存失败时自动重试

### 数据加载
应用启动时自动加载历史数据：

```typescript
const loadSessionsFromDB = async (): Promise<void> => {
  try {
    const loadedSessions = await indexedDBService.getAllSessions();
    
    if (loadedSessions.length > 0) {
      sessions.value = loadedSessions;
      currentSessionId.value = loadedSessions[0].id;
    } else {
      // 创建默认会话
      const defaultSessionId = await createSession();
      currentSessionId.value = defaultSessionId;
    }
  } catch (error) {
    console.error('加载会话失败:', error);
    // 创建默认会话作为备选
    const defaultSessionId = await createSession();
    currentSessionId.value = defaultSessionId;
  }
};
```

## 🛡️ 数据安全

### 数据验证
- **类型检查**：使用 TypeScript 确保数据类型正确
- **数据校验**：保存前验证数据完整性
- **错误处理**：完善的错误捕获和处理机制

### 数据备份
- **本地备份**：数据存储在用户本地，不上传到服务器
- **导出功能**：支持导出对话历史（计划中）
- **导入功能**：支持导入备份数据（计划中）

### 隐私保护
- **本地存储**：所有数据仅存储在用户设备上
- **无服务器依赖**：不依赖外部服务器存储用户数据
- **数据清理**：用户可随时清空所有数据

## 🔧 数据维护

### 数据清理
```typescript
// 清空当前会话
const clearCurrentSession = async (): Promise<void> => {
  if (!currentSession.value) return;
  
  currentSession.value.messages = [];
  currentSession.value.updatedAt = new Date();
  await saveSessionToDB(currentSession.value);
};

// 清空所有数据
const clearAllData = async (): Promise<void> => {
  sessions.value = [];
  currentSessionId.value = null;
  await indexedDBService.clearAll();
};
```

### 数据迁移
当数据结构发生变化时，提供迁移机制：

```typescript
const migrateData = async (oldVersion: number, newVersion: number): Promise<void> => {
  // 根据版本号执行相应的迁移逻辑
  if (oldVersion < 2 && newVersion >= 2) {
    // 执行 v1 到 v2 的迁移
    await migrateV1ToV2();
  }
};
```

## 📊 性能优化

### 懒加载
- **按需加载**：只加载当前需要的会话数据
- **分页加载**：对于大量历史记录，支持分页加载
- **虚拟滚动**：对于长对话，使用虚拟滚动优化性能

### 内存管理
- **及时清理**：不再使用的数据及时从内存中清理
- **缓存策略**：合理的缓存策略平衡性能和内存使用
- **垃圾回收**：避免内存泄漏，确保垃圾回收正常工作

---

更多技术细节请参考源码中的相关实现。