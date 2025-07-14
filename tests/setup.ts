import { config } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { vi } from 'vitest'

/**
 * 测试环境全局配置
 */
config.global.plugins = [createPinia()]

/**
 * 全局组件存根
 */
config.global.stubs = {
  TChatContent: {
    template: '<div class="mock-chat-content">{{ content }}</div>',
    props: ['content', 'role'],
  },
  TChatReasoning: {
    template: '<div class="mock-chat-reasoning"><slot /></div>',
    props: ['expandIconPlacement', 'collapsePanelProps'],
    emits: ['expand-change'],
  },
  ChatLoading: {
    template: '<div class="mock-chat-loading">{{ text }}</div>',
    props: ['animation', 'text'],
  },
  CheckCircleIcon: {
    template: '<div class="mock-check-icon"></div>',
  },
  ChatSender: true,
  TButton: true,
  TSelect: true,
  TTooltip: true,
  SystemSumIcon: true,
  TEmpty: true,
  TDropdown: true,
  AddIcon: true,
  MoreIcon: true,
}

/**
 * 全局模拟
 */
// 模拟 console 方法以避免测试输出污染
global.console = {
  ...console,
  // 保留 error 和 warn 用于调试
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
}

/**
 * 模拟 ResizeObserver
 */
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

/**
 * 模拟 IntersectionObserver
 */
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

/**
 * 模拟 matchMedia
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
