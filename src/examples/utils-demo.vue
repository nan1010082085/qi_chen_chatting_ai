<template>
  <div class="p-6 max-w-4xl mx-auto space-y-8">
    <!-- UnoCSS 样式演示 -->
    <section class="card-base p-6">
      <h2 class="text-2xl font-bold text-gradient mb-4">UnoCSS 样式演示</h2>
      
      <!-- 按钮组 -->
      <div class="flex-between mb-6">
        <div class="space-x-2">
          <button class="btn-primary">主要按钮</button>
          <button class="btn-secondary">次要按钮</button>
          <button class="btn-success">成功按钮</button>
          <button class="btn-warning">警告按钮</button>
          <button class="btn-error">错误按钮</button>
          <button class="btn-ghost">幽灵按钮</button>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input 
          class="input-base" 
          placeholder="普通输入框"
          v-model="inputValue"
        />
        <input 
          class="input-error" 
          placeholder="错误状态输入框"
          v-model="errorInput"
        />
      </div>

      <!-- 卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card-hover p-4">
          <h3 class="font-semibold text-primary-600 mb-2">卡片标题 1</h3>
          <p class="text-muted">这是一个带悬停效果的卡片示例。</p>
        </div>
        <div class="card-hover p-4">
          <h3 class="font-semibold text-success-600 mb-2">卡片标题 2</h3>
          <p class="text-muted">展示了 UnoCSS 的强大功能。</p>
        </div>
        <div class="card-hover p-4">
          <h3 class="font-semibold text-warning-600 mb-2">卡片标题 3</h3>
          <p class="text-muted">原子化 CSS 让样式开发更高效。</p>
        </div>
      </div>

      <!-- 动画演示 -->
      <div class="mt-6">
        <button 
          @click="showAnimation = !showAnimation"
          class="btn-primary mb-4"
        >
          切换动画
        </button>
        <div 
          v-if="showAnimation"
          class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-lg animate-fade-in"
        >
          <p class="animate-slide-up">这是一个带动画效果的元素！</p>
        </div>
      </div>
    </section>

    <!-- Day.js 时间工具演示 -->
    <section class="card-base p-6">
      <h2 class="text-2xl font-bold text-gradient mb-4">Day.js 时间工具演示</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 时间格式化 -->
        <div>
          <h3 class="font-semibold text-primary-600 mb-3">时间格式化</h3>
          <div class="space-y-2 text-sm">
            <div class="flex-between">
              <span class="text-muted">当前时间:</span>
              <span class="font-mono">{{ timeExamples.current }}</span>
            </div>
            <div class="flex-between">
              <span class="text-muted">友好格式:</span>
              <span class="font-mono">{{ timeExamples.friendly }}</span>
            </div>
            <div class="flex-between">
              <span class="text-muted">相对时间:</span>
              <span class="font-mono">{{ timeExamples.relative }}</span>
            </div>
            <div class="flex-between">
              <span class="text-muted">中文格式:</span>
              <span class="font-mono">{{ timeExamples.chinese }}</span>
            </div>
          </div>
        </div>

        <!-- 时间计算 -->
        <div>
          <h3 class="font-semibold text-primary-600 mb-3">时间计算</h3>
          <div class="space-y-2 text-sm">
            <div class="flex-between">
              <span class="text-muted">明天:</span>
              <span class="font-mono">{{ timeExamples.tomorrow }}</span>
            </div>
            <div class="flex-between">
              <span class="text-muted">一周后:</span>
              <span class="font-mono">{{ timeExamples.nextWeek }}</span>
            </div>
            <div class="flex-between">
              <span class="text-muted">年龄计算:</span>
              <span class="font-mono">{{ timeExamples.age }} 岁</span>
            </div>
            <div class="flex-between">
              <span class="text-muted">星期几:</span>
              <span class="font-mono">{{ timeExamples.weekday }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 持续时间演示 -->
      <div class="mt-6">
        <h3 class="font-semibold text-primary-600 mb-3">持续时间格式化</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-secondary-50 p-3 rounded">
            <div class="text-xs text-muted mb-1">1小时30分钟</div>
            <div class="font-mono text-sm">{{ durationExamples.hour }}</div>
          </div>
          <div class="bg-secondary-50 p-3 rounded">
            <div class="text-xs text-muted mb-1">2天12小时</div>
            <div class="font-mono text-sm">{{ durationExamples.days }}</div>
          </div>
          <div class="bg-secondary-50 p-3 rounded">
            <div class="text-xs text-muted mb-1">45秒</div>
            <div class="font-mono text-sm">{{ durationExamples.seconds }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Lodash 工具演示 -->
    <section class="card-base p-6">
      <h2 class="text-2xl font-bold text-gradient mb-4">Lodash 工具演示</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 数组操作 -->
        <div>
          <h3 class="font-semibold text-primary-600 mb-3">数组操作</h3>
          <div class="space-y-3">
            <div>
              <label class="text-sm text-muted">原始数组:</label>
              <div class="bg-secondary-50 p-2 rounded font-mono text-sm mt-1">
                {{ JSON.stringify(arrayExamples.original) }}
              </div>
            </div>
            <div>
              <label class="text-sm text-muted">去重后:</label>
              <div class="bg-secondary-50 p-2 rounded font-mono text-sm mt-1">
                {{ JSON.stringify(arrayExamples.unique) }}
              </div>
            </div>
            <div>
              <label class="text-sm text-muted">分块 (size=3):</label>
              <div class="bg-secondary-50 p-2 rounded font-mono text-sm mt-1">
                {{ JSON.stringify(arrayExamples.chunked) }}
              </div>
            </div>
            <div>
              <label class="text-sm text-muted">打乱顺序:</label>
              <div class="bg-secondary-50 p-2 rounded font-mono text-sm mt-1">
                {{ JSON.stringify(arrayExamples.shuffled) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 对象操作 -->
        <div>
          <h3 class="font-semibold text-primary-600 mb-3">对象操作</h3>
          <div class="space-y-3">
            <div>
              <label class="text-sm text-muted">原始对象:</label>
              <div class="bg-secondary-50 p-2 rounded font-mono text-sm mt-1">
                {{ JSON.stringify(objectExamples.original, null, 2) }}
              </div>
            </div>
            <div>
              <label class="text-sm text-muted">选择属性 (name, age):</label>
              <div class="bg-secondary-50 p-2 rounded font-mono text-sm mt-1">
                {{ JSON.stringify(objectExamples.picked, null, 2) }}
              </div>
            </div>
            <div>
              <label class="text-sm text-muted">深度获取 (profile.address.city):</label>
              <div class="bg-secondary-50 p-2 rounded font-mono text-sm mt-1">
                {{ objectExamples.deepGet }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 字符串操作 -->
      <div class="mt-6">
        <h3 class="font-semibold text-primary-600 mb-3">字符串操作</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-secondary-50 p-3 rounded">
            <div class="text-xs text-muted mb-1">驼峰命名</div>
            <div class="font-mono text-sm">{{ stringExamples.camelCase }}</div>
          </div>
          <div class="bg-secondary-50 p-3 rounded">
            <div class="text-xs text-muted mb-1">短横线命名</div>
            <div class="font-mono text-sm">{{ stringExamples.kebabCase }}</div>
          </div>
          <div class="bg-secondary-50 p-3 rounded">
            <div class="text-xs text-muted mb-1">下划线命名</div>
            <div class="font-mono text-sm">{{ stringExamples.snakeCase }}</div>
          </div>
          <div class="bg-secondary-50 p-3 rounded">
            <div class="text-xs text-muted mb-1">标题命名</div>
            <div class="font-mono text-sm">{{ stringExamples.startCase }}</div>
          </div>
        </div>
      </div>

      <!-- 函数工具 -->
      <div class="mt-6">
        <h3 class="font-semibold text-primary-600 mb-3">函数工具</h3>
        <div class="space-x-2">
          <button 
            @click="debouncedFunction"
            class="btn-secondary"
          >
            防抖函数 (500ms)
          </button>
          <button 
            @click="throttledFunction"
            class="btn-secondary"
          >
            节流函数 (1000ms)
          </button>
          <span class="text-sm text-muted">调用次数: {{ functionCallCount }}</span>
        </div>
      </div>
    </section>

    <!-- 实时时间显示 -->
    <section class="card-base p-6">
      <h2 class="text-2xl font-bold text-gradient mb-4">实时时间显示</h2>
      <div class="text-center">
        <div class="text-4xl font-mono text-primary-600 mb-2">
          {{ currentTime }}
        </div>
        <div class="text-lg text-muted">
          {{ currentDate }}
        </div>
        <div class="text-sm text-secondary-500 mt-2">
          运行时间: {{ runningTime }}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  dayjs, 
  DateTimeUtils, 
  TIME_FORMATS
} from '@/utils'
import { 
  chunk, 
  uniq, 
  shuffle, 
  pick, 
  get, 
  camelCase, 
  kebabCase, 
  snakeCase, 
  startCase, 
  debounce, 
  throttle 
} from 'lodash-es'

// 响应式数据
const inputValue = ref('')
const errorInput = ref('')
const showAnimation = ref(false)
const functionCallCount = ref(0)
const currentTime = ref('')
const currentDate = ref('')
const startTime = ref(dayjs())
const runningTime = ref('')

// 时间示例
const timeExamples = computed(() => {
  const now = dayjs()
  const birthDate = dayjs('1990-05-15')
  
  return {
    current: DateTimeUtils.format(now, TIME_FORMATS.DATETIME),
    friendly: DateTimeUtils.friendly(now.subtract(2, 'hour')),
    relative: DateTimeUtils.fromNow(now.subtract(30, 'minute')),
    chinese: DateTimeUtils.format(now, TIME_FORMATS.DATETIME_CN),
    tomorrow: DateTimeUtils.format(DateTimeUtils.add(now, 1, 'day'), TIME_FORMATS.DATE_CN),
    nextWeek: DateTimeUtils.format(DateTimeUtils.add(now, 1, 'week'), TIME_FORMATS.DATETIME_FRIENDLY),
    age: DateTimeUtils.getAge(birthDate),
    weekday: DateTimeUtils.getWeekday(now, 'long')
  }
})

// 持续时间示例
const durationExamples = computed(() => ({
  hour: DateTimeUtils.formatDuration(90 * 60 * 1000, 'human'), // 1.5小时
  days: DateTimeUtils.formatDuration(2.5 * 24 * 60 * 60 * 1000, 'human'), // 2.5天
  seconds: DateTimeUtils.formatDuration(45 * 1000, 'human') // 45秒
}))

// 数组示例
const arrayExamples = computed(() => {
  const original = [1, 2, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10]
  
  return {
    original,
    unique: uniq(original),
    chunked: chunk(original, 3),
    shuffled: shuffle([...original])
  }
})

// 对象示例
const objectExamples = computed(() => {
  const original = {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
    profile: {
      bio: 'Software Developer',
      address: {
        city: 'Beijing',
        country: 'China'
      }
    }
  }
  
  return {
    original,
    picked: pick(original, ['name', 'age']),
    deepGet: get(original, 'profile.address.city', '未知')
  }
})

// 字符串示例
const stringExamples = computed(() => {
  const original = 'hello world example'
  
  return {
    camelCase: camelCase(original),
    kebabCase: kebabCase(original),
    snakeCase: snakeCase(original),
    startCase: startCase(original)
  }
})

// 防抖和节流函数
const debouncedFunction = debounce(() => {
  functionCallCount.value++
  console.log('防抖函数被调用')
}, 500)

const throttledFunction = throttle(() => {
  functionCallCount.value++
  console.log('节流函数被调用')
}, 1000)

// 定时器
let timer: number | null = null

// 更新时间
const updateTime = () => {
  const now = dayjs()
  currentTime.value = now.format('HH:mm:ss')
  currentDate.value = now.format('YYYY年MM月DD日 dddd')
  runningTime.value = DateTimeUtils.formatDuration(
    now.diff(startTime.value),
    'human'
  )
}

// 生命周期
onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
/* 自定义样式补充 */
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
}

/* 确保动画正常工作 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
</style>
