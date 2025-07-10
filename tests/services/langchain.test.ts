import { describe, it, expect, beforeEach, vi, type MockedFunction } from 'vitest'
import { LangChainService } from '@/services/langchain'
import type { ChatMessage } from '@/stores/chat'

// Mock LangChain modules
vi.mock('@langchain/openai', () => ({
  ChatOpenAI: vi.fn().mockImplementation(() => ({
    invoke: vi.fn(),
    stream: vi.fn()
  }))
}))

vi.mock('@langchain/core/messages', () => ({
  HumanMessage: vi.fn().mockImplementation((content) => ({ content, type: 'human' })),
  AIMessage: vi.fn().mockImplementation((content) => ({ content, type: 'ai' }))
}))

/**
 * LangChain服务单元测试
 */
describe('LangChainService', () => {
  let service: LangChainService
  let mockChatOpenAI: any

  beforeEach(() => {
    // 重置所有mock
    vi.clearAllMocks()
    
    // 创建服务实例
    service = new LangChainService()
    
    // 获取mock的ChatOpenAI实例
    const { ChatOpenAI } = require('@langchain/openai')
    mockChatOpenAI = new ChatOpenAI()
  })

  describe('配置管理', () => {
    it('应该正确设置默认配置', () => {
      const config = service.getConfig()
      
      expect(config).toEqual({
        apiKey: '',
        baseURL: 'https://api.openai.com/v1',
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2000,
        streaming: true
      })
    })

    it('应该正确更新配置', () => {
      const newConfig = {
        apiKey: 'test-api-key',
        model: 'gpt-4',
        temperature: 0.5
      }
      
      service.updateConfig(newConfig)
      const config = service.getConfig()
      
      expect(config.apiKey).toBe('test-api-key')
      expect(config.model).toBe('gpt-4')
      expect(config.temperature).toBe(0.5)
      // 其他配置应该保持不变
      expect(config.baseURL).toBe('https://api.openai.com/v1')
      expect(config.maxTokens).toBe(2000)
    })

    it('应该正确验证配置有效性', () => {
      // 默认配置应该无效（没有API key）
      expect(service.isConfigValid()).toBe(false)
      
      // 设置API key后应该有效
      service.updateConfig({ apiKey: 'test-api-key' })
      expect(service.isConfigValid()).toBe(true)
      
      // 空字符串API key应该无效
      service.updateConfig({ apiKey: '' })
      expect(service.isConfigValid()).toBe(false)
      
      // 只有空格的API key应该无效
      service.updateConfig({ apiKey: '   ' })
      expect(service.isConfigValid()).toBe(false)
    })
  })

  describe('消息转换', () => {
    it('应该正确转换用户消息', () => {
      const chatMessages: ChatMessage[] = [
        {
          id: '1',
          content: '你好',
          role: 'user',
          timestamp: Date.now(),
          status: 'sent'
        }
      ]
      
      const langchainMessages = service.convertToLangChainMessages(chatMessages)
      
      expect(langchainMessages).toHaveLength(1)
      expect(langchainMessages[0]).toEqual({ content: '你好', type: 'human' })
    })

    it('应该正确转换AI消息', () => {
      const chatMessages: ChatMessage[] = [
        {
          id: '1',
          content: '你好！我是AI助手',
          role: 'assistant',
          timestamp: Date.now(),
          status: 'sent'
        }
      ]
      
      const langchainMessages = service.convertToLangChainMessages(chatMessages)
      
      expect(langchainMessages).toHaveLength(1)
      expect(langchainMessages[0]).toEqual({ content: '你好！我是AI助手', type: 'ai' })
    })

    it('应该正确转换混合消息', () => {
      const chatMessages: ChatMessage[] = [
        {
          id: '1',
          content: '你好',
          role: 'user',
          timestamp: Date.now(),
          status: 'sent'
        },
        {
          id: '2',
          content: '你好！有什么可以帮助你的吗？',
          role: 'assistant',
          timestamp: Date.now(),
          status: 'sent'
        },
        {
          id: '3',
          content: '请介绍一下你自己',
          role: 'user',
          timestamp: Date.now(),
          status: 'sent'
        }
      ]
      
      const langchainMessages = service.convertToLangChainMessages(chatMessages)
      
      expect(langchainMessages).toHaveLength(3)
      expect(langchainMessages[0]).toEqual({ content: '你好', type: 'human' })
      expect(langchainMessages[1]).toEqual({ content: '你好！有什么可以帮助你的吗？', type: 'ai' })
      expect(langchainMessages[2]).toEqual({ content: '请介绍一下你自己', type: 'human' })
    })

    it('应该忽略未知角色的消息', () => {
      const chatMessages: ChatMessage[] = [
        {
          id: '1',
          content: '你好',
          role: 'user',
          timestamp: Date.now(),
          status: 'sent'
        },
        {
          id: '2',
          content: '系统消息',
          role: 'system' as any, // 未知角色
          timestamp: Date.now(),
          status: 'sent'
        }
      ]
      
      const langchainMessages = service.convertToLangChainMessages(chatMessages)
      
      expect(langchainMessages).toHaveLength(1)
      expect(langchainMessages[0]).toEqual({ content: '你好', type: 'human' })
    })
  })

  describe('发送消息', () => {
    beforeEach(() => {
      // 设置有效配置
      service.updateConfig({ apiKey: 'test-api-key' })
    })

    it('应该在配置无效时抛出错误', async () => {
      service.updateConfig({ apiKey: '' })
      
      await expect(service.sendMessage([], 'test message'))
        .rejects.toThrow('LangChain配置无效，请检查API密钥等设置')
    })

    it('应该正确发送非流式消息', async () => {
      const mockResponse = { content: 'AI回复内容' }
      mockChatOpenAI.invoke.mockResolvedValue(mockResponse)
      
      service.updateConfig({ streaming: false })
      
      const result = await service.sendMessage([], 'test message')
      
      expect(result).toBe('AI回复内容')
      expect(mockChatOpenAI.invoke).toHaveBeenCalledTimes(1)
    })

    it('应该正确处理流式消息', async () => {
      const mockChunks = [
        { content: 'Hello' },
        { content: ' ' },
        { content: 'World' }
      ]
      
      // 创建异步迭代器
      const mockStream = {
        async *[Symbol.asyncIterator]() {
          for (const chunk of mockChunks) {
            yield chunk
          }
        }
      }
      
      mockChatOpenAI.stream.mockResolvedValue(mockStream)
      
      const onChunk = vi.fn()
      const result = await service.sendMessage([], 'test message', onChunk)
      
      expect(result).toBe('Hello World')
      expect(onChunk).toHaveBeenCalledTimes(3)
      expect(onChunk).toHaveBeenNthCalledWith(1, 'Hello')
      expect(onChunk).toHaveBeenNthCalledWith(2, ' ')
      expect(onChunk).toHaveBeenNthCalledWith(3, 'World')
    })

    it('应该正确处理API错误', async () => {
      const mockError = new Error('API调用失败')
      mockChatOpenAI.invoke.mockRejectedValue(mockError)
      
      service.updateConfig({ streaming: false })
      
      await expect(service.sendMessage([], 'test message'))
        .rejects.toThrow('API调用失败')
    })

    it('应该正确处理流式API错误', async () => {
      const mockError = new Error('流式API调用失败')
      mockChatOpenAI.stream.mockRejectedValue(mockError)
      
      const onChunk = vi.fn()
      
      await expect(service.sendMessage([], 'test message', onChunk))
        .rejects.toThrow('流式API调用失败')
    })

    it('应该正确处理空响应', async () => {
      mockChatOpenAI.invoke.mockResolvedValue({ content: '' })
      
      service.updateConfig({ streaming: false })
      
      const result = await service.sendMessage([], 'test message')
      
      expect(result).toBe('')
    })

    it('应该正确处理undefined响应内容', async () => {
      mockChatOpenAI.invoke.mockResolvedValue({ content: undefined })
      
      service.updateConfig({ streaming: false })
      
      const result = await service.sendMessage([], 'test message')
      
      expect(result).toBe('')
    })

    it('应该正确处理流式响应中的空chunk', async () => {
      const mockChunks = [
        { content: 'Hello' },
        { content: '' },
        { content: undefined },
        { content: 'World' }
      ]
      
      const mockStream = {
        async *[Symbol.asyncIterator]() {
          for (const chunk of mockChunks) {
            yield chunk
          }
        }
      }
      
      mockChatOpenAI.stream.mockResolvedValue(mockStream)
      
      const onChunk = vi.fn()
      const result = await service.sendMessage([], 'test message', onChunk)
      
      expect(result).toBe('HelloWorld')
      expect(onChunk).toHaveBeenCalledTimes(4)
      expect(onChunk).toHaveBeenNthCalledWith(1, 'Hello')
      expect(onChunk).toHaveBeenNthCalledWith(2, '')
      expect(onChunk).toHaveBeenNthCalledWith(3, '')
      expect(onChunk).toHaveBeenNthCalledWith(4, 'World')
    })
  })

  describe('边界情况', () => {
    it('应该正确处理空消息历史', () => {
      const langchainMessages = service.convertToLangChainMessages([])
      expect(langchainMessages).toEqual([])
    })

    it('应该正确处理极端配置值', () => {
      service.updateConfig({
        temperature: 0,
        maxTokens: 1
      })
      
      const config = service.getConfig()
      expect(config.temperature).toBe(0)
      expect(config.maxTokens).toBe(1)
    })

    it('应该正确处理配置中的undefined值', () => {
      service.updateConfig({
        temperature: undefined as any,
        maxTokens: undefined as any
      })
      
      const config = service.getConfig()
      // undefined值应该被忽略，保持原有值
      expect(config.temperature).toBe(0.7)
      expect(config.maxTokens).toBe(2000)
    })
  })
})