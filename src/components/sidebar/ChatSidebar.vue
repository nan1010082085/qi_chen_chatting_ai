<template>
  <div class="chat-sidebar">
    <!-- 侧边栏头部 -->
    <div class="sidebar-header">
      <h3 class="sidebar-title">聊天历史</h3>
      <t-button theme="primary" variant="outline" size="small" @click="createNewChat" :disabled="chatStore.isLoading">
        <template #icon><AddIcon /></template>
        新建对话
      </t-button>
    </div>

    <!-- 历史记录列表 -->
    <div class="sidebar-content">
      <div v-if="chatStore.sessions.length === 0" class="empty-state">
        <t-empty description="暂无聊天记录" />
      </div>

      <div v-else class="session-list">
        <div
          v-for="session in chatStore.sessions"
          :key="session.id"
          class="session-item"
          :class="{ active: session.id === chatStore.currentSessionId }"
          @click="switchToSession(session.id)"
        >
          <div class="session-content">
            <div class="session-title" :title="session.title">
              {{ session.title }}
            </div>
            <div class="session-meta">
              <span class="session-time">{{ formatTime(session.updatedAt) }}</span>
              <span class="session-count">{{ session.messages.length }}条消息</span>
            </div>
          </div>

          <div class="session-actions">
            <t-dropdown :options="getSessionActions(session.id)" @click="handleSessionAction" trigger="click">
              <t-button theme="default" variant="text" size="small" shape="square" @click.stop>
                <MoreIcon />
              </t-button>
            </t-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessagePlugin, DialogPlugin, Input } from 'tdesign-vue-next'
import { useChatStore } from '@/stores/chat'
import { DateTimeUtils } from '@/utils'
import { AddIcon, MoreIcon } from 'tdesign-icons-vue-next'
import { h, ref } from 'vue'

defineOptions({
  components: {
    AddIcon,
    MoreIcon,
  },
})

/**
 * 组件属性
 */
interface Props {
  // 可以添加一些配置属性
}

/**
 * 组件事件
 */
