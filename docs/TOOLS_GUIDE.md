# 工具库使用指南

本项目集成了三个强大的工具库，用于提升开发效率和代码质量：

- **Windi CSS** - 原子化 CSS 框架
- **Day.js** - 轻量级时间处理库
- **Lodash** - JavaScript 实用工具库

## 🎨 Windi CSS 原子化样式

### 配置文件

- `windi.config.ts` - Windi CSS 主配置文件
- `vite.config.ts` - Vite 插件配置
- `src/main.ts` - 样式导入

### 主要特性

#### 1. 自定义主题色彩

```typescript
// 主色调
primary: { 50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a8a' }
secondary: { 50: '#f8fafc', 500: '#64748b', 900: '#0f172a' }
success: { 50: '#f0fdf4', 500: '#22c55e', 900: '#14532d' }
warning: { 50: '#fffbeb', 500: '#f59e0b', 900: '#78350f' }
error: { 50: '#fef2f2', 500: '#ef4444', 900: '#7f1d1d' }
```

#### 2. 预定义快捷样式

```html
<!-- 布局快捷方式 -->
<div class="flex-center">居中布局</div>
<div class="flex-between">两端对齐</div>
<div class="absolute-center">绝对居中</div>

<!-- 按钮样式 -->
<button class="btn-primary">主要按钮</button>
<button class="btn-secondary">次要按钮</button>
<button class="btn-success">成功按钮</button>
<button class="btn-ghost">幽灵按钮</button>

<!-- 输入框样式 -->
<input class="input-base" placeholder="普通输入框" />
<input class="input-error" placeholder="错误状态" />

<!-- 卡片样式 -->
<div class="card-base">基础卡片</div>
<div class="card-hover">悬停效果卡片</div>

<!-- 文本样式 -->
<h1 class="text-gradient">渐变文字</h1>
<p class="text-muted">次要文字</p>
<span class="text-error">错误文字</span>
```

#### 3. 自定义动画

```html
<!-- 淡入动画 -->
<div class="animate-fade-in">淡入效果</div>

<!-- 滑动动画 -->
<div class="animate-slide-up">向上滑动</div>
<div class="animate-slide-down">向下滑动</div>

<!-- 弹跳动画 -->
<div class="animate-bounce-soft">柔和弹跳</div>

<!-- 脉冲动画 -->
<div class="animate-pulse-soft">柔和脉冲</div>
```

#### 4. 响应式断点

```html
<!-- 响应式网格 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  <div class="col-span-1">网格项目</div>
</div>

<!-- 响应式间距 -->
<div class="p-2 md:p-4 lg:p-6">响应式内边距</div>

<!-- 响应式文字大小 -->
<h1 class="text-lg md:text-xl lg:text-2xl">响应式标题</h1>
```

### 使用示例

```vue
<template>
  <div class="min-h-screen bg-secondary-50">
    <!-- 导航栏 -->
    <nav class="bg-white shadow-soft">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex-between h-16">
          <h1 class="text-xl font-bold text-gradient">我的应用</h1>
          <div class="space-x-2">
            <button class="btn-ghost">登录</button>
            <button class="btn-primary">注册</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="max-w-4xl mx-auto p-6">
      <div class="card-hover p-6 mb-6">
        <h2 class="text-2xl font-bold mb-4">欢迎使用</h2>
        <p class="text-muted mb-4">这是一个使用 Windi CSS 构建的现代化界面。</p>
        <button class="btn-primary">开始使用</button>
      </div>
    </main>
  </div>
</template>
```

## ⏰ Day.js 时间管理

### 配置文件

- `src/utils/dayjs.ts` - Day.js 配置和工具类

### 主要特性

#### 1. 时间格式化

```typescript
import { DateTimeUtils, TIME_FORMATS } from '@/utils'

// 基础格式化
DateTimeUtils.format(new Date(), TIME_FORMATS.DATETIME)
// 输出: "2024-01-15 14:30:25"

DateTimeUtils.format(new Date(), TIME_FORMATS.DATE_CN)
// 输出: "2024年01月15日"

// 友好格式化
DateTimeUtils.friendly(new Date())
// 输出: "14:30" (今天) 或 "昨天 14:30" 或 "01月15日 14:30"

// 相对时间
DateTimeUtils.fromNow(new Date(Date.now() - 3600000))
// 输出: "1小时前"
```

