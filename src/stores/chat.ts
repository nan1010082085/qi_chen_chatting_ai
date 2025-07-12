import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { indexedDBService } from '@/services/indexedDB'

/**
 * 消息类型
 */
export interface ChatMessage {
  id: string
  content: string;
  reasoning_content: string;
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
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const newSession: ChatSession = {
      id: sessionId,
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    sessions.value.unshift(newSession)
    currentSessionId.value = sessionId
    
    // 保存到IndexedDB
    saveSessionToDB(newSession)
    
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
      
      // 从IndexedDB删除
      deleteSessionFromDB(sessionId)
    }
  }

  /**
   * 更新会话标题
   * @param sessionId - 会话ID
   * @param newTitle - 新标题
   */
  const updateSessionTitle = async (sessionId: string, newTitle: string) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      session.title = newTitle
      session.updatedAt = Date.now()
      
      // 保存到IndexedDB
      await saveSessionToDB(session)
    }
  }

  /**
   * 添加消息到当前会话
   * @param content - 消息内容
   * @param role - 消息角色
   * @param saveToDb - 是否立即保存到数据库，默认true（用户消息立即保存）
   * @returns 消息ID
   */
  const addMessage = (content: string, role: 'user' | 'assistant' | 'system', saveToDb: boolean = true): string => {
    if (!currentSession.value) {
      createSession()
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const newMessage: ChatMessage = {
      id: messageId,
      content,
      reasoning_content: '',
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

    // 用户消息立即保存，AI消息等流式输出完成后再保存
    if (saveToDb) {
      saveSessionToDB(currentSession.value!)
    }

    return messageId
  }

  /**
   * 更新消息状态
   * @param messageId - 消息ID
   * @param status - 新状态
   * @param error - 错误信息
   * @param saveToDb - 是否立即保存到数据库，默认false
   */
  const updateMessageStatus = (messageId: string, status: ChatMessage['status'], error?: string, saveToDb: boolean = false) => {
    if (!currentSession.value) return
    
    const message = currentSession.value.messages.find(m => m.id === messageId)
    if (message) {
      message.status = status
      if (error) {
        message.error = error
      }
      currentSession.value.updatedAt = Date.now()
      
      // 只有在明确指定时才立即保存到IndexedDB
      if (saveToDb) {
        saveSessionToDB(currentSession.value)
      }
    }
  }

  /**
   * 删除指定消息
   * @param messageId - 消息ID
   */
  const deleteMessage = (messageId: string) => {
    if (!currentSession.value) return
    
    const messageIndex = currentSession.value.messages.findIndex(m => m.id === messageId)
    if (messageIndex > -1) {
      currentSession.value.messages.splice(messageIndex, 1)
      currentSession.value.updatedAt = Date.now()
      
      // 保存到IndexedDB
      saveSessionToDB(currentSession.value)
    }
  }

  /**
   * 清空当前会话消息
   */
  const clearCurrentSession = () => {
    if (currentSession.value) {
      currentSession.value.messages = []
      currentSession.value.updatedAt = Date.now()
      
      // 保存到IndexedDB
      saveSessionToDB(currentSession.value)
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

  /**
   * 更新消息的思考内容
   * @param messageId - 消息ID
   * @param reasoningContent - 思考内容
   * @param saveToDb - 是否立即保存到数据库，默认false
   */
  const updateMessageReasoning = (messageId: string, reasoningContent: string, saveToDb: boolean = false) => {
    if (!currentSession.value) return
    
    const message = currentSession.value.messages.find(m => m.id === messageId)
    if (message) {
      message.reasoning_content = reasoningContent
      currentSession.value.updatedAt = Date.now()
      
      // 只有在明确指定时才立即保存到IndexedDB
      if (saveToDb) {
        saveSessionToDB(currentSession.value)
      }
    }
  }

  /**
   * 从IndexedDB加载历史会话
   */
  const loadSessionsFromDB = async () => {
    try {
      const savedSessions = await indexedDBService.getAllSessions()
      if (savedSessions.length > 0) {
        sessions.value = savedSessions
        // 设置最新的会话为当前会话
        currentSessionId.value = savedSessions[0].id
      } else {
        // 如果没有历史会话，创建默认会话
        createSession('欢迎使用AI聊天')
      }
    } catch (error) {
      console.error('Failed to load sessions from IndexedDB:', error)
      // 如果加载失败，创建默认会话
      createSession('欢迎使用AI聊天')
    }
  }

  /**
   * 保存会话到IndexedDB
   * @param session - 要保存的会话
   */
  const saveSessionToDB = async (session: ChatSession) => {
    console.log(session);
    
    try {
      await indexedDBService.saveSession(session)
    } catch (error) {
      console.error('Failed to save session to IndexedDB:', error)
    }
  }

  /**
   * 从IndexedDB删除会话
   * @param sessionId - 会话ID
   */
  const deleteSessionFromDB = async (sessionId: string) => {
    try {
      await indexedDBService.deleteSession(sessionId)
    } catch (error) {
      console.error('Failed to delete session from IndexedDB:', error)
    }
  }

  /**
   * 完成流式输出后保存会话
   * 用于在AI消息流式输出完成后统一保存到IndexedDB
   */
  const finishStreamAndSave = async () => {
    if (currentSession.value) {
      try {
        await saveSessionToDB(currentSession.value)
      } catch (error) {
        console.error('Failed to save session after stream completion:', error)
      }
    }
  }

  // 初始化时加载历史会话
  loadSessionsFromDB()

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
    updateSessionTitle,
    addMessage,
    deleteMessage,
    updateMessageStatus,
    updateMessageReasoning,
    clearCurrentSession,
    setLoading,
    setError,
    loadSessionsFromDB,
    saveSessionToDB,
    deleteSessionFromDB,
    finishStreamAndSave
  }
})
