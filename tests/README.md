# 测试文档

本项目使用 Vitest 作为测试框架，提供了完整的单元测试覆盖。

## 测试结构

```
tests/
├── setup.ts                    # 测试环境设置
├── stores/                      # Store 测试
│   ├── user.test.ts            # 用户状态管理测试
│   └── chat.test.ts            # 聊天状态管理测试
├── services/                    # 服务层测试
│   └── deepseek.test.ts        # DeepSeek 服务测试
├── views/                       # 视图组件测试
│   └── ChatView.test.ts        # 聊天视图测试
├── components/                  # 组件测试
│   └── MessageItem.test.ts     # 消息项组件测试
├── utils/                       # 工具函数测试
│   └── index.test.ts           # 工具函数测试
└── README.md                    # 测试文档
```

## 运行测试

### 基本命令

```bash
# 安装依赖
pnpm install

# 运行所有测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 运行测试 UI 界面
pnpm test:ui

# 运行测试（非监听模式）
pnpm test:run
```

### 监听模式

```bash
# 监听文件变化并自动运行测试
pnpm test

# 监听特定文件
pnpm test user.test.ts

# 监听特定目录
pnpm test stores/
```

## 测试覆盖率

项目配置了严格的测试覆盖率要求：

- **全局覆盖率阈值**: 80%
- **分支覆盖率**: 80%
- **函数覆盖率**: 80%
- **行覆盖率**: 80%
- **语句覆盖率**: 80%

### 查看覆盖率报告

```bash
# 生成覆盖率报告
pnpm test:coverage

# 报告将生成在 coverage/ 目录下
# 打开 coverage/index.html 查看详细报告
```

## 测试环境配置

### 全局设置 (tests/setup.ts)

- **DOM 环境**: 使用 `happy-dom` 模拟浏览器环境
- **全局变量**: 模拟 `window` 对象和 micro-app 相关属性
- **API Mock**: 模拟 `fetch`、`localStorage`、`sessionStorage` 等
- **观察者 Mock**: 模拟 `IntersectionObserver`、`ResizeObserver`
- **环境变量**: 设置测试环境变量

### Mock 策略

1. **外部依赖**: 使用 `vi.mock()` 模拟外部库
2. **API 调用**: 模拟网络请求和响应
3. **浏览器 API**: 模拟浏览器原生 API
4. **时间相关**: 使用 `vi.useFakeTimers()` 控制时间

## 测试类型

### 1. Store 测试

测试 Pinia store 的状态管理逻辑：

- 初始状态验证
- 状态变更操作
- 计算属性
- 异步操作

**示例**:
```typescript
it('应该正确设置用户信息', () => {
  const userStore = useUserStore()
  const mockUserInfo = { id: '123', name: '张三' }
  
  userStore.setUserInfo(mockUserInfo)
  
  expect(userStore.userInfo).toEqual(mockUserInfo)
  expect(userStore.isLoggedIn).toBe(true)
})
```

### 2. 服务层测试

测试业务逻辑和 API 调用：

- 配置管理
- API 调用
- 错误处理
- 数据转换

**示例**:
```typescript
it('应该正确发送消息', async () => {
  const service = new OpenAIService()
  service.updateConfig({ apiKey: 'test-key' })
  
  mockChatOpenAI.invoke.mockResolvedValue({ content: 'AI回复' })
  
  const result = await service.sendMessage([], 'test message')
  expect(result).toBe('AI回复')
})
```

### 3. 组件测试

测试 Vue 组件的渲染和交互：

- 组件渲染
- 用户交互
- 事件处理
- 属性传递

**示例**:
```typescript
it('应该正确渲染用户消息', () => {
  const wrapper = mount(MessageItem, {
    props: { message: mockMessage }
  })
  
  expect(wrapper.find('.message.user').exists()).toBe(true)
  expect(wrapper.find('.message-content').text()).toBe('测试消息')
})
```

### 4. 工具函数测试

测试纯函数的输入输出：

- 边界条件
- 异常处理
- 数据转换
- 算法逻辑

**示例**:
```typescript
it('应该正确格式化时间戳', () => {
  const timestamp = new Date('2024-01-01T09:05:00').getTime()
  const formatted = formatTimestamp(timestamp)
  expect(formatted).toBe('09:05')
})
```

