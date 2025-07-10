/**
 * Lodash-ES 使用示例
 * 展示如何在项目中直接使用 lodash-es 库
 */

// 直接从 lodash-es 导入需要的函数
import {
  // 数组操作
  chunk,
  uniq,
  flatten,
  difference,
  intersection,
  
  // 对象操作
  get,
  set,
  omit,
  pick,
  merge,
  cloneDeep,
  
  // 函数操作
  debounce,
  throttle,
  memoize,
  
  // 类型检查
  isArray,
  isObject,
  isEmpty,
  isNil,
  
  // 字符串操作
  camelCase,
  kebabCase,
  capitalize,
  truncate
} from 'lodash-es'

/**
 * 数组操作示例
 */
export class ArrayExamples {
  /**
   * 数组分块示例
   */
  static chunkExample(): void {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8]
    const chunked = chunk(numbers, 3)
    console.log('分块结果:', chunked) // [[1, 2, 3], [4, 5, 6], [7, 8]]
  }

  /**
   * 数组去重示例
   */
  static uniqueExample(): void {
    const duplicates = [1, 2, 2, 3, 3, 4, 5, 5]
    const unique = uniq(duplicates)
    console.log('去重结果:', unique) // [1, 2, 3, 4, 5]
  }

  /**
   * 数组扁平化示例
   */
  static flattenExample(): void {
    const nested = [[1, 2], [3, 4], [5, 6]]
    const flattened = flatten(nested)
    console.log('扁平化结果:', flattened) // [1, 2, 3, 4, 5, 6]
  }

  /**
   * 数组差集示例
   */
  static differenceExample(): void {
    const array1 = [1, 2, 3, 4, 5]
    const array2 = [3, 4, 5, 6, 7]
    const diff = difference(array1, array2)
    console.log('差集结果:', diff) // [1, 2]
  }

  /**
   * 数组交集示例
   */
  static intersectionExample(): void {
    const array1 = [1, 2, 3, 4, 5]
    const array2 = [3, 4, 5, 6, 7]
    const inter = intersection(array1, array2)
    console.log('交集结果:', inter) // [3, 4, 5]
  }
}

/**
 * 对象操作示例
 */
export class ObjectExamples {
  /**
   * 深度获取对象属性示例
   */
  static getExample(): void {
    const obj = {
      user: {
        profile: {
          name: 'John',
          age: 30
        }
      }
    }
    
    const name = get(obj, 'user.profile.name')
    const age = get(obj, 'user.profile.age', 0) // 默认值
    const email = get(obj, 'user.profile.email', 'N/A') // 不存在的属性
    
    console.log('姓名:', name) // John
    console.log('年龄:', age) // 30
    console.log('邮箱:', email) // N/A
  }

  /**
   * 深度设置对象属性示例
   */
  static setExample(): void {
    const obj = {}
    set(obj, 'user.profile.name', 'Jane')
    set(obj, 'user.profile.age', 25)
    
    console.log('设置后的对象:', obj)
    // { user: { profile: { name: 'Jane', age: 25 } } }
  }

  /**
   * 对象属性选择和排除示例
   */
  static pickOmitExample(): void {
    const user = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      password: 'secret',
      role: 'admin'
    }
    
    // 选择特定属性
    const publicInfo = pick(user, ['id', 'name', 'email'])
    console.log('公开信息:', publicInfo)
    
    // 排除敏感属性
    const safeInfo = omit(user, ['password'])
    console.log('安全信息:', safeInfo)
  }

  /**
   * 对象合并示例
   */
  static mergeExample(): void {
    const defaults = {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: false
      }
    }
    
    const userSettings = {
      theme: 'dark',
      notifications: {
        push: true
      }
    }
    
    const finalSettings = merge({}, defaults, userSettings)
    console.log('合并后的设置:', finalSettings)
  }

  /**
   * 深拷贝示例
   */
  static cloneDeepExample(): void {
    const original = {
      name: 'John',
      hobbies: ['reading', 'coding'],
      address: {
        city: 'New York',
        country: 'USA'
      }
    }
    
    const cloned = cloneDeep(original)
    cloned.hobbies.push('gaming')
    cloned.address.city = 'Los Angeles'
    
    console.log('原始对象:', original)
    console.log('克隆对象:', cloned)
  }
}

/**
 * 函数操作示例
 */