#### 2. 时间计算

```typescript
// 添加时间
const tomorrow = DateTimeUtils.add(new Date(), 1, 'day')
const nextWeek = DateTimeUtils.add(new Date(), 1, 'week')
const nextMonth = DateTimeUtils.add(new Date(), 1, 'month')

// 减去时间
const yesterday = DateTimeUtils.subtract(new Date(), 1, 'day')
const lastHour = DateTimeUtils.subtract(new Date(), 1, 'hour')

// 时间差
const diffInDays = DateTimeUtils.diff(date1, date2, 'day')
const diffInHours = DateTimeUtils.diff(date1, date2, 'hour')

// 年龄计算
const age = DateTimeUtils.getAge('1990-05-15')
```

#### 3. 时间判断

```typescript
// 基础判断
DateTimeUtils.isToday(new Date())        // true
DateTimeUtils.isYesterday(yesterday)     // true
DateTimeUtils.isTomorrow(tomorrow)       // true

// 工作日判断
DateTimeUtils.isWorkday(new Date())      // true/false
DateTimeUtils.isWeekend(new Date())      // true/false

// 时间有效性
DateTimeUtils.isValid('2024-01-15')     // true
DateTimeUtils.isValid('invalid-date')   // false
```

#### 4. 持续时间处理

```typescript
// 格式化持续时间
DateTimeUtils.formatDuration(3661000)           // "1小时1分钟1秒"
DateTimeUtils.formatDuration(3661000, 'HH:mm:ss') // "01:01:01"

// 创建持续时间
const duration = DateTimeUtils.duration(3600000) // 1小时
```

#### 5. 快捷方法

```typescript
import { now, today, tomorrow, yesterday, thisWeek, thisMonth, thisYear } from '@/utils'

const currentTime = now()           // 当前时间
const todayStart = today()         // 今天开始时间
const tomorrowStart = tomorrow()   // 明天开始时间
const yesterdayStart = yesterday() // 昨天开始时间
const weekStart = thisWeek()       // 本周开始时间
const monthStart = thisMonth()     // 本月开始时间
const yearStart = thisYear()       // 本年开始时间
```

### 使用示例

```vue
<template>
  <div>
    <!-- 显示格式化时间 -->
    <p>当前时间: {{ currentTime }}</p>
    <p>友好时间: {{ friendlyTime }}</p>
    <p>相对时间: {{ relativeTime }}</p>
    
    <!-- 显示时间信息 -->
    <div>
      <span>今天是{{ weekday }}</span>
      <span>第{{ quarter }}季度</span>
      <span>第{{ week }}周</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { DateTimeUtils, TIME_FORMATS } from '@/utils'

const now = ref(new Date())

const currentTime = computed(() => 
  DateTimeUtils.format(now.value, TIME_FORMATS.DATETIME_CN)
)

const friendlyTime = computed(() => 
  DateTimeUtils.friendly(now.value)
)

const relativeTime = computed(() => 
  DateTimeUtils.fromNow(DateTimeUtils.subtract(now.value, 2, 'hour'))
)

const weekday = computed(() => 
  DateTimeUtils.getWeekday(now.value, 'long')
)

const quarter = computed(() => 
  DateTimeUtils.getQuarter(now.value)
)

const week = computed(() => 
  DateTimeUtils.getWeek(now.value)
)

// 定时更新时间
onMounted(() => {
  setInterval(() => {
    now.value = new Date()
  }, 1000)
})
</script>
```

## 🔧 Lodash 工具库

### 配置文件

- `src/utils/lodash.ts` - Lodash 工具类封装

### 主要特性

#### 1. 数组工具 (ArrayUtils)