## 最佳实践

### 1. 测试命名

- 使用描述性的测试名称
- 遵循 "应该..." 的格式
- 明确测试的预期行为

```typescript
// ✅ 好的命名
it('应该在用户输入为空时禁用发送按钮', () => {})

// ❌ 不好的命名
it('测试按钮', () => {})
```

### 2. 测试结构

使用 AAA 模式（Arrange, Act, Assert）：

```typescript
it('应该正确添加消息', () => {
  // Arrange - 准备测试数据
  const chatStore = useChatStore()
  
  // Act - 执行操作
  const messageId = chatStore.addMessage('测试消息', 'user')
  
  // Assert - 验证结果
  expect(chatStore.currentMessages).toHaveLength(1)
  expect(chatStore.currentMessages[0].content).toBe('测试消息')
})
```

### 3. Mock 使用

- 只 mock 必要的依赖
- 在 `beforeEach` 中重置 mock
- 验证 mock 的调用

```typescript
beforeEach(() => {
  vi.clearAllMocks()
})

it('应该调用 API', async () => {
  mockApi.post.mockResolvedValue({ data: 'success' })
  
  await service.sendMessage('test')
  
  expect(mockApi.post).toHaveBeenCalledWith('/api/chat', {
    message: 'test'
  })
})
```

### 4. 异步测试

正确处理异步操作：

```typescript
it('应该处理异步操作', async () => {
  const promise = service.asyncOperation()
  
  // 等待操作完成
  await expect(promise).resolves.toBe('expected result')
  
  // 或者测试错误情况
  await expect(promise).rejects.toThrow('Expected error')
})
```

### 5. 边界条件测试

确保测试覆盖边界情况：

```typescript
describe('边界条件', () => {
  it('应该处理空输入', () => {
    expect(formatMessage('')).toBe('')
  })
  
  it('应该处理 null 值', () => {
    expect(formatMessage(null)).toBe('')
  })
  
  it('应该处理超长文本', () => {
    const longText = 'A'.repeat(10000)
    expect(() => formatMessage(longText)).not.toThrow()
  })
})
```

## 调试测试

### 1. 使用调试器

```typescript
it('调试测试', () => {
  debugger // 在浏览器中会暂停执行
  expect(true).toBe(true)
})
```

### 2. 输出调试信息

```typescript
it('输出调试信息', () => {
  console.log('当前状态:', store.state)
  expect(store.state.count).toBe(1)
})
```

### 3. 使用 test.only

```typescript
// 只运行这个测试
it.only('重点测试', () => {
  expect(true).toBe(true)
})
```

## 持续集成

在 CI/CD 流程中运行测试：

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm install
      - run: pnpm test:run
      - run: pnpm test:coverage
```

## 常见问题

### 1. 测试超时

```typescript
// 增加超时时间
it('长时间运行的测试', async () => {
  // 测试逻辑
}, 10000) // 10秒超时
```

### 2. DOM 操作

```typescript
// 等待 DOM 更新
it('DOM 测试', async () => {
  wrapper.find('button').trigger('click')
  await wrapper.vm.$nextTick() // 等待 Vue 更新 DOM
  expect(wrapper.find('.result').text()).toBe('expected')
})
```

### 3. 时间相关测试

```typescript
it('时间测试', () => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2024-01-01'))
  
  const result = getCurrentDate()
  expect(result).toBe('2024-01-01')
  
  vi.useRealTimers()
})
```

## 测试报告

测试完成后，可以查看以下报告：

1. **控制台输出**: 测试结果摘要
2. **覆盖率报告**: `coverage/index.html`
3. **测试 UI**: 通过 `pnpm test:ui` 启动

## 贡献指南

添加新功能时，请确保：

1. 为新功能编写对应的测试
2. 保持测试覆盖率在 80% 以上
3. 遵循现有的测试模式和命名约定
4. 在提交前运行所有测试确保通过

---

更多信息请参考 [Vitest 官方文档](https://vitest.dev/) 和 [Vue Test Utils 文档](https://test-utils.vuejs.org/)。