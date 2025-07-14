import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LangContent from '@/components/content/index.vue'
import type { ChatMessage } from '@/stores/chat'

/**
 * LangContent 组件简单测试
 * 专注于 props 和事件的基本功能测试
 */
describe('LangContent 组件测试', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  /**
   * 创建测试消息
   */
  const createTestMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
    id: '1',
    content: 'Test message',
    reasoning_content: 'Test reasoning message',
    role: 'user',
    timestamp: Date.now(),
    status: 'sent',
    ...overrides,
  })

  /**
   * 创建组件包装器
   */
  const createWrapper = (item: ChatMessage, index = 0) => {
    return mount(LangContent, {
      props: { item, index },
      global: {
        plugins: [createPinia()],
      },
    })
  }

  describe('Props 测试', () => {
    it('应该正确接收 item prop', () => {
      const message = createTestMessage({ content: 'Hello World' })
      const wrapper = createWrapper(message)

      const vm = wrapper.vm as any
      expect(vm.item.content).toBe('Hello World')
      expect(vm.item.role).toBe('user')
    })

    it('应该正确接收 index prop', () => {
      const message = createTestMessage()
      const wrapper = createWrapper(message, 5)

      const vm = wrapper.vm as any
      expect(vm.index).toBe(5)
    })

    it('应该响应 props 变化', async () => {
      const message1 = createTestMessage({ content: 'First message' })
      const wrapper = createWrapper(message1, 0)

      // 更新 props
      const message2 = createTestMessage({ content: 'Second message' })
      await wrapper.setProps({ item: message2, index: 1 })

      const vm = wrapper.vm as any
      expect(vm.item.content).toBe('Second message')
      expect(vm.index).toBe(1)
    })
  })

  describe('事件测试', () => {
    it('handleReasoningChange 应该正确处理展开变化事件', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const message = createTestMessage({ role: 'assistant' })
      const wrapper = createWrapper(message, 2)

      const vm = wrapper.vm as any
      vm.handleReasoningChange(true, { index: 2 })

      expect(consoleSpy).toHaveBeenCalledWith('handleChange', true, 2)
      consoleSpy.mockRestore()
    })
  })

  describe('基本渲染测试', () => {
    it('应该成功渲染组件', () => {
      const message = createTestMessage()
      const wrapper = createWrapper(message)

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.message-content-wrapper').exists()).toBe(true)
    })

    it('应该根据消息角色显示不同内容', () => {
      // 用户消息
      const userMessage = createTestMessage({ role: 'user' })
      const userWrapper = createWrapper(userMessage)
      expect(userWrapper.exists()).toBe(true)

      // 助手消息
      const assistantMessage = createTestMessage({ role: 'assistant' })
      const assistantWrapper = createWrapper(assistantMessage)
      expect(assistantWrapper.exists()).toBe(true)
    })

    it('应该处理错误状态', () => {
      const errorMessage = createTestMessage({
        status: 'error',
        error: 'Test error',
      })
      const wrapper = createWrapper(errorMessage)

      expect(wrapper.exists()).toBe(true)
      const vm = wrapper.vm as any
      expect(vm.item.status).toBe('error')
    })
  })
})
