/**
 * LangSender 组件测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import LangSender from '@/components/sender/index.vue'

/**
 * 模拟选项类型
 */
interface SelectOption {
  label: string
  value: string
}

/**
 * 发送事件数据类型
 */
interface SendEventData {
  content: string
  isChecked: boolean
  model: string
}

describe('LangSender 组件测试', () => {
  /**
   * 创建组件包装器
   */
  const createWrapper = () => {
    return mount(LangSender, {
      global: {
        plugins: [createPinia()],
      },
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本渲染测试', () => {
    it('应该成功渲染组件', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm).toBeDefined()
    })

    it('应该正确初始化组件实例', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.loading).toBeDefined()
      expect(wrapper.vm.inputValue).toBeDefined()
      expect(wrapper.vm.selectValue).toBeDefined()
      expect(wrapper.vm.isChecked).toBeDefined()
    })
  })

  describe('事件测试', () => {
    it('应该触发 select 事件当模型改变时', async () => {
      const wrapper = createWrapper()
      const selectOption: SelectOption = {
        label: '智谱Ai',
        value: 'THUDM/GLM-4.1V-9B-Thinking',
      }

      // 模拟选择器变化事件
      await wrapper.vm.onSelectChange(selectOption)
      
      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')?.[0]).toEqual([selectOption])
    })

    it('应该触发 send 事件当发送消息时', async () => {
      const wrapper = createWrapper()
      
      // 设置输入值
      wrapper.vm.inputValue = '测试消息'
      wrapper.vm.isChecked = true
      
      // 触发发送事件
      await wrapper.vm.inputEnter()
      
      expect(wrapper.emitted('send')).toBeTruthy()
      const sendData = wrapper.emitted('send')?.[0]?.[0] as SendEventData
      expect(sendData.content).toBe('测试消息')
      expect(sendData.isChecked).toBe(true)
      expect(sendData.model).toBe('deepseek-ai/DeepSeek-R1-0528-Qwen3-8B')
    })

    it('应该切换深度思考状态', async () => {
      const wrapper = createWrapper()
      const initialChecked = wrapper.vm.isChecked
      
      // 点击深度思考按钮
      await wrapper.vm.checkClick()
      
      expect(wrapper.vm.isChecked).toBe(!initialChecked)
    })

    it('不应该发送空消息', async () => {
      const wrapper = createWrapper()
      
      // 设置空输入值
      wrapper.vm.inputValue = ''
      
      // 尝试发送
      await wrapper.vm.inputEnter()
      
      expect(wrapper.emitted('send')).toBeFalsy()
    })

    it('加载状态时不应该发送消息', async () => {
      const wrapper = createWrapper()
      
      // 设置加载状态和输入值
      wrapper.vm.loading = true
      wrapper.vm.inputValue = '测试消息'
      
      // 尝试发送
      await wrapper.vm.inputEnter()
      
      expect(wrapper.emitted('send')).toBeFalsy()
    })
  })

  describe('状态管理测试', () => {
    it('应该正确初始化默认状态', () => {
      const wrapper = createWrapper()
      
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.allowToolTip).toBe(false)
      expect(wrapper.vm.inputValue).toBe('')
      expect(wrapper.vm.isChecked).toBe(true)
      expect(wrapper.vm.selectValue.label).toBe('Deepseek-R1')
    })

    it('发送消息后应该清空输入框', async () => {
      const wrapper = createWrapper()
      
      // 设置输入值
      wrapper.vm.inputValue = '测试消息'
      
      // 发送消息
      await wrapper.vm.inputEnter()
      
      // 验证输入框被清空
      expect(wrapper.vm.inputValue).toBe('')
    })
  })
})