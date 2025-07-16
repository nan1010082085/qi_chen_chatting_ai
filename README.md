# AI 聊天助手

基于 Vue 3 + TypeScript + Vite 构建的现代化 AI 聊天应用，集成 DeepSeek AI 模型，支持流式对话和思考过程展示。

## ✨ 核心特性

- 🤖 **DeepSeek AI 集成** - 支持多种 DeepSeek 模型，包括推理模型的思考过程展示
- 🔄 **流式响应** - 实时流式 AI 回复，支持思考过程和最终答案分离显示
- 💾 **本地存储** - 基于 IndexedDB 的会话历史管理，支持多会话切换
- 🎨 **现代 UI** - 响应式设计，支持桌面端和移动端
- 🔌 **微前端支持** - 可通过 micro-app 嵌入其他项目
- 🛠️ **开发友好** - TypeScript + ESLint + Prettier + Vitest 完整工具链

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装和配置

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量（修改 .env 文件）
VITE_OPENAI_API_KEY=your_deepseek_api_key_here
VITE_API_BASE_URL=https://api.siliconflow.cn/v1
VITE_DEFAULT_MODEL=deepseek-chat

# 3. 启动开发服务器
pnpm dev
```

访问 `http://localhost:3000` 开始使用。

## 🛠️ 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm test         # 运行测试
pnpm lint         # 代码检查和修复
```

## ⚙️ 配置说明

### 环境变量

| 变量名 | 描述 | 必填 |
|--------|------|------|
| `VITE_OPENAI_API_KEY` | DeepSeek API 密钥 | ✅ |
| `VITE_API_BASE_URL` | API 基础 URL | ❌ |
| `VITE_DEFAULT_MODEL` | 默认 AI 模型 | ❌ |

### 支持的模型

- **deepseek-chat** - 通用对话模型
- **deepseek-r1** - 推理模型，支持思考过程展示
- **deepseek-r1-lite-preview** - 轻量版推理模型

### 获取 API 密钥

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/api_keys)
2. 创建 API 密钥
3. 复制到 `.env` 文件的 `VITE_OPENAI_API_KEY`

## 🔌 Micro-app 集成

支持作为微前端应用嵌入其他项目：

```bash
# 1. 安装 micro-app
npm install @micro-zoe/micro-app

# 2. 注册并使用
import microApp from '@micro-zoe/micro-app'
microApp.start()
```

```html
<micro-app 
  name="ai-chat-app" 
  url="http://localhost:3000/"
  :data="{ userInfo: { id: '123', name: '张三' } }"
></micro-app>
```

## 📁 项目结构

```
src/
├── components/          # UI 组件
├── services/           # API 服务层
│   └── deepseek.ts    # DeepSeek AI 服务
├── stores/            # Pinia 状态管理
│   ├── chat.ts       # 聊天状态
│   └── user.ts       # 用户状态
├── views/             # 页面组件
│   └── ChatView.vue  # 聊天页面
├── utils/             # 工具函数
└── styles/            # 样式文件
```

## 📚 详细文档

- 📖 [功能概览](./docs/features.md)
- 🎨 [用户界面指南](./docs/ui-guide.md)
- 💾 [数据管理](./docs/data-management.md)
- 🤖 [AI 配置指南](./docs/ai-configuration.md)
- 🛠️ [开发指南](./docs/development.md)
- ❓ [常见问题](./docs/faq.md)

## 🏗️ 技术栈

- **Vue 3** + **TypeScript** + **Vite** - 现代前端开发框架
- **Pinia** - 状态管理
- **UnoCSS** - 原子化 CSS 框架
- **DeepSeek API** - AI 对话服务
- **IndexedDB** - 本地数据存储
- **Vitest** - 单元测试框架

## 🔒 安全注意事项

- ⚠️ 不要在代码中硬编码 API 密钥
- ⚠️ 生产环境建议使用服务端代理 API 调用
- ⚠️ 注意配置正确的跨域策略

## 🚀 部署

```bash
# 构建项目
pnpm build

# 部署 dist 目录到静态服务器
# 支持：Nginx、Apache、Vercel、Netlify 等
```

## 🆘 常见问题

**Q: API 请求失败？**
- 检查 `.env` 文件中的 API 密钥是否正确
- 确认网络连接和 API 服务可访问性

**Q: 如何更换 AI 模型？**
- 修改 `.env` 文件中的 `VITE_DEFAULT_MODEL`

**Q: micro-app 集成失败？**
- 检查主应用是否正确配置 `@micro-zoe/micro-app`
- 查看浏览器控制台错误信息

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

请遵循项目的 ESLint 和 Prettier 配置。

## 📄 许可证

MIT License

---

**如果这个项目对你有帮助，请给它一个 ⭐️！**