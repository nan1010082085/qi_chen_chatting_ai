# 开发指南

本文档为开发者提供详细的技术指南，包括项目架构、开发环境搭建、代码规范等。

## 🏗️ 项目架构

### 技术栈
- **前端框架**：Vue 3 + Composition API
- **类型系统**：TypeScript
- **构建工具**：Vite
- **UI 组件库**：TDesign Vue Next
- **状态管理**：Pinia
- **样式方案**：UnoCSS + SCSS
- **AI 集成**：LangChain.js
- **数据存储**：IndexedDB
- **代码规范**：ESLint + Prettier
- **测试框架**：Vitest

### 目录结构
```
src/
├── components/          # 组件目录
│   ├── chat/           # 聊天相关组件
│   ├── sidebar/        # 侧边栏组件
│   └── common/         # 通用组件
├── views/              # 页面视图
│   └── ChatView.vue    # 主聊天页面
├── stores/             # Pinia 状态管理
│   └── chat.ts         # 聊天状态管理
├── services/           # 服务层
│   ├── deepseek.ts     # DeepSeek AI 服务
│   └── indexedDB.ts    # 数据库服务
├── utils/              # 工具函数
├── types/              # TypeScript 类型定义
├── assets/             # 静态资源
└── styles/             # 样式文件
```

### 架构设计
```
┌─────────────────┐
│   Vue 3 Views   │  ← 用户界面层
└─────────────────┘
         │
┌─────────────────┐
│   Components    │  ← 组件层
└─────────────────┘
         │
┌─────────────────┐
│  Pinia Stores   │  ← 状态管理层
└─────────────────┘
         │
┌─────────────────┐
│    Services     │  ← 服务层
└─────────────────┘
         │
┌─────────────────┐
│   IndexedDB     │  ← 数据持久化层
└─────────────────┘
```

## 🛠️ 开发环境

### 环境要求
- **Node.js**：>= 16.0.0
- **npm**：>= 8.0.0 或 **yarn**：>= 1.22.0
- **现代浏览器**：支持 ES2020+ 的浏览器

### 安装依赖
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发命令
```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 运行测试
npm run test

# 代码检查
npm run lint

# 代码格式化
npm run format

# 类型检查
npm run type-check
```

### 环境配置
创建 `.env.local` 文件进行本地开发配置：

```env
# 开发环境配置
VITE_APP_TITLE=AI聊天助手（开发版）
VITE_OPENAI_API_KEY=your_dev_api_key
VITE_API_BASE_URL=https://api.siliconflow.cn/v1
VITE_DEFAULT_MODEL=deepseek-chat
VITE_DEV_TOOLS=true
VITE_DEBUG=true
```

## 📝 代码规范

### TypeScript 规范

#### 类型定义
```typescript
// 使用 interface 定义对象类型
interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// 使用 type 定义联合类型
type MessageStatus = 'sending' | 'sent' | 'error';

// 使用泛型提高代码复用性
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

#### 函数定义
```typescript
// 明确的参数和返回值类型
const createMessage = (
  content: string,
  role: ChatMessage['role']
): ChatMessage => {
  return {
    id: generateId(),
    content,
    role,
    timestamp: new Date()
  };
};

// 异步函数的类型定义
const saveMessage = async (
  message: ChatMessage
): Promise<void> => {
  await indexedDBService.saveMessage(message);
};
```

### Vue 3 规范

#### Composition API
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { ChatMessage } from '@/types';

// 响应式数据
const messages = ref<ChatMessage[]>([]);
const isLoading = ref(false);

// 计算属性
const messageCount = computed(() => messages.value.length);

// 方法
const addMessage = (message: ChatMessage) => {
  messages.value.push(message);
};

// 生命周期
onMounted(() => {
  loadMessages();
});
</script>
```

#### 组件命名
```typescript
// 组件文件名使用 PascalCase
// ChatSidebar.vue
// MessageInput.vue
// UserAvatar.vue

// 组件内部使用 kebab-case
<template>
  <div class="chat-sidebar">
    <message-input @send="handleSend" />
    <user-avatar :user="currentUser" />
  </div>
</template>
```

### CSS 规范

#### 类名命名
```scss
// 使用 BEM 命名规范
.chat-sidebar {
  &__header {
    // 样式
  }
  
  &__content {
    // 样式
  }
  
  &__item {
    &--active {
      // 修饰符样式
    }
  }
}
```

