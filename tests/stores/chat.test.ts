import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useChatStore, type ChatMessage, type ChatSession } from '@/stores/chat'

/**
 * 聊天store单元测试
 */
describe('useChatStore', () => {
  beforeEach(() => {
    // 为每个测试创建新的pinia实例
    setActivePinia(createPinia())
    // Mock Date.now
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('应该正确初始化默认状态', () => {
    const chatStore = useChatStore()
    
    expect(chatStore.sessions).toHaveLength(1)
    expect(chatStore.sessions[0].title).toBe('欢迎使用AI聊天')
    expect(chatStore.currentSessionId).toBe(chatStore.sessions[0].id)
    expect(chatStore.isLoading).toBe(false)
    expect(chatStore.error).toBeNull()
    expect(chatStore.currentSession).toBeTruthy()
    expect(chatStore.currentMessages).toEqual([])
  })

  it('应该正确创建新会话', () => {
    const chatStore = useChatStore()
    const initialSessionsCount = chatStore.sessions.length
    
    const newSessionId = chatStore.createSession('新对话测试')
    
    expect(chatStore.sessions).toHaveLength(initialSessionsCount + 1)
    expect(chatStore.currentSessionId).toBe(newSessionId)
    expect(chatStore.currentSession?.title).toBe('新对话测试')
    expect(chatStore.currentSession?.messages).toEqual([])
    expect(newSessionId).toMatch(/^session_\d+_[a-z0-9]+$/)
  })

  it('应该正确切换会话', () => {
    const chatStore = useChatStore()
    const session1Id = chatStore.createSession('会话1')
    const session2Id = chatStore.createSession('会话2')
    
    // 当前应该是session2
    expect(chatStore.currentSessionId).toBe(session2Id)
    
    // 切换到session1
    chatStore.switchSession(session1Id)
    expect(chatStore.currentSessionId).toBe(session1Id)
    expect(chatStore.currentSession?.title).toBe('会话1')
  })

  it('切换到不存在的会话时应该保持当前会话', () => {
    const chatStore = useChatStore()
    const originalSessionId = chatStore.currentSessionId
    
    chatStore.switchSession('non-existent-session-id')
    
    expect(chatStore.currentSessionId).toBe(originalSessionId)
  })

  it('应该正确删除会话', () => {
    const chatStore = useChatStore()
    const session1Id = chatStore.createSession('会话1')
    const session2Id = chatStore.createSession('会话2')
    const initialCount = chatStore.sessions.length
    
    chatStore.deleteSession(session1Id)
    
    expect(chatStore.sessions).toHaveLength(initialCount - 1)
    expect(chatStore.sessions.find(s => s.id === session1Id)).toBeUndefined()
    // 当前会话应该仍然是session2
    expect(chatStore.currentSessionId).toBe(session2Id)
  })

  it('删除当前会话时应该切换到其他会话', () => {
    const chatStore = useChatStore()
    const session1Id = chatStore.createSession('会话1')
    const session2Id = chatStore.createSession('会话2')
    
    // 当前是session2，删除它
    chatStore.deleteSession(session2Id)
    
    // 应该切换到session1
    expect(chatStore.currentSessionId).toBe(session1Id)
  })

  it('删除所有会话时currentSessionId应该为null', () => {
    const chatStore = useChatStore()
    
    // 删除所有会话
    chatStore.sessions.forEach(session => {
      chatStore.deleteSession(session.id)
    })
    
    expect(chatStore.sessions).toHaveLength(0)
    expect(chatStore.currentSessionId).toBeNull()
    expect(chatStore.currentSession).toBeNull()
  })

  it('应该正确添加消息', () => {
    const chatStore = useChatStore()
    
    const messageId = chatStore.addMessage('你好', 'user')
    
    expect(chatStore.currentMessages).toHaveLength(1)
    expect(chatStore.currentMessages[0]).toEqual({
      id: messageId,
      content: '你好',
      role: 'user',
      timestamp: Date.now(),
      status: 'sending'
    })
    expect(messageId).toMatch(/^msg_\d+_[a-z0-9]+$/)
  })

  it('添加第一条用户消息时应该更新会话标题', () => {
    const chatStore = useChatStore()
    
    chatStore.addMessage('这是一条很长的消息内容，应该会被截断显示', 'user')
    
    expect(chatStore.currentSession?.title).toBe('这是一条很长的消息内容，应该会被截断显示')
  })

  it('添加超长消息时标题应该被截断', () => {
    const chatStore = useChatStore()
    const longMessage = '这是一条非常非常非常长的消息内容，超过了20个字符的限制'
    
    chatStore.addMessage(longMessage, 'user')
    
    expect(chatStore.currentSession?.title).toBe('这是一条非常非常非常长的消息内容，超过了...')
  })

  it('添加AI消息时状态应该是sent', () => {
    const chatStore = useChatStore()
    
    const messageId = chatStore.addMessage('我是AI回复', 'assistant')
    
    expect(chatStore.currentMessages[0].status).toBe('sent')
  })

  it('没有当前会话时添加消息应该创建新会话', () => {
    const chatStore = useChatStore()
    
    // 删除所有会话
    chatStore.sessions.forEach(session => {
      chatStore.deleteSession(session.id)
    })
    
    expect(chatStore.currentSession).toBeNull()
    
    // 添加消息
    chatStore.addMessage('测试消息', 'user')
    
    expect(chatStore.currentSession).toBeTruthy()
    expect(chatStore.currentMessages).toHaveLength(1)
  })

  it('应该正确更新消息状态', () => {
    const chatStore = useChatStore()
    
    const messageId = chatStore.addMessage('测试消息', 'user')
    
    chatStore.updateMessageStatus(messageId, 'sent')
    
    const message = chatStore.currentMessages.find(m => m.id === messageId)
    expect(message?.status).toBe('sent')
  })

  it('应该正确更新消息状态和错误信息', () => {
    const chatStore = useChatStore()
    
    const messageId = chatStore.addMessage('测试消息', 'user')
    
    chatStore.updateMessageStatus(messageId, 'error', '发送失败')
    
    const message = chatStore.currentMessages.find(m => m.id === messageId)
    expect(message?.status).toBe('error')
    expect(message?.error).toBe('发送失败')
  })

  it('更新不存在的消息状态时应该不报错', () => {
    const chatStore = useChatStore()
    
    expect(() => {
      chatStore.updateMessageStatus('non-existent-id', 'sent')
    }).not.toThrow()
  })

  it('应该正确清空当前会话消息', () => {
    const chatStore = useChatStore()
    
    // 添加一些消息
    chatStore.addMessage('消息1', 'user')
    chatStore.addMessage('消息2', 'assistant')
    
    expect(chatStore.currentMessages).toHaveLength(2)
    
    chatStore.clearCurrentSession()
    
    expect(chatStore.currentMessages).toHaveLength(0)
  })

  it('应该正确设置加载状态', () => {
    const chatStore = useChatStore()
    
    expect(chatStore.isLoading).toBe(false)
    
    chatStore.setLoading(true)
    expect(chatStore.isLoading).toBe(true)
    
    chatStore.setLoading(false)
    expect(chatStore.isLoading).toBe(false)
  })

  it('应该正确设置错误信息', () => {
    const chatStore = useChatStore()
    
    expect(chatStore.error).toBeNull()
    
    chatStore.setError('测试错误')
    expect(chatStore.error).toBe('测试错误')
    
    chatStore.setError(null)
    expect(chatStore.error).toBeNull()
  })

  it('会话的updatedAt应该在添加消息时更新', () => {
    const chatStore = useChatStore()
    const initialUpdatedAt = chatStore.currentSession?.updatedAt
    
    // 等待一毫秒确保时间戳不同
    vi.advanceTimersByTime(1)
    
    chatStore.addMessage('新消息', 'user')
    
    expect(chatStore.currentSession?.updatedAt).toBeGreaterThan(initialUpdatedAt!)
  })
})