```typescript
import { ArrayUtils } from '@/utils'

// 数组去重
const unique = ArrayUtils.unique([1, 2, 2, 3, 3, 4])
// 结果: [1, 2, 3, 4]

// 根据属性去重
const users = [{ id: 1, name: 'John' }, { id: 1, name: 'Jane' }, { id: 2, name: 'Bob' }]
const uniqueUsers = ArrayUtils.uniqueBy(users, 'id')
// 结果: [{ id: 1, name: 'John' }, { id: 2, name: 'Bob' }]

// 数组分块
const chunked = ArrayUtils.chunk([1, 2, 3, 4, 5, 6], 2)
// 结果: [[1, 2], [3, 4], [5, 6]]

// 数组交集、并集、差集
const intersection = ArrayUtils.intersection([1, 2, 3], [2, 3, 4])
// 结果: [2, 3]

const union = ArrayUtils.union([1, 2], [2, 3], [3, 4])
// 结果: [1, 2, 3, 4]

const difference = ArrayUtils.difference([1, 2, 3], [2, 3])
// 结果: [1]

// 数组分组
const grouped = ArrayUtils.groupBy(users, 'department')
// 结果: { 'IT': [...], 'HR': [...] }

// 数组排序
const sorted = ArrayUtils.sortBy(users, ['age', 'name'], ['desc', 'asc'])

// 随机获取元素
const randomItem = ArrayUtils.sample([1, 2, 3, 4, 5])
const randomItems = ArrayUtils.sample([1, 2, 3, 4, 5], 3)

// 打乱数组
const shuffled = ArrayUtils.shuffle([1, 2, 3, 4, 5])
```

#### 2. 对象工具 (ObjectUtils)

```typescript
import { ObjectUtils } from '@/utils'

const user = {
  name: 'John',
  age: 30,
  profile: {
    email: 'john@example.com',
    address: {
      city: 'Beijing',
      country: 'China'
    }
  }
}

// 深拷贝
const clonedUser = ObjectUtils.cloneDeep(user)

// 获取深层属性
const city = ObjectUtils.get(user, 'profile.address.city', '未知')
// 结果: "Beijing"

// 设置深层属性
ObjectUtils.set(user, 'profile.address.zipCode', '100000')

// 检查属性存在
const hasEmail = ObjectUtils.has(user, 'profile.email')
// 结果: true

// 选择属性
const basicInfo = ObjectUtils.pick(user, ['name', 'age'])
// 结果: { name: 'John', age: 30 }

// 排除属性
const withoutAge = ObjectUtils.omit(user, ['age'])

// 合并对象
const merged = ObjectUtils.merge(user, { status: 'active' })

// 转换键值
const upperKeys = ObjectUtils.mapKeys(user, (value, key) => key.toUpperCase())
const doubledValues = ObjectUtils.mapValues({ a: 1, b: 2 }, value => value * 2)

// 对象检查
const isEmpty = ObjectUtils.isEmpty({})
const isEqual = ObjectUtils.isEqual(obj1, obj2)
```

#### 3. 字符串工具 (StringUtils)

```typescript
import { StringUtils } from '@/utils'

const text = 'hello world example'

// 命名转换
const camelCase = StringUtils.camelCase(text)     // "helloWorldExample"
const kebabCase = StringUtils.kebabCase(text)     // "hello-world-example"
const snakeCase = StringUtils.snakeCase(text)     // "hello_world_example"
const startCase = StringUtils.startCase(text)     // "Hello World Example"

// 首字母处理
const capitalized = StringUtils.capitalize(text)  // "Hello world example"
const upperFirst = StringUtils.upperFirst(text)   // "Hello world example"
const lowerFirst = StringUtils.lowerFirst('Hello') // "hello"

// 字符串截断
const truncated = StringUtils.truncate('这是一个很长的文本', { length: 10 })
// 结果: "这是一个很长的..."

// 字符串填充
const padded = StringUtils.pad('5', 3, '0')       // "050"
const leftPad = StringUtils.padStart('5', 3, '0') // "005"
const rightPad = StringUtils.padEnd('5', 3, '0')  // "500"

// 字符串重复
const repeated = StringUtils.repeat('*', 5)       // "*****"

// 字符串修剪
const trimmed = StringUtils.trim('  hello  ')    // "hello"
const trimStart = StringUtils.trimStart('  hello  ') // "hello  "
const trimEnd = StringUtils.trimEnd('  hello  ')     // "  hello"

// 字符串检查
const startsWithHello = StringUtils.startsWith(text, 'hello') // true
const endsWithExample = StringUtils.endsWith(text, 'example') // true

// 分割为单词
const words = StringUtils.words('hello-world_example') // ["hello", "world", "example"]
```