interface Emits {
  (e: 'session-changed', sessionId: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const chatStore = useChatStore()

/**
 * 格式化时间
 * @param timestamp - 时间戳
 * @returns 格式化后的时间字符串
 */
const formatTime = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp

  // 今天
  if (diff < 24 * 60 * 60 * 1000) {
    return DateTimeUtils.format(timestamp, 'HH:mm')
  }

  // 昨天
  if (diff < 48 * 60 * 60 * 1000) {
    return '昨天'
  }

  // 一周内
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days}天前`
  }

  // 超过一周
  return DateTimeUtils.format(timestamp, 'MM-DD')
}

/**
 * 创建新对话
 */
const createNewChat = () => {
  const sessionId = chatStore.createSession()
  emit('session-changed', sessionId)
  MessagePlugin.success('已创建新对话')
}

/**
 * 切换到指定会话
 * @param sessionId - 会话ID
 */
const switchToSession = (sessionId: string) => {
  if (sessionId === chatStore.currentSessionId) return

  chatStore.switchSession(sessionId)
  emit('session-changed', sessionId)
}

/**
 * 获取会话操作菜单
 * @param sessionId - 会话ID
 * @returns 操作菜单项
 */
const getSessionActions = (sessionId: string) => {
  const session = chatStore.sessions.find(s => s.id === sessionId)
  const hasMessages = session && session.messages.length > 0

  return [
    {
      content: '重命名',
      value: `rename_${sessionId}`,
    },
    {
      content: '删除消息',
      value: `delete_messages_${sessionId}`,
      disabled: !hasMessages,
    },
    {
      content: '删除对话',
      value: `delete_${sessionId}`,
      theme: 'error',
    },
  ]
}

/**
 * 处理会话操作
 * @param data - 操作数据
 */
const handleSessionAction = (data: { value: string }) => {
  const parts = data.value.split('_')
  const action = parts[0]
  console.log(action, parts)

  let id = parts.slice(1).join('_')
  if (action === 'rename') {
    const sessionId = id
    handleRenameSession(sessionId)
  } else if (action === 'delete') {
    if (parts[1] === 'messages') {
      const sessionId = parts.slice(2).join('_')
      handleDeleteMessages(sessionId)
    } else {
      const sessionId = id
      handleDeleteSession(sessionId)
    }
  }
}

/**
 * 重命名会话
 * @param sessionId - 会话ID
 */
const handleRenameSession = async (sessionId: string) => {
  const session = chatStore.sessions.find(s => s.id === sessionId)
  if (!session) return

  try {
    const inputValue = ref(session.title)

    /**
     * 处理确认操作
     */
    const handleConfirm = async () => {
      if (inputValue.value && inputValue.value.trim() && inputValue.value.trim() !== session.title) {
        const trimmedTitle = inputValue.value.trim()
        await chatStore.updateSessionTitle(sessionId, trimmedTitle)
        MessagePlugin.success('重命名成功')
        dialog.hide()
      } else {
        MessagePlugin.warning('请输入有效的对话标题')
      }
    }

    // 使用TDesign的DialogPlugin自定义内容块
    const dialog = DialogPlugin({
      header: '重命名对话',
      width: 480,
      confirmBtn: {
        content: '确定',
        theme: 'primary',
      },
      cancelBtn: {
        content: '取消',
        theme: 'default',
      },
      body: () => {
        return h('div', { style: 'padding: 16px 0;' }, [
          h(
            'div',
            {
              style: 'margin-bottom: 8px; color: var(--td-text-color-secondary); font-size: 14px;',
            },
            '请输入新的对话标题',
          ),
          h(Input, {
            modelValue: inputValue.value,
            'onUpdate:modelValue': (value: string) => {
              inputValue.value = value
            },
            placeholder: '请输入对话标题',
            maxlength: 50,
            showLimitNumber: true,
            clearable: true,
            autofocus: true,
            onEnter: () => {
              if (inputValue.value && inputValue.value.trim() && inputValue.value.trim() !== session.title) {
                handleConfirm()
              }
            },
          }),
        ])
      },
      onConfirm: () => {
        handleConfirm()
      },
      onCancel: () => {
        dialog.hide()
      },
    })
  } catch (error) {
    console.error('重命名失败:', error)
    MessagePlugin.error('重命名失败')
  }
}

/**
 * 删除会话中的所有消息
 * @param sessionId - 会话ID
 */
const handleDeleteMessages = (sessionId: string) => {
  const session = chatStore.sessions.find(s => s.id === sessionId)
  if (!session || session.messages.length === 0) return

  try {
    const dialog = DialogPlugin.confirm({
      header: '删除消息',
      theme: 'warning',
      width: 480,
      confirmBtn: {
        content: '删除',
        theme: 'warning',
      },
      cancelBtn: {
        content: '取消',
        theme: 'default',
      },
      body: () => {
        return h('div', { style: 'padding: 16px 0;' }, [
          h(
            'div',
            {
              style: 'display: flex; align-items: center; margin-bottom: 12px;',
            },
            [
              h('t-icon', {
                name: 'error-circle',
                size: '20px',
                style: 'color: var(--td-warning-color); margin-right: 8px;',
              }),
              h(
                'span',
                {
                  style: 'font-weight: 500; color: var(--td-text-color-primary);',
                },
                '确认删除消息',
              ),
            ],
          ),
          h(
            'div',
            {
              style: 'color: var(--td-text-color-secondary); line-height: 1.5;',
            },
            [
              `确定要删除对话 `,
              h('strong', {}, `"${session.title}"`),
              ` 中的所有消息吗？`,
              h('br'),
              h(
                'span',
                {
                  style: 'color: var(--td-warning-color);',
                },
                '此操作不可恢复。',
              ),
            ],
          ),
        ])
      },
      onConfirm: async () => {
        // 删除会话中的所有消息
        session.messages = []
        session.updatedAt = Date.now()
        await chatStore.saveSessionToDB(session)
        MessagePlugin.success('消息已删除')
        dialog.hide()
      },
      onCancel: () => {
        dialog.hide()
      },
    })
  } catch {
    // 用户取消操作
  }
}

/**
 * 删除会话
 * @param sessionId - 会话ID
 */
const handleDeleteSession = (sessionId: string) => {
  const session = chatStore.sessions.find(s => s.id === sessionId)

  if (!session) return

  try {
    const dialog = DialogPlugin.confirm({
      header: '删除对话',
      theme: 'warning',
      width: 480,
      confirmBtn: {
        content: '删除',
        theme: 'danger',
      },
      cancelBtn: {
        content: '取消',
        theme: 'default',
      },
      body: () => {
        const bodyElements = [
          h(
            'div',
            {
              style: 'display: flex; align-items: center; margin-bottom: 12px;',
            },
            [
              h('t-icon', {
                name: 'delete',
                size: '20px',
                style: 'color: var(--td-error-color); margin-right: 8px;',
              }),
              h(
                'span',
                {
                  style: 'font-weight: 500; color: var(--td-text-color-primary);',
                },
                '确认删除对话',
              ),
            ],
          ),
          h(
            'div',
            {
              style: 'color: var(--td-text-color-secondary); line-height: 1.5;',
            },
            [
              `确定要删除对话 `,
              h('strong', {}, `"${session.title}"`),
              ` 吗？`,
              h('br'),
              h(
                'span',
                {
                  style: 'color: var(--td-error-color);',
                },
                '此操作不可恢复，包括其中的所有消息记录。',
              ),
            ],
          ),
        ]

        // 如果有消息，显示消息数量提示
        if (session.messages.length > 0) {
          bodyElements.push(
            h(
              'div',
              {
                style:
                  'margin-top: 12px; padding: 8px 12px; background: var(--td-bg-color-container-select); border-radius: 4px; font-size: 12px; color: var(--td-text-color-placeholder);',
              },
              `该对话包含 ${session.messages.length} 条消息`,
            ),
          )
        }

        return h('div', { style: 'padding: 16px 0;' }, bodyElements)
      },
      onConfirm: () => {
        chatStore.deleteSession(sessionId)
        MessagePlugin.success('对话已删除')
        // 如果删除的是当前会话，切换到第一个会话
        if (sessionId === chatStore.currentSessionId && chatStore.sessions.length > 0) {
          emit('session-changed', chatStore.sessions[0].id)
        }
        dialog.hide()
      },
      onCancel: () => {
        dialog.hide()
      },
    })
  } catch {
    // 用户取消操作
  }
}
</script>

<style lang="less" scoped>
.chat-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--td-bg-color-container);
  border-right: 1px solid var(--td-border-level-1-color);
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid var(--td-border-level-1-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.sidebar-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  flex: 1;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.empty-state {
  padding: 40px 16px;
  text-align: center;
}

.session-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.session-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;

  &:hover {
    background: var(--td-bg-color-container-hover);
  }

  &.active {
    background: var(--td-bg-color-container-active);
    border-left-color: var(--td-brand-color);

    .session-title {
      color: var(--td-brand-color);
      font-weight: 500;
    }
  }
}

.session-content {
  flex: 1;
  min-width: 0;
  margin-right: 8px;
}

.session-title {
  font-size: 14px;
  font-weight: 400;
  color: var(--td-text-color-primary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.session-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--td-text-color-placeholder);
  gap: 8px;
}

.session-time {
  flex-shrink: 0;
}

.session-count {
  flex-shrink: 0;
}

.session-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.session-item:hover .session-actions {
  opacity: 1;
}

/* 滚动条样式 */
.sidebar-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: var(--td-scrollbar-color);
  border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: var(--td-scrollbar-hover-color);
}
</style>
