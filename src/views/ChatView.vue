<template>
  <div class="chat-view">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <div class="header-left">
        <h1 class="chat-title">AI 聊天助手</h1>
        <span class="user-info" v-if="userStore.isLoggedIn">
          欢迎，{{ userStore.userName }}
        </span>
      </div>
      <div class="header-right">
        <button 
          class="btn btn-secondary" 
          @click="clearChat"
          :disabled="chatStore.isLoading"
        >
          清空对话
        </button>
      </div>
    </div>

    <!-- 聊天消息区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="message in chatStore.currentMessages" 
        :key="message.id"
        class="message-wrapper"
        :class="`message-${message.role}`"
      >
        <div class="message-avatar">
          <div class="avatar" :class="message.role">
            {{ message.role === 'user' ? (userStore.userName.charAt(0) || 'U') : 'AI' }}
          </div>
        </div>
        <div class="message-content">
          <div class="message-text" v-html="formatMessage(message.content)"></div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          <div v-if="message.status === 'error'" class="message-error">
            发送失败: {{ message.error }}
          </div>
        </div>
      </div>
      
      <!-- 加载指示器 -->
      <div v-if="chatStore.isLoading" class="message-wrapper message-assistant">
        <div class="message-avatar">
          <div class="avatar assistant">
            AI
          </div>
        </div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input">
      <div class="input-wrapper">
        <textarea
          v-model="inputMessage"
          class="message-input"
          placeholder="输入您的问题..."
          rows="1"
          @keydown="handleKeyDown"
          @input="adjustTextareaHeight"
          ref="textareaRef"
          :disabled="chatStore.isLoading"
        ></textarea>
        <button 
          class="send-button"
          @click="sendMessage"
          :disabled="!inputMessage.trim() || chatStore.isLoading"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
      
      <!-- 错误提示 -->
      <div v-if="chatStore.error" class="error-message">
        {{ chatStore.error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, nextTick, onMounted, watch } from 'vue'
  import { useChatStore } from '@/stores/chat'
  import { useUserStore } from '@/stores/user'
  import { langChainService } from '@/services/langchain'

  const chatStore = useChatStore()
  const userStore = useUserStore()
  
  const inputMessage = ref('')
  const messagesContainer = ref<HTMLElement>()
  const textareaRef = ref<HTMLTextAreaElement>()

  /**
   * 格式化消息内容（支持简单的markdown）
   * @param content - 消息内容
   * @returns 格式化后的HTML
   */
  const formatMessage = (content: string): string => {
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
  }

  /**
   * 格式化时间
   * @param timestamp - 时间戳
   * @returns 格式化后的时间字符串
   */
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * 自动调整文本框高度
   */
  const adjustTextareaHeight = () => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 120) + 'px'
    }
  }

  /**
   * 处理键盘事件
   * @param event - 键盘事件
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  /**
   * 滚动到底部
   */
  const scrollToBottom = () => {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }

  /**
   * 发送消息
   */
  const sendMessage = async () => {
    const message = inputMessage.value.trim()
    if (!message || chatStore.isLoading) return

    // 清空输入框
    inputMessage.value = ''
    adjustTextareaHeight()

    // 添加用户消息
    const userMessageId = chatStore.addMessage(message, 'user')
    scrollToBottom()

    try {
      chatStore.setLoading(true)
      chatStore.setError(null)

      // 更新用户消息状态为已发送
      chatStore.updateMessageStatus(userMessageId, 'sent')

      // 添加AI消息占位符
      const aiMessageId = chatStore.addMessage('', 'assistant')
      scrollToBottom()

      // 获取消息历史（包括当前用户消息）
      const messages = chatStore.currentMessages

      // 调用LangChain服务
      let aiResponse = ''
      await langChainService.sendMessage(
        messages.slice(0, -1), // 排除AI占位符消息
        (chunk: string) => {
          // 流式更新AI回复
          aiResponse += chunk
          const aiMessage = chatStore.currentMessages.find(m => m.id === aiMessageId)
          if (aiMessage) {
            aiMessage.content = aiResponse
          }
          scrollToBottom()
        }
      )

      // 如果没有流式回复，设置完整回复
      if (!aiResponse) {
        aiResponse = await langChainService.sendMessage(messages.slice(0, -1))
        const aiMessage = chatStore.currentMessages.find(m => m.id === aiMessageId)
        if (aiMessage) {
          aiMessage.content = aiResponse
        }
      }

      scrollToBottom()
    } catch (error) {
      console.error('Send message error:', error)
      const errorMessage = error instanceof Error ? error.message : '发送消息失败'
      chatStore.setError(errorMessage)
      
      // 更新用户消息状态为错误
      chatStore.updateMessageStatus(userMessageId, 'error', errorMessage)
    } finally {
      chatStore.setLoading(false)
    }
  }

  /**
   * 清空聊天记录
   */
  const clearChat = () => {
    if (confirm('确定要清空当前对话吗？')) {
      chatStore.clearCurrentSession()
      chatStore.setError(null)
    }
  }

  // 监听消息变化，自动滚动到底部
  watch(
    () => chatStore.currentMessages.length,
    () => {
      scrollToBottom()
    }
  )

  onMounted(() => {
    scrollToBottom()
    
    // 检查LangChain配置
    if (!langChainService.isConfigValid()) {
      chatStore.setError('请配置OpenAI API Key')
    }
  })
