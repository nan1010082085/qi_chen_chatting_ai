/**
 * TDesign Chat 组件模拟
 */
import { ref, watch } from 'vue'

export const ChatContent = {
  name: 'ChatContent',
  props: ['content', 'role'],
  template: '<div class="mock-chat-content">{{ content }}</div>',
}

export const ChatReasoning = {
  name: 'ChatReasoning',
  props: ['expandIconPlacement', 'collapsePanelProps'],
  emits: ['expand-change'],
  template: '<div class="mock-chat-reasoning"><slot /></div>',
}

export const ChatLoading = {
  name: 'ChatLoading',
  props: ['animation', 'text'],
  template: '<div class="mock-chat-loading">{{ text }}</div>',
}

export const ChatSender = {
  name: 'ChatSender',
  props: ['modelValue', 'textareaProps', 'loading'],
  emits: ['update:modelValue', 'send'],
  template: `
    <div class="mock-chat-sender">
      <div class="mock-prefix"><slot name="prefix" /></div>
      <input v-model="inputValue" class="mock-input" />
      <div class="mock-suffix"><slot name="suffix" /></div>
    </div>
  `,
  setup(props: any, { emit }: any) {
    const inputValue = ref(props.modelValue || '')
    watch(inputValue, (val) => {
      emit('update:modelValue', val)
    })
    return { inputValue }
  },
}

// TDesign 基础组件模拟
export const TButton = {
  name: 'TButton',
  props: ['theme', 'variant', 'size', 'class'],
  template: '<button class="btn t-button"><slot /></button>',
}

export const TSelect = {
  name: 'TSelect',
  props: ['modelValue', 'options', 'valueType'],
  emits: ['update:modelValue', 'change', 'focus'],
  template: '<div class="t-select"><slot /></div>',
}

export const TTooltip = {
  name: 'TTooltip',
  props: ['visible', 'content', 'trigger'],
  emits: ['update:visible'],
  template: '<div class="t-tooltip"><slot /></div>',
}

export const TEmpty = {
  name: 'TEmpty',
  props: ['description'],
  template: '<div class="mock-empty">{{ description }}</div>',
}

export const TDropdown = {
  name: 'TDropdown',
  props: ['options', 'trigger'],
  emits: ['click'],
  template: '<div class="mock-dropdown" @click="$emit(\'click\', { value: \'test\' })"><slot /></div>',
}