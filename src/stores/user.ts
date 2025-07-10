import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string
  name: string
  avatar?: string
  email?: string
  role?: string
  [key: string]: any
}

/**
 * 用户状态管理
 */
export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserInfo | null>(null)
  const isLoggedIn = ref(false)

  // 计算属性
  const userName = computed(() => userInfo.value?.name || '访客')
  const userAvatar = computed(() => userInfo.value?.avatar || '')
  const userId = computed(() => userInfo.value?.id || '')

  /**
   * 设置用户信息
   * @param info - 用户信息
   */
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    isLoggedIn.value = true
    console.log('User info updated:', info)
  }

  /**
   * 清除用户信息
   */
  const clearUserInfo = () => {
    userInfo.value = null
    isLoggedIn.value = false
  }

  /**
   * 更新用户信息
   * @param updates - 要更新的字段
   */
  const updateUserInfo = (updates: Partial<UserInfo>) => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...updates }
    }
  }

  return {
    // 状态
    userInfo,
    isLoggedIn,
    // 计算属性
    userName,
    userAvatar,
    userId,
    // 方法
    setUserInfo,
    clearUserInfo,
    updateUserInfo
  }
})