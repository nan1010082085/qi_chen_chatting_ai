import { describe, it, expect, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent } from 'vue'
import type { ChatMessage } from '@/stores/chat'

/**
 * 消息项组件
 */
const MessageItem = defineComponent({
  name: 'MessageItem',
  props: {
    message: {
      type: Object as () => ChatMessage,
      required: true
    },
    showAvatar: {
      type: Boolean,
      default: true
    },
    userAvatar: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const formatTime = (timestamp: number) => {
      const date = new Date(timestamp)
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }

    const formatMessage = (content: string) => {
      return content.replace(/\n/g, '<br>')
    }

    return {
      formatTime,
      formatMessage
    }
  },
  template: `
    <div class="message" :class="message.role">
      <div v-if="showAvatar" class="message-avatar">
        <img 
          v-if="message.role === 'user' && userAvatar" 
          :src="userAvatar" 
          :alt="'用户头像'"
          class="avatar-img"
        />
        <div v-else-if="message.role === 'user'" class="avatar-placeholder user">
          用户
        </div>
        <div v-else class="avatar-placeholder ai">
          AI
        </div>
      </div>
      
      <div class="message-content-wrapper">
        <div class="message-content" v-html="formatMessage(message.content)"></div>
        <div class="message-meta">
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>
          <span v-if="message.status === 'sending'" class="message-status sending">
            发送中...
          </span>
          <span v-else-if="message.status === 'error'" class="message-status error">
            发送失败
            <span v-if="message.error" class="error-detail">: {{ message.error }}</span>
          </span>
        </div>
      </div>
    </div>
  `
})

/**
 * MessageItem组件单元测试
 */