#### UnoCSS 使用
```vue
<template>
  <!-- 优先使用 UnoCSS 原子类 -->
  <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
    <!-- 复杂样式使用自定义类 -->
    <div class="chat-message">
      <!-- 内容 -->
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式补充 UnoCSS 不足 */
.chat-message {
  /* 复杂的自定义样式 */
}
</style>
```

## 🔧 核心模块开发

### 状态管理（Pinia）

#### Store 定义
```typescript
// stores/chat.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ChatSession, ChatMessage } from '@/types';

export const useChatStore = defineStore('chat', () => {
  // 状态
  const sessions = ref<ChatSession[]>([]);
  const currentSessionId = ref<string | null>(null);
  
  // 计算属性
  const currentSession = computed(() => 
    sessions.value.find(s => s.id === currentSessionId.value)
  );
  
  // 方法
  const createSession = async (): Promise<string> => {
    // 实现逻辑
  };
  
  const addMessage = async (
    content: string, 
    role: ChatMessage['role']
  ): Promise<string> => {
    // 实现逻辑
  };
  
  return {
    // 导出状态、计算属性和方法
    sessions,
    currentSessionId,
    currentSession,
    createSession,
    addMessage
  };
});
```

#### Store 使用
```vue
<script setup lang="ts">
import { useChatStore } from '@/stores/chat';

const chatStore = useChatStore();

// 使用状态
const { sessions, currentSession } = storeToRefs(chatStore);

// 调用方法
const handleSend = async (content: string) => {
  await chatStore.addMessage(content, 'user');
};
</script>
```

### 服务层开发

#### AI 服务
```typescript
// services/deepseek.ts
import { ChatOpenAI } from '@langchain/openai';
import type { BaseMessage } from '@langchain/core/messages';

export class DeepSeekService {
  private client: ChatOpenAI;
  private config: DeepSeekConfig;
  
  constructor(config: DeepSeekConfig) {
    this.config = config;
    this.client = new ChatOpenAI({
      openAIApiKey: config.apiKey,
      modelName: config.model,
      temperature: config.temperature,
      // ... 其他配置
    });
  }
  
  async sendMessage(
    messages: ChatMessage[],
    options?: SendMessageOptions
  ): Promise<string> {
    // 实现消息发送逻辑
  }
  
  updateConfig(newConfig: Partial<DeepSeekConfig>): void {
    // 更新配置逻辑
  }
}
```

#### 数据库服务
```typescript
// services/indexedDB.ts
export class IndexedDBService {
  private db: IDBDatabase | null = null;
  private readonly dbName = 'ChatAppDB';
  private readonly version = 1;
  
  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        // 数据库升级逻辑
      };
    });
  }
  
  async saveSession(session: ChatSession): Promise<void> {
    // 保存会话逻辑
  }
}
```

### 组件开发

#### 组件结构
```vue
<!-- components/chat/MessageItem.vue -->
<template>
  <div class="message-item" :class="messageClasses">
    <div class="message-item__avatar">
      <img :src="avatarUrl" :alt="senderName" />
    </div>
    
    <div class="message-item__content">
      <div class="message-item__header">
        <span class="message-item__sender">{{ senderName }}</span>
        <span class="message-item__time">{{ formattedTime }}</span>
      </div>
      
      <div class="message-item__body">
        <div v-if="message.reasoning" class="message-reasoning">
          {{ message.reasoning }}
        </div>
        <div class="message-content">
          {{ message.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ChatMessage } from '@/types';
import { formatTime } from '@/utils';

interface Props {
  message: ChatMessage;
}

const props = defineProps<Props>();

// 计算属性
const messageClasses = computed(() => ({
  'message-item--user': props.message.role === 'user',
  'message-item--assistant': props.message.role === 'assistant',
  'message-item--error': props.message.status === 'error'
}));

const avatarUrl = computed(() => 
  props.message.role === 'user' ? '/user-avatar.png' : '/ai-avatar.png'
);

const senderName = computed(() => 
  props.message.role === 'user' ? '用户' : 'AI 助手'
);

const formattedTime = computed(() => 
  formatTime(props.message.timestamp)
);
</script>

<style scoped>
.message-item {
  @apply flex gap-3 p-4;
  
  &--user {
    @apply flex-row-reverse;
  }
  
  &__avatar img {
    @apply w-8 h-8 rounded-full;
  }
  
  &__content {
    @apply flex-1 max-w-0;
  }
  
  &__header {
    @apply flex items-center justify-between mb-1;
  }
  
  &__sender {
    @apply text-sm font-medium text-gray-700;
  }
  
  &__time {
    @apply text-xs text-gray-500;
  }
}

.message-reasoning {
  @apply p-3 mb-2 bg-blue-50 rounded-lg text-sm text-blue-800;
  border-left: 3px solid theme('colors.blue.400');
}

.message-content {
  @apply text-gray-900 leading-relaxed;
}
</style>
```

