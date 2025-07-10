import { describe, it, expect } from 'vitest'

/**
 * 工具函数
 */

/**
 * 生成唯一ID
 */
export function generateId(prefix: string = 'id'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}_${random}`
}

/**
 * 格式化时间戳
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * 格式化消息内容（处理换行）
 */
export function formatMessageContent(content: string): string {
  return content.replace(/\n/g, '<br>')
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + '...'
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
  
  return obj
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

/**
 * 工具函数单元测试
 */
describe('工具函数测试', () => {
  describe('generateId', () => {
    it('应该生成带有默认前缀的唯一ID', () => {
      const id = generateId()
      expect(id).toMatch(/^id_\d+_[a-z0-9]{6}$/)
    })

    it('应该生成带有自定义前缀的唯一ID', () => {
      const id = generateId('test')
      expect(id).toMatch(/^test_\d+_[a-z0-9]{6}$/)
    })

    it('应该生成不同的ID', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('formatTimestamp', () => {
    it('应该正确格式化时间戳', () => {
      const timestamp = new Date('2024-01-01T09:05:00').getTime()
      const formatted = formatTimestamp(timestamp)
      expect(formatted).toBe('09:05')
    })

    it('应该正确处理下午时间', () => {
      const timestamp = new Date('2024-01-01T15:30:00').getTime()
      const formatted = formatTimestamp(timestamp)
      expect(formatted).toBe('15:30')
    })

    it('应该正确处理午夜时间', () => {
      const timestamp = new Date('2024-01-01T00:00:00').getTime()
      const formatted = formatTimestamp(timestamp)
      expect(formatted).toBe('00:00')
    })
  })

  describe('formatMessageContent', () => {
    it('应该将换行符转换为HTML换行标签', () => {
      const content = '第一行\n第二行\n第三行'
      const formatted = formatMessageContent(content)
      expect(formatted).toBe('第一行<br>第二行<br>第三行')
    })

    it('应该处理没有换行符的文本', () => {
      const content = '单行文本'
      const formatted = formatMessageContent(content)
      expect(formatted).toBe('单行文本')
    })

    it('应该处理空字符串', () => {
      const content = ''
      const formatted = formatMessageContent(content)
      expect(formatted).toBe('')
    })
  })

  describe('truncateText', () => {
    it('应该截断超长文本', () => {
      const text = '这是一段很长的文本内容' // 长度为11，超过10
      const truncated = truncateText(text, 10)
      expect(truncated).toBe('这是一段很长的文本内...')
    })

    it('应该保持短文本不变', () => {
      const text = '短文本'
      const truncated = truncateText(text, 10)
      expect(truncated).toBe('短文本')
    })

    it('应该正确处理边界情况', () => {
      const text = '正好十个字符的文本内容' // 这个字符串实际长度是11
      const truncated = truncateText(text, 10)
      expect(truncated).toBe('正好十个字符的文本内...')
    })

    it('应该处理空字符串', () => {
      const text = ''
      const truncated = truncateText(text, 10)
      expect(truncated).toBe('')
    })
  })

  describe('isValidEmail', () => {
    it('应该验证有效的邮箱地址', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.org')).toBe(true)
    })

    it('应该拒绝无效的邮箱地址', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test.example.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('deepClone', () => {
    it('应该深拷贝简单对象', () => {
      const obj = { a: 1, b: 'test' }
      const cloned = deepClone(obj)
      
      expect(cloned).toEqual(obj)
      expect(cloned).not.toBe(obj)
    })

    it('应该深拷贝嵌套对象', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3
          }
        }
      }
      const cloned = deepClone(obj)
      
      expect(cloned).toEqual(obj)
      expect(cloned.b).not.toBe(obj.b)
      expect(cloned.b.d).not.toBe(obj.b.d)
    })

    it('应该深拷贝数组', () => {
      const arr = [1, 2, { a: 3 }]
      const cloned = deepClone(arr)
      
      expect(cloned).toEqual(arr)
      expect(cloned).not.toBe(arr)
      expect(cloned[2]).not.toBe(arr[2])
    })

    it('应该深拷贝日期对象', () => {
      const date = new Date('2024-01-01')
      const cloned = deepClone(date)
      
      expect(cloned).toEqual(date)
      expect(cloned).not.toBe(date)
    })

    it('应该处理null和undefined', () => {
      expect(deepClone(null)).toBe(null)
      expect(deepClone(undefined)).toBe(undefined)
    })

    it('应该处理基本类型', () => {
      expect(deepClone(42)).toBe(42)
      expect(deepClone('string')).toBe('string')
      expect(deepClone(true)).toBe(true)
    })
  })

  describe('debounce', () => {
    it('应该延迟执行函数', (done) => {
      let callCount = 0
      const fn = () => callCount++
      const debouncedFn = debounce(fn, 100)
      
      debouncedFn()
      debouncedFn()
      debouncedFn()
      
      // 立即检查，函数不应该被调用
      expect(callCount).toBe(0)
      
      // 100ms后检查，函数应该被调用一次
      setTimeout(() => {
        expect(callCount).toBe(1)
        done()
      }, 150)
    })

    it('应该传递正确的参数', (done) => {
      let receivedArgs: any[] = []
      const fn = (...args: any[]) => {
        receivedArgs = args
      }
      const debouncedFn = debounce(fn, 50)
      
      debouncedFn('arg1', 'arg2', 'arg3')
      
      setTimeout(() => {
        expect(receivedArgs).toEqual(['arg1', 'arg2', 'arg3'])
        done()
      }, 100)
    })
  })

  describe('throttle', () => {
    it('应该限制函数调用频率', (done) => {
      let callCount = 0
      const fn = () => callCount++
      const throttledFn = throttle(fn, 100)
      
      throttledFn() // 应该立即执行
      throttledFn() // 应该被忽略
      throttledFn() // 应该被忽略
      
      expect(callCount).toBe(1)
      
      // 100ms后再次调用
      setTimeout(() => {
        throttledFn() // 应该执行
        expect(callCount).toBe(2)
        done()
      }, 150)
    })

    it('应该传递正确的参数', () => {
      let receivedArgs: any[] = []
      const fn = (...args: any[]) => {
        receivedArgs = args
      }
      const throttledFn = throttle(fn, 100)
      
      throttledFn('arg1', 'arg2')
      
      expect(receivedArgs).toEqual(['arg1', 'arg2'])
    })
  })
})