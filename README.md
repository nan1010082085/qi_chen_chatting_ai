# AI聊天助手

基于 Vue 3、TypeScript、Vite 和 LangChain.js 构建的现代化 AI 聊天应用，支持独立运行和 micro-app 微前端嵌入。

## ✨ 特性

- 🚀 **现代技术栈**：Vue 3 + TypeScript + Vite + WindiCSS
- 🤖 **AI 对话**：集成 LangChain.js，支持 OpenAI 和兼容 API
- 📱 **响应式设计**：适配桌面端和移动端
- 🔌 **微前端支持**：可通过 micro-app 嵌入其他项目
- 💾 **状态管理**：使用 Pinia 进行状态管理
- 🎨 **原子化 CSS**：WindiCSS 提供高效的样式解决方案
- 🔄 **流式响应**：支持实时流式 AI 回复
- 👤 **用户信息**：支持外部传入用户信息
- 🛠️ **开发体验**：完整的 ESLint + Prettier + TypeScript 配置
- 🧪 **测试支持**：集成 Vitest 测试框架
- 📦 **构建优化**：生产环境自动移除 console 语句

## 📋 环境要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd ai-chat-app
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 环境配置

项目根目录已包含 `.env` 文件，你可以直接修改其中的配置：

```env
# 应用标题
VITE_APP_TITLE=AI聊天助手

# OpenAI API 配置（必填）
VITE_OPENAI_API_KEY=your_openai_api_key_here

# API 基础 URL（可选，支持代理服务）
VITE_API_BASE_URL=https://api.openai.com/v1

# 默认模型（可选）
VITE_DEFAULT_MODEL=gpt-3.5-turbo

# API 超时时间（可选）
VITE_API_TIMEOUT=30000
```

### 4. 启动开发服务器

```bash
pnpm dev
```

应用将在 `http://localhost:3000` 启动。

## 🛠️ 开发命令

| 命令 | 描述 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览生产版本 |
| `pnpm test` | 运行测试 |
| `pnpm test:ui` | 运行测试 UI |
| `pnpm test:coverage` | 生成测试覆盖率报告 |
| `pnpm lint` | 代码检查和自动修复 |
| `pnpm format` | 代码格式化 |

## ⚙️ 配置说明

### 环境变量

| 变量名 | 描述 | 默认值 | 必填 |
|--------|------|--------|------|
| `VITE_APP_TITLE` | 应用标题 | `AI聊天助手` | ❌ |
| `VITE_OPENAI_API_KEY` | OpenAI API 密钥 | - | ✅ |
| `VITE_API_BASE_URL` | API 基础 URL | `https://api.openai.com/v1` | ❌ |
| `VITE_DEFAULT_MODEL` | 默认 AI 模型 | `gpt-3.5-turbo` | ❌ |
| `VITE_API_TIMEOUT` | API 请求超时时间（毫秒） | `30000` | ❌ |
| `VITE_DEV_PORT` | 开发服务器端口 | `3000` | ❌ |
| `VITE_DEV_TOOLS` | 是否启用开发工具 | `true` | ❌ |

### 支持的 AI 服务

项目支持多种 AI 服务提供商：

- **OpenAI 官方**：`https://api.openai.com/v1`
- **硅基流动**：`https://api.siliconflow.cn/v1`
- **其他兼容 OpenAI API 的服务**

### LangChain 配置

可以通过修改 `src/services/langchain.ts` 来自定义 LangChain 配置：

```typescript
/**
 * LangChain 服务配置
 */
const langChainService = new LangChainService({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  model: process.env.VITE_DEFAULT_MODEL || 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 2000,
  baseURL: process.env.VITE_API_BASE_URL
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
├── .vscode/                 # VS Code 配置
├── docs/                    # 项目文档
│   └── TOOLS_GUIDE.md      # 工具使用指南
├── public/                  # 静态资源
│   └── vite.svg            # Vite 图标
├── src/                     # 源代码
│   ├── examples/           # 示例代码
│   │   ├── lodash-usage.ts # Lodash 使用示例
│   │   └── utils-demo.vue  # 工具函数演示
│   ├── router/             # 路由配置
│   │   └── index.ts        # 路由定义
│   ├── services/           # 服务层
│   │   └── langchain.ts    # LangChain AI 服务
│   ├── stores/             # Pinia 状态管理
│   │   ├── chat.ts         # 聊天状态
│   │   └── user.ts         # 用户状态
│   ├── styles/             # 样式文件
│   │   ├── globals/        # 全局样式
│   │   └── index.scss      # 样式入口
│   ├── types/              # TypeScript 类型定义
│   │   └── lodash.d.ts     # Lodash 类型扩展
│   ├── utils/              # 工具函数
│   │   ├── dayjs.ts        # 日期时间工具
│   │   ├── index.ts        # 工具函数入口
│   │   └── uuid.ts         # UUID 生成工具
│   ├── views/              # 页面组件
│   │   └── ChatView.vue    # 聊天页面
│   ├── App.vue             # 根组件
│   └── main.ts             # 应用入口
├── tests/                   # 测试文件
│   ├── components/         # 组件测试
│   ├── services/           # 服务测试
│   ├── stores/             # 状态管理测试
│   ├── utils/              # 工具函数测试
│   ├── views/              # 页面测试
│   └── setup.ts            # 测试配置
├── .env                     # 环境变量
├── .eslintrc.cjs           # ESLint 配置
├── .gitignore              # Git 忽略文件
├── .prettierrc             # Prettier 配置
├── .stylelintrc.json       # StyleLint 配置
├── package.json            # 项目配置
├── pnpm-lock.yaml          # 依赖锁定文件
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
├── vitest.config.ts        # Vitest 测试配置
└── windi.config.ts         # WindiCSS 配置
```