#### 4. 函数工具 (FunctionUtils)

```typescript
import { FunctionUtils } from '@/utils'

// 防抖函数
const debouncedSearch = FunctionUtils.debounce((query: string) => {
  console.log('搜索:', query)
}, 300)

// 节流函数
const throttledScroll = FunctionUtils.throttle(() => {
  console.log('滚动事件')
}, 100)

// 记忆化函数
const memoizedExpensive = FunctionUtils.memoize((n: number) => {
  // 昂贵的计算
  return n * n
})

// 只执行一次
const initOnce = FunctionUtils.once(() => {
  console.log('初始化，只执行一次')
})

// 延迟执行
FunctionUtils.delay(() => {
  console.log('延迟执行')
}, 1000)

// 柯里化
const add = (a: number, b: number, c: number) => a + b + c
const curriedAdd = FunctionUtils.curry(add)
const addFive = curriedAdd(5)
const addFiveAndThree = addFive(3)
const result = addFiveAndThree(2) // 10

// 偏函数
const multiply = (a: number, b: number, c: number) => a * b * c
const multiplyByTwo = FunctionUtils.partial(multiply, 2)
const result2 = multiplyByTwo(3, 4) // 24
```

#### 5. 数学工具 (MathUtils)

```typescript
import { MathUtils } from '@/utils'

const numbers = [1, 2, 3, 4, 5]

// 基础计算
const sum = MathUtils.sum(numbers)        // 15
const mean = MathUtils.mean(numbers)      // 3
const max = MathUtils.max(numbers)        // 5
const min = MathUtils.min(numbers)        // 1

// 数值限制
const clamped = MathUtils.clamp(10, 1, 5) // 5 (限制在1-5之间)

// 范围检查
const inRange = MathUtils.inRange(3, 1, 5) // true

// 随机数
const randomInt = MathUtils.random(1, 10)     // 1-10之间的整数
const randomFloat = MathUtils.random(1, 10, true) // 1-10之间的浮点数

// 数值舍入
const rounded = MathUtils.round(3.14159, 2)  // 3.14
const ceiled = MathUtils.ceil(3.14159, 1)    // 3.2
const floored = MathUtils.floor(3.14159, 1)  // 3.1
```

#### 6. 类型检查工具 (TypeUtils)

```typescript
import { TypeUtils } from '@/utils'

// 基础类型检查
TypeUtils.isArray([1, 2, 3])           // true
TypeUtils.isObject({})                 // true
TypeUtils.isString('hello')            // true
TypeUtils.isNumber(42)                 // true
TypeUtils.isBoolean(true)              // true
TypeUtils.isFunction(() => {})         // true
TypeUtils.isDate(new Date())           // true
TypeUtils.isRegExp(/test/)             // true

// 空值检查
TypeUtils.isNil(null)                  // true
TypeUtils.isNil(undefined)             // true
TypeUtils.isNull(null)                 // true
TypeUtils.isUndefined(undefined)       // true
TypeUtils.isEmpty([])                  // true
TypeUtils.isEmpty({})                  // true
TypeUtils.isEmpty('')                  // true

// 数字检查
TypeUtils.isFinite(42)                 // true
TypeUtils.isInteger(42)                // true
TypeUtils.isSafeInteger(42)            // true
TypeUtils.isNaN(NaN)                   // true

// 对象类型检查
TypeUtils.isPlainObject({})            // true
TypeUtils.isPlainObject(new Date())    // false
```

### 使用示例