## 🧪 测试开发

### 单元测试
```typescript
// tests/stores/chat.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useChatStore } from '@/stores/chat';

describe('Chat Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  
  it('should create a new session', async () => {
    const store = useChatStore();
    const sessionId = await store.createSession();
    
    expect(sessionId).toBeTruthy();
    expect(store.sessions).toHaveLength(1);
    expect(store.currentSessionId).toBe(sessionId);
  });
  
  it('should add message to current session', async () => {
    const store = useChatStore();
    await store.createSession();
    
    const messageId = await store.addMessage('Hello', 'user');
    
    expect(messageId).toBeTruthy();
    expect(store.currentSession?.messages).toHaveLength(1);
    expect(store.currentSession?.messages[0].content).toBe('Hello');
  });
});
```

### 组件测试
```typescript
// tests/components/MessageItem.test.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MessageItem from '@/components/chat/MessageItem.vue';
import type { ChatMessage } from '@/types';

describe('MessageItem', () => {
  const mockMessage: ChatMessage = {
    id: '1',
    content: 'Hello, world!',
    role: 'user',
    timestamp: new Date(),
    status: 'sent'
  };
  
  it('should render message content', () => {
    const wrapper = mount(MessageItem, {
      props: { message: mockMessage }
    });
    
    expect(wrapper.text()).toContain('Hello, world!');
  });
  
  it('should apply correct classes for user message', () => {
    const wrapper = mount(MessageItem, {
      props: { message: mockMessage }
    });
    
    expect(wrapper.classes()).toContain('message-item--user');
  });
});
```

## 🚀 构建和部署

### 构建配置
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia'],
          ui: ['tdesign-vue-next'],
          ai: ['@langchain/openai']
        }
      }
    }
  },
  server: {
    port: 3001,
    open: true
  }
});
```

### Docker 部署
```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### CI/CD 配置
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test
    
    - name: Build
      run: npm run build
    
    - name: Deploy
      # 部署步骤
```

## 🔍 调试和优化

### 开发工具
```typescript
// 开发环境启用 Vue DevTools
if (import.meta.env.DEV) {
  import('@vue/devtools');
}

// 性能监控
if (import.meta.env.VITE_DEBUG) {
  console.log('Debug mode enabled');
  
  // 添加性能监控
  window.addEventListener('load', () => {
    console.log('Page load time:', performance.now());
  });
}
```

### 性能优化
```typescript
// 组件懒加载
const MessageInput = defineAsyncComponent(
  () => import('@/components/chat/MessageInput.vue')
);

// 虚拟滚动（大量消息时）
import { VirtualList } from '@tanstack/vue-virtual';

// 防抖处理
import { debounce } from 'lodash-es';

const debouncedSave = debounce(saveMessage, 300);
```

## 📚 最佳实践

### 代码组织
1. **单一职责**：每个模块只负责一个功能
2. **依赖注入**：通过参数传递依赖，便于测试
3. **错误处理**：完善的错误捕获和处理机制
4. **类型安全**：充分利用 TypeScript 的类型系统

### 性能优化
1. **懒加载**：按需加载组件和模块
2. **虚拟滚动**：处理大量数据时使用虚拟滚动
3. **缓存策略**：合理使用缓存减少重复计算
4. **代码分割**：将代码分割成多个 chunk

### 安全考虑
1. **输入验证**：验证所有用户输入
2. **XSS 防护**：防止跨站脚本攻击
3. **API 安全**：保护 API 密钥和敏感信息
4. **内容过滤**：过滤不当内容

---

更多开发细节请参考源码注释和相关文档。