<template>
  <div class="chat-view">
    <!-- 左侧历史记录侧边栏 -->
    <div class="chat-sidebar-container" :class="{ collapsed: sidebarCollapsed }">
      <ChatSidebar @session-changed="onSessionChanged" />
    </div>

    <!-- 侧边栏切换按钮 -->
    <div class="sidebar-toggle">
      <t-button theme="default" variant="outline" size="small" shape="square" @click="toggleSidebar">
        <template #icon>
          <ViewListIcon v-if="sidebarCollapsed" />
          <ChevronLeftIcon v-else />
        </template>
      </t-button>
    </div>

    <!-- 右侧聊天区域 -->
    <div class="chat-main">
      <!-- 聊天头部 -->
      <t-header class="chat-header">
        <div class="header-left">
          <div class="chat-title-container">
            <h1 v-if="!isEditingTitle" class="chat-title" @click="startEditTitle" :title="'点击编辑对话名称'">
              {{ currentSessionTitle }}
              <EditIcon class="edit-icon" />
            </h1>
            <div v-else class="title-edit-container">
              <t-input
                v-model="editingTitleValue"
                @blur="saveTitle"
                @keyup.enter="saveTitle"
                @keyup.esc="cancelEditTitle"
                class="title-input"
                placeholder="输入对话名称"
                autofocus
              />
              <div class="title-edit-actions">
                <t-button size="small" theme="primary" @click="saveTitle">
                  <CheckIcon />
                </t-button>
                <t-button size="small" theme="default" @click="cancelEditTitle">
                  <CloseIcon />
                </t-button>
              </div>
            </div>
          </div>
          <t-tag v-if="userStore.isLoggedIn" theme="success" size="small">
            <UserIcon />
            {{ userStore.userName }}
          </t-tag>
        </div>
        <div class="header-right">
          <t-button theme="danger" variant="outline" size="small" @click="clearChat" :disabled="chatStore.isLoading">
            <template #icon><DeleteIcon /></template>
            清空对话
          </t-button>
        </div>
      </t-header>

      <!-- 聊天消息区域 -->
      <div class="chat-content">
        <TChat ref="TChatRef" class="pl-5 pr-5" :reverse="false" :data="chatStore.currentMessages">
          <template #avatar>
            <t-avatar size="large" shape="circle" image="https://tdesign.gtimg.com/site/chat-avatar.png" />
          </template>
          <template #name="{ item }">
            {{ item.role === 'assistant' ? 'AI' : 'Me' }}
          </template>
          <template #content="{ item, index }">
            <LangContent :item="item" :index="index" @message-click="onMessageClick" />
          </template>
          <template #datetime="{ item }">
            {{ formatTime(item.timestamp) }}
          </template>
          <template #footer>
            <LangSender @select="onSenderSelect" @send="handleSender" />
          </template>
        </TChat>
      </div>

      <!-- 错误提示 -->
      <t-alert v-if="chatStore.error" theme="error" :message="chatStore.error" :close="false" class="error-alert" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch, computed } from 'vue'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import { useChatStore, type ChatMessage } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { deepSeekService } from '@/services/deepseek'
import { DateTimeUtils } from '@/utils'
import { LangSender, LangContent, ChatSidebar } from '@/components'
import { Chat as TChat } from '@tdesign-vue-next/chat'
import {
  ViewListIcon,
  ChevronLeftIcon,
  UserIcon,
  DeleteIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
} from 'tdesign-icons-vue-next'

defineOptions({
  components: {
    LangSender,
    LangContent,
    ChatSidebar,
    ViewListIcon,
    ChevronLeftIcon,
    UserIcon,
    DeleteIcon,
    EditIcon,
    CheckIcon,
    CloseIcon,
  },
})

const title = ref(import.meta.env.VITE_APP_TITLE)

const chatStore = useChatStore()
const userStore = useUserStore()

const inputMessage = ref('')
const TChatRef = ref()

// 选择模型
const selectModel = ref()

// 侧边栏状态
const sidebarCollapsed = ref(false)

// 标题编辑状态
const isEditingTitle = ref(false)
const editingTitleValue = ref('')

/**
 * 当前会话标题
 */
