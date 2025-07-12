# 常见问题解答

本文档收集了用户在使用 AI 聊天助手过程中遇到的常见问题和解决方案。

## 🚀 快速开始问题

### Q: 如何获取 DeepSeek API 密钥？

**A:** 
1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/api_keys)
2. 注册并登录账户
3. 在 API Keys 页面创建新的密钥
4. 复制密钥到项目的 `.env` 文件中

```env
VITE_OPENAI_API_KEY=your_deepseek_api_key_here
```

### Q: 启动项目时提示 "API key not found" 错误？

**A:** 请检查以下几点：
1. 确认已创建 `.env` 文件
2. 确认 API 密钥格式正确
3. 确认环境变量名称为 `VITE_OPENAI_API_KEY`
4. 重启开发服务器

### Q: 如何更换 AI 模型？

**A:** 修改 `.env` 文件中的模型配置：

```env
# 通用对话模型
VITE_DEFAULT_MODEL=deepseek-chat

# 推理模型（支持思考过程）
VITE_DEFAULT_MODEL=deepseek-r1
```

## 🤖 AI 对话问题

### Q: AI 回复很慢或者超时？

**A:** 可以尝试以下解决方案：

1. **增加超时时间**：
```env
VITE_API_TIMEOUT=60000  # 60秒
```

2. **更换 API 服务商**：
```env
# 使用硅基流动（通常更快）
VITE_API_BASE_URL=https://api.siliconflow.cn/v1

# 或使用 DeepSeek 官方
VITE_API_BASE_URL=https://api.deepseek.com/v1
```

3. **使用更快的模型**：
```env
VITE_DEFAULT_MODEL=deepseek-r1-lite-preview
```

### Q: AI 思考过程不显示？

**A:** 思考过程功能需要满足以下条件：
1. 使用支持推理的模型（如 `deepseek-r1`）
2. 确认模型配置正确
3. 检查网络连接是否稳定

支持思考过程的模型：
- ✅ `deepseek-r1`
- ✅ `deepseek-r1-lite-preview`
- ✅ `deepseek-reasoner`
- ❌ `deepseek-chat`（不支持）

### Q: AI 回复内容不完整？

**A:** 可能是 token 限制导致，尝试增加最大 token 数：

```typescript
// 在 src/services/deepseek.ts 中修改
const config = {
  // ... 其他配置
  maxTokens: 4000,  // 增加到 4000
};
```

## 💾 数据存储问题

### Q: 对话历史丢失了？

**A:** 对话历史存储在浏览器的 IndexedDB 中，可能的原因：

1. **浏览器清理了数据**：
   - 检查浏览器存储设置
   - 避免使用无痕模式
   - 将网站添加到收藏夹

2. **存储空间不足**：
   - 清理浏览器缓存
   - 删除不需要的对话

3. **浏览器兼容性**：
   - 使用现代浏览器（Chrome 58+、Firefox 55+）
   - 启用 JavaScript

### Q: 如何备份对话历史？

**A:** 目前可以通过浏览器开发者工具手动备份：

1. 打开开发者工具（F12）
2. 进入 Application/Storage 标签
3. 找到 IndexedDB → ChatAppDB
4. 导出数据（功能开发中）

### Q: 如何清空所有数据？

**A:** 有以下几种方法：

1. **通过应用界面**：
   - 逐个删除对话
   - 清空单个对话的消息

2. **通过浏览器**：
   - 开发者工具 → Application → Storage
   - 清除网站数据

3. **通过代码**（开发者）：
```javascript
// 在浏览器控制台执行
indexedDB.deleteDatabase('ChatAppDB');
```

## 🎨 界面使用问题

### Q: 侧边栏无法显示或隐藏？

**A:** 检查以下几点：
1. 点击左上角的菜单按钮
2. 检查浏览器窗口大小（移动端自动隐藏）
3. 刷新页面重试

### Q: 移动端界面显示异常？

**A:** 确保使用现代移动浏览器：
- iOS Safari 12+
- Android Chrome 70+
- 避免使用过旧的浏览器

### Q: 如何编辑对话标题？

**A:** 有两种方法：

1. **直接编辑**：
   - 点击聊天界面顶部的标题
   - 修改后按 Enter 保存

2. **右键菜单**：
   - 在侧边栏右键点击对话
   - 选择「重命名」

### Q: 消息发送后没有反应？

**A:** 可能的原因和解决方案：

1. **网络问题**：
   - 检查网络连接
   - 查看浏览器控制台错误信息

