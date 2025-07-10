import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages'
import type { BaseMessage } from '@langchain/core/messages'
import type { ChatMessage } from '@/stores/chat'

/**
 * LangChain配置接口
 */
export interface LangChainConfig {
  apiKey?: string
  baseURL?: string
  model?: string
  temperature?: number
  maxTokens?: number
}

/**
 * LangChain服务类
 */
export class LangChainService {
  private chatModel: ChatOpenAI
  private config: LangChainConfig

  constructor(config: LangChainConfig = {}) {
    this.config = {
      apiKey: config.apiKey || import.meta.env.VITE_OPENAI_API_KEY || '',
      baseURL: config.baseURL || import.meta.env.VITE_API_BASE_URL || 'https://api.openai.com/v1',
      model: config.model || import.meta.env.VITE_DEFAULT_MODEL || 'gpt-3.5-turbo',
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 2000
    }
    console.log('LangChainService initialized with config:', this.config)

    this.chatModel = new ChatOpenAI({
      openAIApiKey: this.config.apiKey,
      configuration: {
        baseURL: this.config.baseURL
      },
      modelName: this.config.model,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens
    })

  }

  /**
   * 将聊天消息转换为LangChain消息格式
   * @param messages - 聊天消息数组
   * @returns LangChain消息数组
   */
  private convertToLangChainMessages(messages: ChatMessage[]): BaseMessage[] {
    return messages.map(msg => {
      switch (msg.role) {
        case 'user':
          return new HumanMessage(msg.content)
        case 'assistant':
          return new AIMessage(msg.content)
        case 'system':
          return new SystemMessage(msg.content)
        default:
          return new HumanMessage(msg.content)
      }
    })
  }

  /**
   * 发送消息并获取AI回复
   * @param messages - 消息历史
   * @param onStream - 流式回调函数
   * @returns AI回复内容
   */
  async sendMessage(
    messages: ChatMessage[],
    onStream?: (chunk: string) => void
  ): Promise<string> {
    try {
      const langChainMessages = this.convertToLangChainMessages(messages)
      
      if (onStream) {
        // 流式响应
        const stream = await this.chatModel.stream(langChainMessages)
        let fullResponse = ''
        
        for await (const chunk of stream) {
          const content = chunk.content as string
          fullResponse += content
          onStream(content)
        }
        
        return fullResponse
      } else {
        // 普通响应
        const response = await this.chatModel.invoke(langChainMessages)
        return response.content as string
      }
    } catch (error) {
      console.error('LangChain service error:', error)
      throw new Error(`AI服务错误: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 更新配置
   * @param newConfig - 新配置
   */
  updateConfig(newConfig: Partial<LangChainConfig>) {
    this.config = { ...this.config, ...newConfig }
    
    // 重新创建聊天模型实例
    this.chatModel = new ChatOpenAI({
      openAIApiKey: this.config.apiKey,
      configuration: {
        baseURL: this.config.baseURL
      },
      modelName: this.config.model,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens
    })
  }

  /**
   * 获取当前配置
   * @returns 当前配置
   */
  getConfig(): LangChainConfig {
    return { ...this.config }
  }

  /**
   * 检查配置是否有效
   * @returns 是否有效
   */
  isConfigValid(): boolean {
    return !!this.config.apiKey
  }
}

// 创建默认实例
export const langChainService = new LangChainService()

/**
 * 创建自定义LangChain服务实例
 * @param config - 配置选项
 * @returns LangChain服务实例
 */
export const createLangChainService = (config: LangChainConfig) => {
  return new LangChainService(config)
}
