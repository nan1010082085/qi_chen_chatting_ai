import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 消息类型
 */
export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: number
  status?: 'sending' | 'sent' | 'error'
  error?: string
}

/**
 * 聊天会话接口
 */
export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

/**
 * 聊天状态管理
 */
export const useChatStore = defineStore('chat', () => {
  // 状态
  const sessions = ref<ChatSession[]>([])
  const currentSessionId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const currentSession = computed(() => {
    return sessions.value.find(session => session.id === currentSessionId.value) || null
  })

  const currentMessages = computed(() => {
    return currentSession.value?.messages || []
  })

  /**
   * 创建新的聊天会话
   * @param title - 会话标题
   * @returns 会话ID
   */
  const createSession = (title: string = '新对话'): string => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newSession: ChatSession = {
      id: sessionId,
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    sessions.value.unshift(newSession)
    currentSessionId.value = sessionId
    return sessionId
  }

  /**
   * 切换到指定会话
   * @param sessionId - 会话ID
   */
  const switchSession = (sessionId: string) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      currentSessionId.value = sessionId
    }
  }

  /**
   * 删除会话
   * @param sessionId - 会话ID
   */
  const deleteSession = (sessionId: string) => {
    const index = sessions.value.findIndex(s => s.id === sessionId)
    if (index > -1) {
      sessions.value.splice(index, 1)
      if (currentSessionId.value === sessionId) {
        currentSessionId.value = sessions.value.length > 0 ? sessions.value[0].id : null
      }
    }
  }

  /**
   * 添加消息到当前会话
   * @param message - 消息内容
   * @param role - 消息角色
   * @returns 消息ID
   */
  const addMessage = (content: string, role: 'user' | 'assistant' | 'system'): string => {
    if (!currentSession.value) {
      createSession()
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newMessage: ChatMessage = {
      id: messageId,
      content,
      role,
      timestamp: Date.now(),
      status: role === 'user' ? 'sending' : 'sent'
    }

    currentSession.value!.messages.push(newMessage)
    currentSession.value!.updatedAt = Date.now()
    
    // 如果是第一条用户消息，更新会话标题
    if (role === 'user' && currentSession.value!.messages.length === 1) {
      currentSession.value!.title = content.slice(0, 20) + (content.length > 20 ? '...' : '')
    }

    return messageId
  }

  /**
   * 更新消息状态
   * @param messageId - 消息ID
   * @param status - 新状态
   * @param error - 错误信息
   */
  const updateMessageStatus = (messageId: string, status: ChatMessage['status'], error?: string) => {
    if (!currentSession.value) return
    
    const message = currentSession.value.messages.find(m => m.id === messageId)
    if (message) {
      message.status = status
      if (error) {
        message.error = error
      }
    }
  }

  /**
   * 清空当前会话消息
   */
  const clearCurrentSession = () => {
    if (currentSession.value) {
      currentSession.value.messages = []
      currentSession.value.updatedAt = Date.now()
    }
  }

  /**
   * 设置加载状态
   * @param loading - 是否加载中
   */
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  /**
   * 设置错误信息
   * @param errorMessage - 错误信息
   */
  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  // 初始化默认会话
  if (sessions.value.length === 0) {
    createSession('欢迎使用AI聊天')
  }

  return {
    // 状态
    sessions,
    currentSessionId,
    isLoading,
    error,
    // 计算属性
    currentSession,
    currentMessages,
    // 方法
    createSession,
    switchSession,
    deleteSession,
    addMessage,
    updateMessageStatus,
    clearCurrentSession,
    setLoading,
    setError
  }
})