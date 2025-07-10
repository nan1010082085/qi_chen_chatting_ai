# AI聊天助手

基于Vue3、TypeScript、Vite和LangChain.js构建的AI聊天应用，支持独立运行和micro-app嵌入。

## 🚀 特性

- ✨ **现代技术栈**：Vue3 + TypeScript + Vite
- 🤖 **AI对话**：集成LangChain.js，支持OpenAI GPT模型
- 📱 **响应式设计**：适配桌面端和移动端
- 🔌 **微前端支持**：可通过micro-app嵌入其他项目
- 💾 **状态管理**：使用Pinia进行状态管理
- 🎨 **美观界面**：现代化的聊天界面设计
- 🔄 **流式响应**：支持实时流式AI回复
- 👤 **用户信息**：支持外部传入用户信息

## 📦 安装

### 环境要求

- Node.js >= 16
- pnpm >= 7

### 克隆项目

```bash
git clone <repository-url>
cd ai-chat-app
```

### 安装依赖

```bash
pnpm install
```

### 环境配置

1. 复制环境变量配置文件：

```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的OpenAI API Key：

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## 🛠️ 开发

### 启动开发服务器

```bash
pnpm dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

### 代码格式化

```bash
pnpm format
```

### 代码检查

```bash
pnpm lint
```

## 🔧 配置

### 环境变量

| 变量名 | 描述 | 默认值 | 必填 |
|--------|------|--------|------|
| `VITE_OPENAI_API_KEY` | OpenAI API密钥 | - | ✅ |
| `VITE_API_BASE_URL` | API基础URL | `https://api.openai.com/v1` | ❌ |
| `VITE_DEFAULT_MODEL` | 默认AI模型 | `gpt-3.5-turbo` | ❌ |
| `VITE_APP_TITLE` | 应用标题 | `AI聊天助手` | ❌ |

### LangChain配置

可以通过修改 `src/services/langchain.ts` 来自定义LangChain配置：

```typescript
const langChainService = new LangChainService({
  apiKey: 'your-api-key',
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000
})
```

## 🔌 Micro-app集成

### 在主应用中使用

1. 安装micro-app：

```bash
npm install @micro-zoe/micro-app
```

2. 在主应用中注册：

```javascript
import microApp from '@micro-zoe/micro-app'

microApp.start()
```

3. 使用micro-app标签：

```html
<micro-app 
  name="ai-chat-app" 
  url="http://localhost:3000/"
  :data="{ userInfo: { id: '123', name: '张三' } }"
></micro-app>
```

### 数据通信

#### 主应用向子应用传递数据

```javascript
// 主应用
const microAppElement = document.querySelector('micro-app[name=ai-chat-app]')
microAppElement.data = {
  userInfo: {
    id: '123',
    name: '张三',
    avatar: 'https://example.com/avatar.jpg'
  },
  config: {
    theme: 'dark'
  }
}
```

#### 子应用接收数据

```javascript
// 子应用会自动接收并处理用户信息
// 参见 src/App.vue 中的实现
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
├── views/              # 页面组件
│   └── ChatView.vue    # 聊天页面
├── stores/             # Pinia状态管理
│   ├── user.ts         # 用户状态
│   └── chat.ts         # 聊天状态
├── services/           # 服务层
│   └── langchain.ts    # LangChain服务
├── router/             # 路由配置
│   └── index.ts
├── App.vue             # 根组件
├── main.ts             # 应用入口
└── style.css           # 全局样式
```

## 🎨 界面特性

- **响应式设计**：适配不同屏幕尺寸
- **实时聊天**：流式AI回复，实时显示
- **消息状态**：显示发送状态和错误信息
- **用户头像**：支持用户头像显示
- **时间戳**：显示消息发送时间
- **Markdown支持**：支持基础Markdown格式
- **滚动优化**：自动滚动到最新消息

## 🔒 安全注意事项

1. **API密钥安全**：
   - 不要在代码中硬编码API密钥
   - 使用环境变量管理敏感信息
   - 生产环境中使用服务端代理API调用

2. **CORS配置**：
   - 开发环境已配置CORS支持
   - 生产环境需要正确配置跨域策略

## 🚀 部署

### 静态部署

1. 构建项目：

```bash
pnpm build
```

2. 将 `dist` 目录部署到静态服务器

### Docker部署

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🆘 常见问题

### Q: 如何更换AI模型？

A: 修改环境变量 `VITE_DEFAULT_MODEL` 或在代码中更新LangChain配置。

### Q: 如何自定义样式？

A: 修改 `src/style.css` 或组件中的样式。

### Q: 如何添加新功能？

A: 在对应的store中添加状态和方法，然后在组件中使用。

### Q: micro-app集成失败？

A: 检查主应用的micro-app配置和子应用的路由配置。