export class FunctionExamples {
  /**
   * 防抖函数示例
   */
  static debounceExample(): void {
    let searchCount = 0
    
    const search = (query: string) => {
      searchCount++
      console.log(`搜索第 ${searchCount} 次:`, query)
    }
    
    // 创建防抖函数，300ms 内多次调用只执行最后一次
    const debouncedSearch = debounce(search, 300)
    
    // 模拟快速输入
    debouncedSearch('a')
    debouncedSearch('ab')
    debouncedSearch('abc')
    // 只会执行最后一次搜索 'abc'
  }

  /**
   * 节流函数示例
   */
  static throttleExample(): void {
    let scrollCount = 0
    
    const handleScroll = () => {
      scrollCount++
      console.log(`滚动处理第 ${scrollCount} 次`)
    }
    
    // 创建节流函数，1000ms 内最多执行一次
    const throttledScroll = throttle(handleScroll, 1000)
    
    // 模拟频繁滚动
    for (let i = 0; i < 10; i++) {
      setTimeout(() => throttledScroll(), i * 100)
    }
  }

  /**
   * 记忆化函数示例
   */
  static memoizeExample(): void {
    // 计算斐波那契数列（递归版本）
    const fibonacci = memoize((n: number): number => {
      console.log(`计算 fibonacci(${n})`)
      if (n <= 1) return n
      return fibonacci(n - 1) + fibonacci(n - 2)
    })
    
    console.log('第一次计算 fibonacci(10):')
    console.log(fibonacci(10))
    
    console.log('第二次计算 fibonacci(10):')
    console.log(fibonacci(10)) // 直接从缓存返回，不会重新计算
  }
}

/**
 * 类型检查示例
 */
export class TypeCheckExamples {
  /**
   * 类型检查示例
   */
  static typeCheckExample(): void {
    const values = [
      [],
      {},
      '',
      null,
      undefined,
      0,
      false,
      'hello',
      [1, 2, 3],
      { name: 'John' }
    ]
    
    values.forEach((value, index) => {
      console.log(`值 ${index}:`, value)
      console.log('  是数组:', isArray(value))
      console.log('  是对象:', isObject(value))
      console.log('  是空值:', isEmpty(value))
      console.log('  是 null/undefined:', isNil(value))
      console.log('---')
    })
  }
}

/**
 * 字符串操作示例
 */
export class StringExamples {
  /**
   * 字符串格式转换示例
   */
  static caseConversionExample(): void {
    const text = 'hello world example'
    
    console.log('原始文本:', text)
    console.log('驼峰命名:', camelCase(text)) // helloWorldExample
    console.log('短横线命名:', kebabCase(text)) // hello-world-example
    console.log('首字母大写:', capitalize(text)) // Hello world example
  }

  /**
   * 字符串截断示例
   */
  static truncateExample(): void {
    const longText = 'This is a very long text that needs to be truncated'
    
    const truncated1 = truncate(longText, { length: 20 })
    const truncated2 = truncate(longText, { 
      length: 30, 
      omission: '...' 
    })
    const truncated3 = truncate(longText, { 
      length: 25, 
      separator: ' ' // 在单词边界截断
    })
    
    console.log('原始文本:', longText)
    console.log('截断到20字符:', truncated1)
    console.log('截断到30字符:', truncated2)
    console.log('在单词边界截断:', truncated3)
  }
}

/**
 * 运行所有示例
 */
export function runAllExamples(): void {
  console.log('=== 数组操作示例 ===')
  ArrayExamples.chunkExample()
  ArrayExamples.uniqueExample()
  ArrayExamples.flattenExample()
  ArrayExamples.differenceExample()
  ArrayExamples.intersectionExample()
  
  console.log('\n=== 对象操作示例 ===')
  ObjectExamples.getExample()
  ObjectExamples.setExample()
  ObjectExamples.pickOmitExample()
  ObjectExamples.mergeExample()
  ObjectExamples.cloneDeepExample()
  
  console.log('\n=== 函数操作示例 ===')
  FunctionExamples.debounceExample()
  FunctionExamples.throttleExample()
  FunctionExamples.memoizeExample()
  
  console.log('\n=== 类型检查示例 ===')
  TypeCheckExamples.typeCheckExample()
  
  console.log('\n=== 字符串操作示例 ===')
  StringExamples.caseConversionExample()
  StringExamples.truncateExample()
}