2. **API 配置问题**：
   - 检查 API 密钥是否正确
   - 验证 API 服务地址

3. **浏览器问题**：
   - 刷新页面重试
   - 清除浏览器缓存

## 🔧 技术问题

### Q: 开发服务器启动失败？

**A:** 常见解决方案：

1. **端口被占用**：
```bash
# 查看端口占用
netstat -ano | findstr :3001

# 或修改端口
npm run dev -- --port 3002
```

2. **依赖问题**：
```bash
# 清除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

3. **Node.js 版本**：
   - 确保使用 Node.js 16+
   - 使用 nvm 管理 Node.js 版本

### Q: 构建失败？

**A:** 检查以下问题：

1. **TypeScript 错误**：
```bash
# 运行类型检查
npm run type-check
```

2. **ESLint 错误**：
```bash
# 运行代码检查
npm run lint

# 自动修复
npm run lint -- --fix
```

3. **内存不足**：
```bash
# 增加 Node.js 内存限制
node --max-old-space-size=4096 node_modules/.bin/vite build
```

### Q: 微前端集成失败？

**A:** 检查 micro-app 集成配置：

1. **父应用配置**：
```javascript
// 确保正确注册 micro-app
import microApp from '@micro-zoe/micro-app';

microApp.start({
  'disable-memory-router': true,
  'disable-patch-request': true
});
```

2. **子应用配置**：
```javascript
// 确保正确处理生命周期
if (window.__MICRO_APP_ENVIRONMENT__) {
  // 微前端环境下的特殊处理
}
```

3. **路由配置**：
   - 确保路由配置正确
   - 检查基础路径设置

## 🛡️ 安全问题

### Q: API 密钥安全吗？

**A:** 本应用的安全措施：

1. **客户端存储**：API 密钥存储在用户本地
2. **HTTPS 传输**：所有 API 请求使用 HTTPS
3. **无服务器存储**：不会将密钥上传到任何服务器
4. **环境变量**：使用环境变量管理敏感信息

**安全建议**：
- 定期更换 API 密钥
- 不要在公共场所使用
- 不要分享包含密钥的配置文件

### Q: 对话内容会被保存到服务器吗？

**A:** 不会。本应用的数据处理：

1. **本地存储**：所有对话历史仅存储在用户设备上
2. **API 调用**：只向 AI 服务发送当前对话内容
3. **无日志记录**：应用不记录或上传用户数据
4. **隐私保护**：完全保护用户隐私

## 🔄 更新和维护

### Q: 如何更新到最新版本？

**A:** 更新步骤：

1. **Git 更新**：
```bash
git pull origin main
npm install
npm run build
```

2. **Docker 更新**：
```bash
docker pull your-registry/chat-app:latest
docker-compose up -d
```

3. **手动更新**：
   - 下载最新代码
   - 重新安装依赖
   - 重新构建项目

### Q: 如何启用开发工具？

**A:** 在 `.env` 文件中添加：

```env
VITE_DEV_TOOLS=true
VITE_DEBUG=true
```

这将启用：
- Vue DevTools
- 详细的控制台日志
- 性能监控信息

## 📞 获取帮助

### Q: 遇到未解决的问题怎么办？

**A:** 可以通过以下方式获取帮助：

1. **查看文档**：
   - [功能概览](./features.md)
   - [开发指南](./development.md)
   - [AI 配置](./ai-configuration.md)

2. **检查日志**：
   - 浏览器开发者工具控制台
   - 网络请求日志
   - 错误堆栈信息

3. **提交 Issue**：
   - 描述问题现象
   - 提供错误信息
   - 说明环境配置
   - 提供复现步骤

4. **社区讨论**：
   - GitHub Discussions
   - 技术论坛
   - 开发者社群

### Q: 如何报告 Bug？

**A:** 报告 Bug 时请提供：

1. **问题描述**：详细描述问题现象
2. **复现步骤**：提供详细的复现步骤
3. **环境信息**：
   - 操作系统版本
   - 浏览器版本
   - Node.js 版本
   - 项目版本
4. **错误信息**：控制台错误日志
5. **截图或录屏**：如果有界面问题

### Q: 如何贡献代码？

**A:** 贡献流程：

1. **Fork 项目**：在 GitHub 上 Fork 项目
2. **创建分支**：创建功能分支
3. **开发功能**：按照开发规范编写代码
4. **测试验证**：确保功能正常工作
5. **提交 PR**：提交 Pull Request
6. **代码审查**：等待代码审查和合并

---

如果您的问题没有在此列出，请查看其他文档或提交 Issue 获取帮助。