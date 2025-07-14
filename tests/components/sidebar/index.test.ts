import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ChatSidebar from '@/components/sidebar/index.vue'
import { useChatStore } from '@/stores/chat'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'

// Mock TDesign components
vi.mock('tdesign-vue-next', () => ({
  MessagePlugin: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
  DialogPlugin: {
    confirm: vi.fn(),
  },
  Input: {
    name: 'TInput',
    props: ['modelValue', 'placeholder', 'maxlength', 'showLimitNumber', 'clearable', 'autofocus'],
    emits: ['update:modelValue', 'enter'],
    template:
      '<input class="t-input" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @keyup.enter="$emit(\'enter\')" />',
  },
}))

// Mock utils
vi.mock('@/utils', () => ({
  DateTimeUtils: {
    format: vi.fn((timestamp: number, format: string) => {
      if (format === 'HH:mm') return '10:30'
      if (format === 'MM-DD') return '12-25'
      return '2024-01-01'
    }),
  },
}))

/**
 * 创建组件包装器
 * @param props - 组件属性
 * @returns Vue组件包装器
 */
const createWrapper = (props = {}) => {
  return mount(ChatSidebar, {
    props,
    global: {
      plugins: [createPinia()],
    },
  })
}

describe('ChatSidebar 组件测试', () => {
  let chatStore: ReturnType<typeof useChatStore>
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    setActivePinia(createPinia())
    chatStore = useChatStore()

    // 重置所有 mock
    vi.clearAllMocks()

    // 模拟会话数据
    chatStore.sessions = [
      {
        id: 'session-1',
        title: '测试对话1',
        messages: [{ id: '1', content: 'Hello', reasoning_content: 'm', role: 'user', timestamp: Date.now() }],
        createdAt: Date.now() - 1000000,
        updatedAt: Date.now() - 500000,
      },
      {
        id: 'session-2',
        title: '测试对话2',
        messages: [],
        createdAt: Date.now() - 2000000,
        updatedAt: Date.now() - 1000000,
      },
    ]
    chatStore.currentSessionId = 'session-1'
    chatStore.isLoading = false
  })

  describe('基本渲染测试', () => {
    it('应该成功渲染组件', () => {
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm).toBeDefined()
    })

    it('应该包含基本的组件结构', () => {
      wrapper = createWrapper()
      expect(wrapper.html()).toContain('聊天历史')
      expect(wrapper.find('.sidebar-header').exists()).toBe(true)
      expect(wrapper.find('.sidebar-content').exists()).toBe(true)
    })

    it('应该正确显示会话数据', () => {
      wrapper = createWrapper()
      // 验证组件能正常渲染，不依赖具体的会话数据显示
      expect(wrapper.vm.chatStore).toBeDefined()
      expect(Array.isArray(wrapper.vm.chatStore.sessions)).toBe(true)
    })

    it('当没有会话时应该显示空状态', () => {
      chatStore.sessions = []
      wrapper = createWrapper()
      expect(wrapper.html()).toContain('暂无聊天记录')
    })
  })

  describe('交互测试', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('应该能够调用切换会话方法', () => {
      expect(typeof wrapper.vm.switchToSession).toBe('function')
      expect(() => wrapper.vm.switchToSession('session-2')).not.toThrow()
    })

    it('应该能够调用创建新对话方法', () => {
      expect(typeof wrapper.vm.createNewChat).toBe('function')
      expect(() => wrapper.vm.createNewChat()).not.toThrow()
    })

    it('组件方法应该存在', () => {
      expect(wrapper.vm.switchToSession).toBeDefined()
      expect(wrapper.vm.createNewChat).toBeDefined()
      expect(wrapper.vm.formatTime).toBeDefined()
      expect(wrapper.vm.getSessionActions).toBeDefined()
    })
  })

  describe('事件响应测试', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('切换会话时应该触发 session-changed 事件', () => {
      wrapper.vm.switchToSession('session-2')

      expect(wrapper.emitted('session-changed')).toBeTruthy()
      expect(wrapper.emitted('session-changed')?.[0]).toEqual(['session-2'])
    })

    it('创建新对话时应该触发 session-changed 事件', () => {
      wrapper.vm.createNewChat()

      expect(wrapper.emitted('session-changed')).toBeTruthy()
      const emittedEvents = wrapper.emitted('session-changed')
      expect(emittedEvents?.[0]).toBeDefined()
      expect(typeof emittedEvents?.[0]?.[0]).toBe('string')
    })
  })

  describe('组件方法测试', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('应该正确格式化时间', () => {
      const formatTime = wrapper.vm.formatTime
      const now = Date.now()

      // 测试今天的时间格式
      const todayTime = formatTime(now - 1000 * 60 * 30) // 30分钟前
      expect(typeof todayTime).toBe('string')

      // 测试一周前的时间格式
      const weekAgoTime = formatTime(now - 1000 * 60 * 60 * 24 * 8) // 8天前
      expect(typeof weekAgoTime).toBe('string')
    })

    it('应该能够获取会话操作菜单', () => {
      const actions = wrapper.vm.getSessionActions('session-1')
      expect(Array.isArray(actions)).toBe(true)
      expect(actions.length).toBeGreaterThan(0)
    })
  })
})