```vue
<template>
  <div>
    <!-- 搜索框 -->
    <input 
      v-model="searchQuery" 
      @input="handleSearch"
      placeholder="搜索用户..."
    />
    
    <!-- 用户列表 -->
    <div v-for="user in filteredUsers" :key="user.id">
      <h3>{{ formatUserName(user.name) }}</h3>
      <p>{{ user.email }}</p>
      <p>年龄: {{ user.age }}</p>
    </div>
    
    <!-- 统计信息 -->
    <div>
      <p>平均年龄: {{ averageAge }}</p>
      <p>最大年龄: {{ maxAge }}</p>
      <p>最小年龄: {{ minAge }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  ArrayUtils, 
  ObjectUtils, 
  StringUtils, 
  FunctionUtils, 
  MathUtils 
} from '@/utils'

const searchQuery = ref('')
const users = ref([
  { id: 1, name: 'john doe', email: 'john@example.com', age: 25 },
  { id: 2, name: 'jane smith', email: 'jane@example.com', age: 30 },
  { id: 3, name: 'bob johnson', email: 'bob@example.com', age: 35 }
])

// 防抖搜索
const handleSearch = FunctionUtils.debounce(() => {
  console.log('搜索:', searchQuery.value)
}, 300)

// 过滤用户
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  return users.value.filter(user => 
    StringUtils.toLower(user.name).includes(StringUtils.toLower(searchQuery.value))
  )
})

// 格式化用户名
const formatUserName = (name: string) => {
  return StringUtils.startCase(name)
}

// 统计信息
const ages = computed(() => users.value.map(user => user.age))
const averageAge = computed(() => MathUtils.round(MathUtils.mean(ages.value), 1))
const maxAge = computed(() => MathUtils.max(ages.value))
const minAge = computed(() => MathUtils.min(ages.value))
</script>
```

## 📝 最佳实践

### 1. 按需导入

```typescript
// ✅ 推荐：按需导入
import { DateTimeUtils, ArrayUtils, StringUtils } from '@/utils'

// ❌ 避免：全量导入
import * as utils from '@/utils'
```

### 2. 类型安全

```typescript
// ✅ 使用 TypeScript 类型
const users: User[] = ArrayUtils.unique(userList)
const userInfo: Partial<User> = ObjectUtils.pick(user, ['name', 'email'])

// ✅ 利用类型检查
if (TypeUtils.isArray(data)) {
  // TypeScript 知道 data 是数组类型
  data.forEach(item => console.log(item))
}
```

### 3. 性能优化

```typescript
// ✅ 使用记忆化缓存昂贵计算
const expensiveCalculation = FunctionUtils.memoize((data: any[]) => {
  return data.reduce((acc, item) => acc + item.value, 0)
})

// ✅ 使用防抖优化频繁操作
const debouncedSave = FunctionUtils.debounce(saveData, 500)

// ✅ 使用节流优化滚动事件
const throttledScroll = FunctionUtils.throttle(handleScroll, 100)
```

### 4. 错误处理

```typescript
// ✅ 安全的深度获取
const city = ObjectUtils.get(user, 'profile.address.city', '未知城市')

// ✅ 验证时间有效性
if (DateTimeUtils.isValid(dateString)) {
  const formatted = DateTimeUtils.format(dateString)
}

// ✅ 类型检查
if (TypeUtils.isArray(data) && !TypeUtils.isEmpty(data)) {
  // 安全处理数组
}
```

### 5. 代码组织

```typescript
// utils/business.ts - 业务相关工具
import { DateTimeUtils, StringUtils } from '@/utils'

export const formatUserDisplayName = (user: User) => {
  return StringUtils.startCase(`${user.firstName} ${user.lastName}`)
}

export const formatLastLoginTime = (timestamp: number) => {
  return DateTimeUtils.friendly(timestamp)
}

// utils/validation.ts - 验证相关工具
import { TypeUtils, StringUtils } from '@/utils'

export const validateEmail = (email: string) => {
  return TypeUtils.isString(email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const validatePhone = (phone: string) => {
  const cleaned = StringUtils.replace(phone, /\D/g, '')
  return cleaned.length === 11
}
```

## 🔗 相关链接

- [Windi CSS 官方文档](https://windicss.org/)
- [Day.js 官方文档](https://dayjs.gitee.io/)
- [Lodash 官方文档](https://lodash.com/)
- [项目示例页面](../src/examples/utils-demo.vue)

## 📞 技术支持

如果在使用过程中遇到问题，请：

1. 查看相关工具库的官方文档
2. 参考项目中的示例代码
3. 在项目 Issues 中提出问题
4. 联系开发团队获取支持