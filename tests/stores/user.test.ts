import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore, type UserInfo } from '@/stores/user'

/**
 * 用户store单元测试
 */
describe('useUserStore', () => {
  beforeEach(() => {
    // 为每个测试创建新的pinia实例
    setActivePinia(createPinia())
  })

  it('应该正确初始化默认状态', () => {
    const userStore = useUserStore()
    
    expect(userStore.userInfo).toBeNull()
    expect(userStore.isLoggedIn).toBe(false)
    expect(userStore.userName).toBe('访客')
    expect(userStore.userAvatar).toBe('')
    expect(userStore.userId).toBe('')
  })

  it('应该正确设置用户信息', () => {
    const userStore = useUserStore()
    const mockUserInfo: UserInfo = {
      id: '123',
      name: '张三',
      avatar: 'https://example.com/avatar.jpg',
      email: 'zhangsan@example.com',
      role: 'user'
    }

    userStore.setUserInfo(mockUserInfo)

    expect(userStore.userInfo).toEqual(mockUserInfo)
    expect(userStore.isLoggedIn).toBe(true)
    expect(userStore.userName).toBe('张三')
    expect(userStore.userAvatar).toBe('https://example.com/avatar.jpg')
    expect(userStore.userId).toBe('123')
  })

  it('应该正确清除用户信息', () => {
    const userStore = useUserStore()
    const mockUserInfo: UserInfo = {
      id: '123',
      name: '张三'
    }

    // 先设置用户信息
    userStore.setUserInfo(mockUserInfo)
    expect(userStore.isLoggedIn).toBe(true)

    // 清除用户信息
    userStore.clearUserInfo()

    expect(userStore.userInfo).toBeNull()
    expect(userStore.isLoggedIn).toBe(false)
    expect(userStore.userName).toBe('访客')
    expect(userStore.userAvatar).toBe('')
    expect(userStore.userId).toBe('')
  })

  it('应该正确更新用户信息', () => {
    const userStore = useUserStore()
    const initialUserInfo: UserInfo = {
      id: '123',
      name: '张三',
      email: 'zhangsan@example.com'
    }

    // 设置初始用户信息
    userStore.setUserInfo(initialUserInfo)

    // 更新部分信息
    const updates = {
      name: '李四',
      avatar: 'https://example.com/new-avatar.jpg'
    }
    userStore.updateUserInfo(updates)

    expect(userStore.userInfo).toEqual({
      id: '123',
      name: '李四',
      email: 'zhangsan@example.com',
      avatar: 'https://example.com/new-avatar.jpg'
    })
    expect(userStore.userName).toBe('李四')
    expect(userStore.userAvatar).toBe('https://example.com/new-avatar.jpg')
  })

  it('当用户信息为null时，更新用户信息应该不生效', () => {
    const userStore = useUserStore()
    
    // 确保用户信息为null
    expect(userStore.userInfo).toBeNull()

    // 尝试更新用户信息
    userStore.updateUserInfo({ name: '张三' })

    // 用户信息应该仍然为null
    expect(userStore.userInfo).toBeNull()
  })

  it('应该正确处理没有可选字段的用户信息', () => {
    const userStore = useUserStore()
    const minimalUserInfo: UserInfo = {
      id: '123',
      name: '张三'
    }

    userStore.setUserInfo(minimalUserInfo)

    expect(userStore.userInfo).toEqual(minimalUserInfo)
    expect(userStore.userName).toBe('张三')
    expect(userStore.userAvatar).toBe('')
    expect(userStore.userId).toBe('123')
  })

  it('应该正确处理自定义字段', () => {
    const userStore = useUserStore()
    const userInfoWithCustomFields: UserInfo = {
      id: '123',
      name: '张三',
      customField: 'customValue',
      anotherField: 42
    }

    userStore.setUserInfo(userInfoWithCustomFields)

    expect(userStore.userInfo).toEqual(userInfoWithCustomFields)
    expect(userStore.userInfo?.customField).toBe('customValue')
    expect(userStore.userInfo?.anotherField).toBe(42)
  })
})
