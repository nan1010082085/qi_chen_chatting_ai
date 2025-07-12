import { ChatDeepSeek } from '@langchain/deepseek'
import { HumanMessage, AIMessage } from '@langchain/core/messages'
import type { BaseMessage } from '@langchain/core/messages'
import type { ChatMessage } from '@/stores/chat'

/**
 * DeepSeek 配置接口
 */
export interface DeepSeekConfig {
  /** API 密钥 */
  apiKey?: string
  /** 模型名称 */
  model?: string
  /** 温度参数 */
  temperature?: number
  /** 最大 token 数 */
  maxTokens?: number
  /** API 基础 URL */
  baseURL?: string
  /** 请求超时时间 */
  timeout?: number
  /** 是否开启思考模式 */
  enable_thinking?: boolean
}

/**
 * DeepSeek 服务类
 * 提供与 DeepSeek AI 模型的交互功能
 */
export class DeepSeekService {
  private chatModel: ChatDeepSeek
  private config: DeepSeekConfig

  /**
   * 构造函数
   * @param config - DeepSeek 配置
   */
  constructor(config: DeepSeekConfig = {}) {
    this.config = {
      apiKey: config.apiKey || import.meta.env.VITE_OPENAI_API_KEY,
      model: config.model || import.meta.env.VITE_DEFAULT_MODEL,
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 2000,
      baseURL: config.baseURL || import.meta.env.VITE_API_BASE_URL || 'https://api.siliconflow.cn/v1',
      timeout: config.timeout ?? 30000,
      enable_thinking: config.enable_thinking || true,
    }

    // 初始化聊天模型
    this.chatModel = new ChatDeepSeek({
      apiKey: this.config.apiKey,
      model: this.config.model,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
      configuration: {
        baseURL: this.config.baseURL,
      },
    })

    console.log('DeepSeekService initialized with config:', this.config)
  }

  /**
   * 将聊天消息转换为 LangChain 消息格式
   * @param messages - 聊天消息数组
   * @returns LangChain 消息数组
   */
  private convertToLangChainMessages(messages: ChatMessage[]): BaseMessage[] {
    return messages.map(message => {
      if (message.role === 'user') {
        return new HumanMessage(message.content)
      } else {
        return new AIMessage(message.content)
      }
    })
  }

  /**
   * 发送消息并获取 AI 回复
   * @param messages - 历史消息
   * @param userMessage - 用户消息
   * @param onChunk - 流式响应回调
   * @param onReasoning - 推理过程回调（DeepSeek R1 支持）
   * @returns Promise<string> - AI 回复
   */
  async sendMessage(
    messages: ChatMessage[],
    onChunk?: (chunk: string) => void,
    onReasoning?: (reasoning: string) => void,
  ): Promise<string> {
    try {
      // 验证配置
      if (!this.isConfigValid()) {
        throw new Error('DeepSeek 配置无效，请检查 API 密钥等设置')
      }

      // 构建消息历史
      // const allMessages = [...messages]
      // if (userMessage) {
      //   allMessages.push({
      //     id: Date.now().toString(),
      //     role: 'user' as const,
      //     content: userMessage,
      //     timestamp: Date.now()
      //   })
      // }

      const langChainMessages = this.convertToLangChainMessages(messages)
      console.log('转换后的 LangChain 消息:', langChainMessages)

      

      // 如果提供了流式回调，使用流式响应
      if (onChunk) {
        let fullResponse = ''

        const stream = await this.chatModel.stream(langChainMessages)

        for await (const chunk of stream) {
          const content = chunk.content as string
          // 思考
          const reasoning_content = chunk?.additional_kwargs.reasoning_content as string
          if (reasoning_content && onReasoning) {
            onReasoning(reasoning_content)
          }
          if (content) {
            // 检查是否包含推理内容（DeepSeek R1 特有）
            if (content.includes('<think>') || content.includes('</think>')) {
              // 移除推理标签，只保留实际回复
              const cleanContent = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
              if (cleanContent) {
                fullResponse += cleanContent
                onChunk(cleanContent)
              }
            } else {
              fullResponse += content
              onChunk(content)
            }
          }
        }

        return fullResponse
      } else {
        // 非流式响应
        const response = await this.chatModel.invoke(langChainMessages)
        let content = response.content as string
        const reasoning_content = response?.additional_kwargs.reasoning_content as string
        // 处理推理内容s
        if (reasoning_content && onReasoning) {
          onReasoning(reasoning_content)
        }
        content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim()

        return content
      }
    } catch (error) {
      console.error('DeepSeek 服务错误:', error)
      throw error
    }
  }

  /**
   * 更新配置
   * @param newConfig - 新的配置
   */
  updateConfig(newConfig: Partial<DeepSeekConfig>): void {
    this.config = { ...this.config, ...newConfig }

    // 重新初始化聊天模型
    this.chatModel = new ChatDeepSeek({
      apiKey: this.config.apiKey,
      model: this.config.model,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
      configuration: {
        baseURL: this.config.baseURL,
      },
    })

    console.log('DeepSeek 配置已更新:', this.config)
  }

  /**
   * 获取当前配置
   * @returns 当前配置
   */
  getConfig(): DeepSeekConfig {
    return { ...this.config }
  }

  /**
   * 验证配置是否有效
   * @returns 配置是否有效
   */
  isConfigValid(): boolean {
    return !!(this.config.apiKey && this.config.model)
  }
}

// 默认实例
export const deepSeekService = new DeepSeekService()

/**
 * 创建自定义 DeepSeek 服务实例
 * @param config - DeepSeek 配置
 * @returns DeepSeek 服务实例
 */
export const createDeepSeekService = (config: DeepSeekConfig) => {
  return new DeepSeekService(config)
}