## 🏗️ 技术栈

### 核心框架
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具

### UI 和样式
- **WindiCSS** - 按需原子化 CSS 框架
- **Sass** - CSS 预处理器
- **Normalize.css** - CSS 重置库

### 状态管理和路由
- **Pinia** - Vue 3 官方状态管理库
- **Vue Router** - Vue.js 官方路由管理器

### AI 和工具库
- **LangChain.js** - AI 应用开发框架
- **@langchain/openai** - OpenAI 集成
- **Axios** - HTTP 客户端
- **Day.js** - 轻量级日期处理库
- **Lodash-ES** - 实用工具库
- **UUID** - 唯一标识符生成
- **NProgress** - 页面加载进度条

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **StyleLint** - CSS 代码检查
- **Vitest** - 单元测试框架
- **Happy-DOM** - 测试环境 DOM 模拟

### 构建优化
- **Terser** - JavaScript 压缩和优化
- **CSSnano** - CSS 压缩和优化
- **Vue TSC** - Vue TypeScript 类型检查

## 🔒 安全注意事项

### API 密钥安全
- ✅ 使用环境变量管理敏感信息
- ✅ 生产环境自动移除 console 语句
- ⚠️ 不要在代码中硬编码 API 密钥
- ⚠️ 生产环境建议使用服务端代理 API 调用

### CORS 配置
- ✅ 开发环境已配置 CORS 支持
- ⚠️ 生产环境需要正确配置跨域策略

## 🚀 部署

### 静态部署

```bash
# 构建项目
pnpm build

# 部署 dist 目录到静态服务器
# 例如：Nginx、Apache、Vercel、Netlify 等
```

### Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Vercel 部署

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install"
}
```

## 🆘 常见问题

### Q: 如何更换 AI 模型？

**A:** 有两种方式：
1. 修改 `.env` 文件中的 `VITE_DEFAULT_MODEL` 环境变量
2. 在 `src/services/langchain.ts` 中直接修改配置

### Q: 如何自定义样式？

**A:** 项目使用 WindiCSS，你可以：
1. 在组件中使用 WindiCSS 原子类
2. 修改 `src/styles/` 目录下的 SCSS 文件
3. 在 `windi.config.ts` 中自定义主题配置

### Q: 如何添加新功能？

**A:** 推荐的开发流程：
1. 在 `src/stores/` 中添加状态管理
2. 在 `src/services/` 中添加业务逻辑
3. 在 `src/views/` 或 `src/components/` 中添加 UI 组件
4. 在 `tests/` 中添加对应的测试用例

### Q: micro-app 集成失败？

**A:** 检查以下几点：
1. 主应用是否正确安装和配置 `@micro-zoe/micro-app`
2. 子应用的路由是否配置了 `base` 路径
3. 检查网络和 CORS 配置
4. 查看浏览器控制台的错误信息

### Q: API 请求失败怎么办？

**A:** 常见解决方案：
1. 检查 `.env` 文件中的 API 密钥是否正确
2. 确认 `VITE_API_BASE_URL` 是否可访问
3. 检查网络连接和防火墙设置
4. 查看浏览器网络面板的具体错误信息

### Q: 如何启用开发工具？

**A:** 开发环境下默认启用，你可以：
1. 使用 Vue DevTools 浏览器扩展
2. 运行 `pnpm test:ui` 查看测试界面
3. 使用 `pnpm lint` 检查代码质量

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 提交 Issue
- 🐛 **Bug 报告**：请提供详细的复现步骤
- 💡 **功能建议**：描述你希望添加的功能
- 📚 **文档改进**：帮助我们完善文档

### 提交 Pull Request
1. Fork 本仓库
2. 创建你的功能分支：`git checkout -b feature/amazing-feature`
3. 提交你的更改：`git commit -m 'Add some amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 打开一个 Pull Request

### 开发规范
- 遵循 ESLint 和 Prettier 配置
- 为新功能添加测试用例
- 更新相关文档
- 使用语义化的提交信息

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🙏 致谢

感谢以下开源项目：
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [LangChain.js](https://js.langchain.com/) - AI 应用开发框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [WindiCSS](https://windicss.org/) - 按需原子化 CSS 框架

---

**如果这个项目对你有帮助，请给它一个 ⭐️！**