</script>

<style scoped>
  .chat-view {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f5f5f5;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: white;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .chat-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
  }

  .user-info {
    color: #666;
    font-size: 0.875rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #5a6268;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .message-wrapper {
    display: flex;
    gap: 0.75rem;
    max-width: 80%;
  }

  .message-user {
    align-self: flex-end;
    flex-direction: row-reverse;
  }

  .message-assistant {
    align-self: flex-start;
  }

  .message-avatar {
    flex-shrink: 0;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    color: white;
  }

  .avatar.user {
    background: #007bff;
  }

  .avatar.assistant {
    background: #28a745;
  }

  .message-content {
    flex: 1;
    min-width: 0;
  }

  .message-text {
    background: white;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    line-height: 1.5;
    word-wrap: break-word;
  }

  .message-user .message-text {
    background: #007bff;
    color: white;
  }

  .message-time {
    font-size: 0.75rem;
    color: #666;
    margin-top: 0.25rem;
    padding: 0 0.5rem;
  }

  .message-error {
    font-size: 0.75rem;
    color: #dc3545;
    margin-top: 0.25rem;
    padding: 0 0.5rem;
  }

  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 1rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #666;
    animation: typing 1.4s infinite ease-in-out;
  }

  .typing-indicator span:nth-child(1) {
    animation-delay: -0.32s;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes typing {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .chat-input {
    padding: 1rem 1.5rem;
    background: white;
    border-top: 1px solid #e0e0e0;
  }

  .input-wrapper {
    display: flex;
    gap: 0.75rem;
    align-items: flex-end;
  }

  .message-input {
    flex: 1;
    min-height: 44px;
    max-height: 120px;
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 22px;
    resize: none;
    font-family: inherit;
    font-size: 0.875rem;
    line-height: 1.4;
    outline: none;
    transition: border-color 0.2s;
  }

  .message-input:focus {
    border-color: #007bff;
  }

  .message-input:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
  }

  .send-button {
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background: #007bff;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .send-button:hover:not(:disabled) {
    background: #0056b3;
    transform: scale(1.05);
  }

  .send-button:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  .error-message {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f8d7da;
    color: #721c24;
    border-radius: 6px;
    font-size: 0.875rem;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .chat-header {
      padding: 0.75rem 1rem;
    }
    
    .chat-title {
      font-size: 1.125rem;
    }
    
    .message-wrapper {
      max-width: 90%;
    }
    
    .chat-input {
      padding: 0.75rem 1rem;
    }
  }
</style>
