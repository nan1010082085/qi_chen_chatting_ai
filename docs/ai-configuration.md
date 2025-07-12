# AI 配置指南

本文档详细介绍如何配置和使用 AI 聊天助手中的各种 AI 模型和服务。

## 🤖 支持的 AI 服务

### DeepSeek 官方 API
- **API 地址**：`https://api.deepseek.com/v1`
- **特点**：官方服务，稳定可靠
- **获取方式**：[DeepSeek 开放平台](https://platform.deepseek.com/api_keys)

### 硅基流动代理
- **API 地址**：`https://api.siliconflow.cn/v1`
- **特点**：国内访问友好，速度较快
- **获取方式**：[硅基流动平台](https://siliconflow.cn/)

### 其他兼容服务
- 支持任何兼容 OpenAI API 格式的服务
- 只需修改 `VITE_API_BASE_URL` 即可

## 🔧 环境配置

### 基础配置
在项目根目录创建 `.env` 文件：

```env
# 必填：API 密钥
VITE_OPENAI_API_KEY=your_api_key_here

# 可选：API 服务地址
VITE_API_BASE_URL=https://api.siliconflow.cn/v1

# 可选：默认模型
VITE_DEFAULT_MODEL=deepseek-chat

# 可选：请求超时时间（毫秒）
VITE_API_TIMEOUT=30000
```

### 配置说明

| 配置项 | 说明 | 默认值 | 必填 |
|--------|------|--------|------|
| `VITE_OPENAI_API_KEY` | API 密钥 | - | ✅ |
| `VITE_API_BASE_URL` | API 服务地址 | `https://api.siliconflow.cn/v1` | ❌ |
| `VITE_DEFAULT_MODEL` | 默认模型 | `deepseek-chat` | ❌ |
| `VITE_API_TIMEOUT` | 超时时间 | `30000` | ❌ |

## 🎯 模型选择

### DeepSeek 模型系列

#### 通用对话模型
- **deepseek-chat**
  - 用途：日常对话、问答、文本生成
  - 特点：平衡性能和成本，适合大多数场景
  - 推荐指数：⭐⭐⭐⭐⭐

#### 推理模型
- **deepseek-r1**
  - 用途：复杂推理、逻辑分析、数学问题
  - 特点：支持思考过程展示，推理能力强
  - 推荐指数：⭐⭐⭐⭐⭐
  - 特殊功能：思考过程可视化

- **deepseek-r1-lite-preview**
  - 用途：轻量级推理任务
  - 特点：速度快，成本低，适合简单推理
  - 推荐指数：⭐⭐⭐⭐

- **deepseek-reasoner**
  - 用途：专业推理任务
  - 特点：专门的推理模型，逻辑性强
  - 推荐指数：⭐⭐⭐⭐

### 模型选择建议

| 使用场景 | 推荐模型 | 理由 |
|----------|----------|------|
| 日常聊天 | `deepseek-chat` | 平衡性能和成本 |
| 代码编程 | `deepseek-chat` | 代码理解能力强 |
| 数学问题 | `deepseek-r1` | 支持推理过程展示 |
| 逻辑推理 | `deepseek-r1` | 推理能力最强 |
| 快速问答 | `deepseek-r1-lite-preview` | 速度快，成本低 |

## ⚙️ 高级配置

### 模型参数配置

```typescript
// 在 src/services/deepseek.ts 中配置
const config = {
  apiKey: process.env.VITE_OPENAI_API_KEY,
  model: 'deepseek-chat',
  temperature: 0.7,        // 创造性：0-2，越高越有创意
  maxTokens: 2000,         // 最大输出长度
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 30000,          // 超时时间（毫秒）
  enableReasoning: true    // 是否启用思考模式
};
```

### 参数说明

#### Temperature（温度）
- **范围**：0.0 - 2.0
- **作用**：控制输出的随机性和创造性
- **建议值**：
  - `0.1-0.3`：精确任务（翻译、摘要）
  - `0.7-0.9`：创意任务（写作、头脑风暴）
  - `1.0-1.5`：高创意任务（诗歌、故事）

#### Max Tokens（最大令牌数）
- **范围**：1 - 模型上限
- **作用**：限制单次回复的最大长度
- **建议值**：
  - `500-1000`：简短回答
  - `1000-2000`：中等长度回答
  - `2000+`：长篇回答

#### Timeout（超时时间）
- **范围**：1000 - 300000（毫秒）
- **作用**：API 请求的最大等待时间
- **建议值**：
  - `10000`：快速响应场景
  - `30000`：标准场景（推荐）
  - `60000+`：复杂推理场景

## 🧠 思考过程功能

### 启用思考模式
对于支持推理的模型，可以启用思考过程展示：

```typescript
// 在服务配置中启用
const deepseekService = new DeepSeekService({
  // ... 其他配置
  enableReasoning: true  // 启用思考模式
});
```

### 思考过程特性
- **实时展示**：AI 的思考过程实时流式更新
- **内容分离**：思考过程与最终答案分开显示
- **智能过滤**：自动移除技术标签，保持内容清洁
- **可选显示**：用户可选择是否查看思考过程

### 支持思考的模型
- ✅ `deepseek-r1`
- ✅ `deepseek-r1-lite-preview`
- ✅ `deepseek-reasoner`
- ❌ `deepseek-chat`（不支持）

## 🔄 动态配置

### 运行时配置更新
```typescript
// 更新模型配置
deepseekService.updateConfig({
  model: 'deepseek-r1',
  temperature: 0.8,
  maxTokens: 3000
});

// 获取当前配置
const currentConfig = deepseekService.getConfig();
console.log('当前配置:', currentConfig);
```

### 配置验证
```typescript
// 验证配置是否有效
const isValid = await deepseekService.validateConfig();
if (!isValid) {
  console.error('配置无效，请检查 API 密钥和网络连接');
}
```

## 🚀 性能优化

### 流式响应
启用流式响应可以提升用户体验：

```typescript
// 发送消息时启用流式响应
const response = await deepseekService.sendMessage(
  messages,
  {
    stream: true,  // 启用流式响应
    onContent: (content) => {
      // 处理内容更新
      updateMessageContent(messageId, content);
    },
    onReasoning: (reasoning) => {
      // 处理思考过程更新
      updateMessageReasoning(messageId, reasoning);
    }
  }
);
```

### 请求优化
- **连接复用**：复用 HTTP 连接减少延迟
- **请求缓存**：缓存相同请求的结果
- **错误重试**：自动重试失败的请求
- **超时控制**：合理设置超时时间

## 🛡️ 安全配置

### API 密钥安全
- **环境变量**：使用环境变量存储 API 密钥
- **不要硬编码**：永远不要在代码中硬编码密钥
- **定期轮换**：定期更换 API 密钥
- **权限最小化**：只授予必要的 API 权限

### 网络安全
- **HTTPS 连接**：确保使用 HTTPS 连接
- **代理配置**：如需代理，确保代理服务安全
- **请求验证**：验证 API 响应的完整性

## 🔍 故障排除

### 常见问题

#### API 密钥错误
```
错误：401 Unauthorized
解决：检查 API 密钥是否正确设置
```

#### 网络连接问题
```
错误：Network Error 或 Timeout
解决：
1. 检查网络连接
2. 尝试更换 API 服务地址
3. 增加超时时间
```

#### 模型不支持
```
错误：Model not found
解决：
1. 检查模型名称是否正确
2. 确认服务商是否支持该模型
3. 尝试使用默认模型
```

### 调试模式
启用调试模式获取详细日志：

```env
# 在 .env 文件中添加
VITE_DEBUG=true
```

```typescript
// 在代码中启用调试
deepseekService.setDebugMode(true);
```

### 日志分析
查看浏览器控制台的详细日志：
- **请求日志**：API 请求的详细信息
- **响应日志**：API 响应的内容和状态
- **错误日志**：详细的错误信息和堆栈

## 📊 监控和分析

### 使用统计
```typescript
// 获取使用统计
const stats = deepseekService.getUsageStats();
console.log('总请求数:', stats.totalRequests);
console.log('成功率:', stats.successRate);
console.log('平均响应时间:', stats.averageResponseTime);
```

### 成本控制
- **Token 计数**：监控 Token 使用量
- **请求频率**：控制请求频率避免超限
- **模型选择**：根据需求选择合适的模型

---

如需更多帮助，请参考 [常见问题](./faq.md) 或查看源码实现。