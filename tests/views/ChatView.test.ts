import { describe, it, expect, beforeEach, afterEach, vi, type MockedFunction } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ChatView from '@/views/ChatView.vue'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { OpenAIService } from '@/services/openai'

// Mock OpenAI service
vi.mock('@/services/openai', () => ({
  OpenAIService: vi.fn().mockImplementation(() => ({
    sendMessage: vi.fn(),
    isConfigValid: vi.fn().mockReturnValue(true),
    getConfig: vi.fn().mockReturnValue({
      apiKey: 'test-key',
      model: 'gpt-3.5-turbo'
    })
  }))
}))

/**
 * ChatView组件单元测试
 */
describe('ChatView', () => {
  let wrapper: VueWrapper<any>
  let chatStore: ReturnType<typeof useChatStore>
  let userStore: ReturnType<typeof useUserStore>
  let mockOpenAIService: any

  beforeEach(async () => {
    // 设置Pinia
    setActivePinia(createPinia())
    
    // 获取stores
    chatStore = useChatStore()
    userStore = useUserStore()
    
    // 设置用户信息
    userStore.setUserInfo({
      id: '123',
      name: '测试用户',
      avatar: 'https://example.com/avatar.jpg'
    })
    
    // 获取mock的OpenAI服务
    const { OpenAIService } = await import('@/services/openai')
    mockOpenAIService = new OpenAIService()
    
    // 挂载组件
    wrapper = mount(ChatView, {
      global: {
        plugins: [createPinia()]
      }
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    vi.clearAllMocks()
  })

  describe('组件渲染', () => {
    it('应该正确渲染基本结构', () => {
      expect(wrapper.find('.chat-container').exists()).toBe(true)
      expect(wrapper.find('.chat-header').exists()).toBe(true)
      expect(wrapper.find('.chat-messages').exists()).toBe(true)
      expect(wrapper.find('.chat-input').exists()).toBe(true)
    })

    it('应该显示用户头像和名称', () => {
      const userInfo = wrapper.find('.user-info')
      expect(userInfo.exists()).toBe(true)
      expect(userInfo.text()).toContain('测试用户')
    })

    it('应该显示清空对话按钮', () => {
      const clearButton = wrapper.find('.clear-chat')
      expect(clearButton.exists()).toBe(true)
      expect(clearButton.text()).toContain('清空对话')
    })

    it('应该显示消息输入框', () => {
      const textarea = wrapper.find('textarea')
      expect(textarea.exists()).toBe(true)
      expect(textarea.attributes('placeholder')).toBe('输入消息...')
    })

    it('应该显示发送按钮', () => {
      const sendButton = wrapper.find('.send-button')
      expect(sendButton.exists()).toBe(true)
      expect(sendButton.text()).toContain('发送')
    })
  })

  describe('消息显示', () => {
    it('应该正确显示用户消息', async () => {
      // 添加用户消息
      chatStore.addMessage('你好', 'user')
      await wrapper.vm.$nextTick()
      
      const userMessage = wrapper.find('.message.user')
      expect(userMessage.exists()).toBe(true)
      expect(userMessage.find('.message-content').text()).toBe('你好')
    })

    it('应该正确显示AI消息', async () => {
      // 添加AI消息
      chatStore.addMessage('你好！我是AI助手', 'assistant')
      await wrapper.vm.$nextTick()
      
      const aiMessage = wrapper.find('.message.assistant')
      expect(aiMessage.exists()).toBe(true)
      expect(aiMessage.find('.message-content').text()).toBe('你好！我是AI助手')
    })

    it('应该显示消息时间戳', async () => {
      chatStore.addMessage('测试消息', 'user')
      await wrapper.vm.$nextTick()
      
      const timestamp = wrapper.find('.message-time')
      expect(timestamp.exists()).toBe(true)
    })

    it('应该显示加载指示器', async () => {
      chatStore.setLoading(true)
      await wrapper.vm.$nextTick()
      
      const loadingIndicator = wrapper.find('.loading-indicator')
      expect(loadingIndicator.exists()).toBe(true)
    })

    it('应该显示错误消息', async () => {
      chatStore.setError('测试错误信息')
      await wrapper.vm.$nextTick()
      
      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toContain('测试错误信息')
    })

    it('空对话时应该显示欢迎消息', async () => {
      // 清空当前会话
      chatStore.clearCurrentSession()
      await wrapper.vm.$nextTick()
      
      const welcomeMessage = wrapper.find('.welcome-message')
      expect(welcomeMessage.exists()).toBe(true)
    })
  })

  describe('用户交互', () => {
    it('应该能够输入消息', async () => {
      const textarea = wrapper.find('textarea')
      await textarea.setValue('测试输入')
      
      expect(wrapper.vm.inputMessage).toBe('测试输入')
    })

    it('应该能够通过按钮发送消息', async () => {
      const textarea = wrapper.find('textarea')
      const sendButton = wrapper.find('.send-button')
      
      await textarea.setValue('测试消息')
      
      // Mock sendMessage方法
      mockOpenAIService.sendMessage.mockResolvedValue('AI回复')
      
      await sendButton.trigger('click')
      
      // 验证消息被添加到store
      expect(chatStore.currentMessages.some(m => m.content === '测试消息')).toBe(true)
    })

    it('应该能够通过Enter键发送消息', async () => {
      const textarea = wrapper.find('textarea')
      
      await textarea.setValue('测试消息')
      
      // Mock sendMessage方法
      mockOpenAIService.sendMessage.mockResolvedValue('AI回复')
      
      await textarea.trigger('keydown', { key: 'Enter', ctrlKey: false, shiftKey: false })
      
      // 验证消息被添加到store
      expect(chatStore.currentMessages.some(m => m.content === '测试消息')).toBe(true)
    })

    it('Shift+Enter应该换行而不是发送', async () => {
      const textarea = wrapper.find('textarea')
      
      await textarea.setValue('第一行')
      await textarea.trigger('keydown', { key: 'Enter', shiftKey: true })
      
      // 消息不应该被发送
      expect(chatStore.currentMessages).toHaveLength(1) // 只有初始的欢迎消息
    })

    it('应该能够清空对话', async () => {
      // 添加一些消息
      chatStore.addMessage('消息1', 'user')
      chatStore.addMessage('消息2', 'assistant')
      
      const clearButton = wrapper.find('.clear-chat')
      await clearButton.trigger('click')
      
      // 验证消息被清空
      expect(chatStore.currentMessages).toHaveLength(0)
    })

    it('空消息不应该被发送', async () => {
      const sendButton = wrapper.find('.send-button')
      
      // 不输入任何内容直接发送
      await sendButton.trigger('click')
      
      // 验证没有新消息被添加
      expect(chatStore.currentMessages).toHaveLength(1) // 只有初始的欢迎消息
    })

    it('只有空格的消息不应该被发送', async () => {
      const textarea = wrapper.find('textarea')
      const sendButton = wrapper.find('.send-button')
      
      await textarea.setValue('   ')
      await sendButton.trigger('click')
      
      // 验证没有新消息被添加
      expect(chatStore.currentMessages).toHaveLength(1) // 只有初始的欢迎消息
    })
  })

  describe('发送消息逻辑', () => {
    it('发送消息时应该显示加载状态', async () => {
      const textarea = wrapper.find('textarea')
      const sendButton = wrapper.find('.send-button')
      
      // Mock一个延迟的响应
      mockOpenAIService.sendMessage.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve('AI回复'), 100))
      )
      
      await textarea.setValue('测试消息')
      await sendButton.trigger('click')
      
      // 验证加载状态
      expect(chatStore.isLoading).toBe(true)
      expect(sendButton.attributes('disabled')).toBeDefined()
    })

    it('应该正确处理API错误', async () => {
      const textarea = wrapper.find('textarea')
      const sendButton = wrapper.find('.send-button')
      
      // Mock API错误
      mockOpenAIService.sendMessage.mockRejectedValue(new Error('API错误'))
      
      await textarea.setValue('测试消息')
      await sendButton.trigger('click')
      
      // 等待错误处理
      await wrapper.vm.$nextTick()
      
      // 验证错误状态
      expect(chatStore.error).toBeTruthy()
    })

    it('应该正确处理流式响应', async () => {
      const textarea = wrapper.find('textarea')
      const sendButton = wrapper.find('.send-button')
      
      // Mock流式响应
      const mockOnChunk = vi.fn()
      mockOpenAIService.sendMessage.mockImplementation((messages, userMessage, onChunk) => {
        // 模拟流式响应
        onChunk('Hello')
        onChunk(' ')
        onChunk('World')
        return Promise.resolve('Hello World')
      })
      
      await textarea.setValue('测试消息')
      await sendButton.trigger('click')
      
      // 等待响应处理
      await wrapper.vm.$nextTick()
      
      // 验证AI消息被添加
      expect(chatStore.currentMessages.some(m => 
        m.role === 'assistant' && m.content === 'Hello World'
      )).toBe(true)
    })
  })

  describe('文本框自适应高度', () => {
    it('应该根据内容调整文本框高度', async () => {
      const textarea = wrapper.find('textarea')
      
      // 输入多行文本
      const multilineText = '第一行\n第二行\n第三行'
      await textarea.setValue(multilineText)
      
      // 触发input事件
      await textarea.trigger('input')
      
      // 验证高度被调整（具体值可能因浏览器而异，这里主要验证方法被调用）
      expect(textarea.element.style.height).toBeTruthy()
    })
  })

  describe('消息格式化', () => {
    it('应该正确格式化时间', () => {
      const timestamp = new Date('2024-01-01T12:30:45').getTime()
      const formatted = wrapper.vm.formatTime(timestamp)
      
      expect(formatted).toMatch(/\d{2}:\d{2}/)
    })

    it('应该正确格式化消息内容', () => {
      const content = '这是一条\n包含换行的\n消息'
      const formatted = wrapper.vm.formatMessage(content)
      
      expect(formatted).toContain('<br>')
    })
  })

  describe('配置验证', () => {
    it('配置无效时应该显示警告', async () => {
      // Mock配置无效
      mockOpenAIService.isConfigValid.mockReturnValue(false)
      
      // 重新挂载组件
      wrapper.unmount()
      wrapper = mount(ChatView, {
        global: {
          plugins: [createPinia()]
        }
      })
      
      await wrapper.vm.$nextTick()
      
      const configWarning = wrapper.find('.config-warning')
      expect(configWarning.exists()).toBe(true)
    })
  })
})