const currentSessionTitle = computed(() => {
  return chatStore.currentSession?.title || title.value
})

/**
 * 格式化时间
 * @param timestamp - 时间戳
 * @returns 格式化后的时间字符串
 */
const formatTime = (timestamp: number): string => {
  const d = DateTimeUtils.format
  return d(timestamp, 'YYYY-MM-DD HH:mm')
}

/**
 * 滚动到底部
 */
const scrollToBottom = () => {
  nextTick(() => {
    if (TChatRef.value) {
      TChatRef.value!.scrollToBottom({ behavior: 'smooth' })
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

  // 添加用户消息
  const userMessageId = chatStore.addMessage(message, 'user')
  scrollToBottom()
  chatStore.setLoading(true)
  try {
    chatStore.setLoading(true)
    chatStore.setError(null)

    // 更新用户消息状态为已发送（立即保存）
    chatStore.updateMessageStatus(userMessageId, 'sent', undefined, true)

    // 添加AI消息占位符（不立即保存到数据库）
    const aiMessageId = chatStore.addMessage('', 'assistant', false)
    scrollToBottom()

    // 获取消息历史（包括当前用户消息）
    const messages = chatStore.currentMessages

    // 调用 DeepSeek 服务，包含思考过程回调
    let aiResponse = ''
    let fullReasoningContent = ''

    const result = await deepSeekService.sendMessage(
      messages.slice(0, -1), // 排除AI占位符消息
      (chunk: string) => {
        // console.log('接收内容块:', chunk)
        // 流式更新AI回复
        aiResponse += chunk
        const aiMessage = chatStore.currentMessages.find(m => m.id === aiMessageId)
        if (aiMessage) {
          aiMessage.content = aiResponse
        }
        scrollToBottom()
      },
      (reasoning: string) => {
        // console.log('接收思考过程:', reasoning)
        // 累积思考过程内容
        fullReasoningContent += reasoning
        // 实时更新消息的思考内容
        chatStore.updateMessageReasoning(aiMessageId, fullReasoningContent)
        scrollToBottom()
      },
    )

    // 确保最终内容正确设置
    const aiMessage = chatStore.currentMessages.find(m => m.id === aiMessageId)
    if (aiMessage) {
      // 设置最终的回复内容
      aiMessage.content = result || aiResponse
      // 更新消息状态为已完成
      aiMessage.status = 'sent'

      // 设置最终的思考过程（如果有的话）
      if (fullReasoningContent) {
        // 使用流式累积的思考内容
        chatStore.updateMessageReasoning(aiMessageId, fullReasoningContent)
      }
    }

    // 流式输出完成后，统一保存到IndexedDB
    await chatStore.finishStreamAndSave()
    scrollToBottom()
  } catch (error) {
    console.error('Send message error:', error)
    const errorMessage = error instanceof Error ? error.message : '发送消息失败'
    chatStore.setError(errorMessage)
    MessagePlugin.error(errorMessage)

    // 更新用户消息状态为错误（立即保存）
    chatStore.updateMessageStatus(userMessageId, 'error', errorMessage, true)
  } finally {
    chatStore.setLoading(false)
  }
}

/**
 * 清空聊天记录
 */
const clearChat = () => {
  try {
    const dialog = DialogPlugin.confirm({
      header: '确认清空',
      body: '确定要清空当前对话吗？此操作不可恢复。',
      confirmBtn: '确定',
      cancelBtn: '取消',
      theme: 'warning',
      onConfirm() {
        chatStore.clearCurrentSession()
        chatStore.setError(null)
        MessagePlugin.success('对话已清空')
        dialog.hide()
      },
    })
  } catch {
    // 用户取消操作
  }
}

/**
 * 开始编辑标题
 */
const startEditTitle = () => {
  if (!chatStore.currentSession) return

  isEditingTitle.value = true
  editingTitleValue.value = chatStore.currentSession.title
}

/**
 * 保存标题
 */
const saveTitle = async () => {
  if (!chatStore.currentSession) return

  const newTitle = editingTitleValue.value.trim()
  if (!newTitle) {
    MessagePlugin.warning('对话名称不能为空')
    return
  }

  if (newTitle === chatStore.currentSession.title) {
    // 标题没有变化，直接取消编辑
    cancelEditTitle()
    return
  }

  try {
    // 更新会话标题
    await chatStore.updateSessionTitle(chatStore.currentSession.id, newTitle)
    isEditingTitle.value = false
    MessagePlugin.success('对话名称已更新')
  } catch (error) {
    console.error('更新标题失败:', error)
    MessagePlugin.error('更新对话名称失败')
  }
}

/**
 * 取消编辑标题
 */
const cancelEditTitle = () => {
  isEditingTitle.value = false
  editingTitleValue.value = ''
}

const onSenderSelect = (data: { label: string; value: string }) => {
  selectModel.value = data
}

const handleSender = (data: { content: string; isChecked: boolean; model: string }) => {
  inputMessage.value = data.content
  deepSeekService.updateConfig({
    model: data.model,
    enable_thinking: data.isChecked,
  })
  sendMessage()
}

// 监听消息变化，自动滚动到底部
watch(
  () => chatStore.currentMessages.length,
  () => {
    scrollToBottom()
  },
)

/**
 * 切换侧边栏显示状态
 */
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

/**
 * 处理会话切换
 * @param sessionId - 会话ID
 */
const onSessionChanged = () => {
  // 会话已在store中切换，这里可以做一些额外处理
  scrollToBottom()
}

/**
 * 处理消息点击事件
 * @param message - 被点击的消息
 * @param index - 消息索引
 */
const onMessageClick = (message: ChatMessage, index: number) => {
  console.log('消息被点击:', message, '索引:', index)

  // 可以在这里添加更多的消息点击处理逻辑
  // 比如：显示消息详情、编辑消息、回复消息等

  // 滚动到被点击的消息位置（可选）
  scrollToBottom()

  // 显示消息信息（可选）
  MessagePlugin.info(
    `点击了${message.role === 'user' ? '用户' : 'AI'}消息：${message.content.slice(0, 50)}${message.content.length > 50 ? '...' : ''}`,
  )
}

onMounted(() => {
  scrollToBottom()

  // 检查 DeepSeek 配置
  if (!deepSeekService.isConfigValid()) {
    chatStore.setError('请配置DeepSeek API Key')
    MessagePlugin.warning('请配置DeepSeek API Key')
  }
})
</script>

<style lang="less" scoped>
.chat-view {
  display: flex;
  height: 100%;
  background: var(--td-bg-color-page);
  position: relative;
}

.chat-sidebar-container {
  width: 280px;
  height: 100%;
  flex-shrink: 0;
  transition: all 0.3s ease;

  &.collapsed {
    width: 0;
    overflow: hidden;
  }
}

.sidebar-toggle {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  transition: all 0.3s ease;

  .chat-sidebar-container.collapsed + & {
    left: 16px;
  }

  .chat-sidebar-container:not(.collapsed) + & {
    left: 296px;
  }
}

.chat-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  height: 100%;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: var(--td-bg-color-container);
  border-bottom: 1px solid var(--td-border-level-1-color);
  box-shadow: var(--td-shadow-1);
  position: relative;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 48px; /* 为侧边栏切换按钮留出空间 */
}

.chat-title-container {
  display: flex;
  align-items: center;
  min-width: 0;
}

.chat-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--td-bg-color-container-hover);

    .edit-icon {
      opacity: 1;
    }
  }
}

.edit-icon {
  font-size: 16px;
  color: var(--td-text-color-placeholder);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.title-edit-container {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.title-input {
  max-width: 300px;
  min-width: 200px;
}

.title-edit-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.chat-content {
  padding: 10px 0 0;
  flex: 1;
  overflow: hidden;
}

.error-alert {
  margin: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-sidebar-container {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    height: 100%;
    box-shadow: var(--td-shadow-3);

    &.collapsed {
      transform: translateX(-100%);
      width: 280px;
    }
  }

  .sidebar-toggle {
    .chat-sidebar-container.collapsed + & {
      left: 16px;
    }

    .chat-sidebar-container:not(.collapsed) + & {
      left: 16px;
      z-index: 101;
    }
  }

  .header-left {
    margin-left: 48px;
  }

  .chat-title {
    max-width: 200px;
  }
}
</style>