describe('MessageItem', () => {
  let wrapper: VueWrapper<any>

  const createMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
    id: 'test-message-1',
    content: '测试消息内容',
    role: 'user',
    timestamp: new Date('2024-01-01T12:30:00').getTime(),
    status: 'sent',
    ...overrides
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('基本渲染', () => {
    it('应该正确渲染用户消息', () => {
      const message = createMessage()
      wrapper = mount(MessageItem, {
        props: { message }
      })

      expect(wrapper.find('.message').exists()).toBe(true)
      expect(wrapper.find('.message').classes()).toContain('user')
      expect(wrapper.find('.message-content').text()).toBe('测试消息内容')
      expect(wrapper.find('.message-time').text()).toBe('12:30')
    })

    it('应该正确渲染AI消息', () => {
      const message = createMessage({ role: 'assistant' })
      wrapper = mount(MessageItem, {
        props: { message }
      })

      expect(wrapper.find('.message').classes()).toContain('assistant')
      expect(wrapper.find('.avatar-placeholder.ai').exists()).toBe(true)
      expect(wrapper.find('.avatar-placeholder.ai').text()).toBe('AI')
    })

    it('应该正确显示用户头像', () => {
      const message = createMessage()
      wrapper = mount(MessageItem, {
        props: {
          message,
          userAvatar: 'https://example.com/avatar.jpg'
        }
      })

      const avatarImg = wrapper.find('.avatar-img')
      expect(avatarImg.exists()).toBe(true)
      expect(avatarImg.attributes('src')).toBe('https://example.com/avatar.jpg')
      expect(avatarImg.attributes('alt')).toBe('用户头像')
    })

    it('应该在没有头像时显示占位符', () => {
      const message = createMessage()
      wrapper = mount(MessageItem, {
        props: { message }
      })

      expect(wrapper.find('.avatar-placeholder.user').exists()).toBe(true)
      expect(wrapper.find('.avatar-placeholder.user').text()).toBe('用户')
    })

    it('应该能够隐藏头像', () => {
      const message = createMessage()
      wrapper = mount(MessageItem, {
        props: {
          message,
          showAvatar: false
        }
      })

      expect(wrapper.find('.message-avatar').exists()).toBe(false)
    })
  })

  describe('消息状态', () => {
    it('应该显示发送中状态', () => {
      const message = createMessage({ status: 'sending' })
      wrapper = mount(MessageItem, {
        props: { message }
      })

      const statusElement = wrapper.find('.message-status.sending')
      expect(statusElement.exists()).toBe(true)
      expect(statusElement.text()).toBe('发送中...')
    })

    it('应该显示错误状态', () => {
      const message = createMessage({ 
        status: 'error',
        error: '网络连接失败'
      })
      wrapper = mount(MessageItem, {
        props: { message }
      })

      const statusElement = wrapper.find('.message-status.error')
      expect(statusElement.exists()).toBe(true)
      expect(statusElement.text()).toContain('发送失败')
      expect(statusElement.text()).toContain('网络连接失败')
    })

    it('应该显示错误状态但不显示错误详情', () => {
      const message = createMessage({ status: 'error' })
      wrapper = mount(MessageItem, {
        props: { message }
      })

      const statusElement = wrapper.find('.message-status.error')
      expect(statusElement.exists()).toBe(true)
      expect(statusElement.text()).toBe('发送失败')
      expect(wrapper.find('.error-detail').exists()).toBe(false)
    })

    it('已发送状态不应该显示状态文本', () => {
      const message = createMessage({ status: 'sent' })
      wrapper = mount(MessageItem, {
        props: { message }
      })

      expect(wrapper.find('.message-status').exists()).toBe(false)
    })
  })

  describe('内容格式化', () => {
    it('应该正确处理换行符', () => {
      const message = createMessage({
        content: '第一行\n第二行\n第三行'
      })
      wrapper = mount(MessageItem, {
        props: { message }
      })

      const content = wrapper.find('.message-content')
      expect(content.html()).toContain('第一行<br>第二行<br>第三行')
    })

    it('应该正确处理单行文本', () => {
      const message = createMessage({
        content: '单行文本内容'
      })
      wrapper = mount(MessageItem, {
        props: { message }
      })

      const content = wrapper.find('.message-content')
      expect(content.text()).toBe('单行文本内容')
    })

    it('应该正确处理空内容', () => {
      const message = createMessage({ content: '' })
      wrapper = mount(MessageItem, {
        props: { message }
      })

      const content = wrapper.find('.message-content')
      expect(content.text()).toBe('')
    })
  })

  describe('时间格式化', () => {
    it('应该正确格式化上午时间', () => {
      const message = createMessage({
        timestamp: new Date('2024-01-01T09:05:00').getTime()
      })
      wrapper = mount(MessageItem, {
        props: { message }
      })

      expect(wrapper.find('.message-time').text()).toBe('09:05')
    })

    it('应该正确格式化下午时间', () => {
      const message = createMessage({
        timestamp: new Date('2024-01-01T15:30:00').getTime()
      })
      wrapper = mount(MessageItem, {
        props: { message }
      })

      expect(wrapper.find('.message-time').text()).toBe('15:30')
    })

    it('应该正确格式化午夜时间', () => {
      const message = createMessage({
        timestamp: new Date('2024-01-01T00:00:00').getTime()
      })
      wrapper = mount(MessageItem, {
        props: { message }
      })

      expect(wrapper.find('.message-time').text()).toBe('00:00')
    })
  })

  describe('边界情况', () => {
    it('应该处理非常长的消息内容', () => {
      const longContent = 'A'.repeat(1000)
      const message = createMessage({ content: longContent })
      wrapper = mount(MessageItem, {
        props: { message }
      })

      expect(wrapper.find('.message-content').text()).toBe(longContent)
    })

    it('应该处理特殊字符', () => {
      const message = createMessage({
        content: '特殊字符: <>&"\'\'\n\t'
      })
      wrapper = mount(MessageItem, {
        props: { message }
      })

      const content = wrapper.find('.message-content')
      expect(content.exists()).toBe(true)
    })

    it('应该处理无效的时间戳', () => {
      const message = createMessage({ timestamp: NaN })
      wrapper = mount(MessageItem, {
        props: { message }
      })

      // 应该不会抛出错误
      expect(wrapper.find('.message-time').exists()).toBe(true)
    })
  })
})
