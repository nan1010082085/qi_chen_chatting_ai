import { vi } from 'vitest'

/**
 * 测试环境设置文件
 * 在所有测试运行前执行
 */

// Mock window对象的micro-app相关属性
Object.defineProperty(window, '__MICRO_APP_ENVIRONMENT__', {
  writable: true,
  value: false
})

Object.defineProperty(window, '__MICRO_APP_NAME__', {
  writable: true,
  value: undefined
})

Object.defineProperty(window, '__MICRO_APP_BASE_ROUTE__', {
  writable: true,
  value: undefined
})

Object.defineProperty(window, 'microApp', {
  writable: true,
  value: undefined
})

// Mock console方法（可选，用于减少测试输出噪音）
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    // 保留error和warn，但可以mock掉log
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn()
  }
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock fetch（如果需要）
global.fetch = vi.fn()

// 设置测试环境变量
process.env.NODE_ENV = 'test'