/**
 * UUID 工具类
 * 提供各种 UUID 生成和操作功能
 */

import { v1 as uuidv1, v4 as uuidv4, v5 as uuidv5, validate, version } from 'uuid'

/**
 * UUID 工具类
 */
export class UUIDUtils {
  /**
   * 生成 UUID v4（随机）
   * @returns UUID v4 字符串
   */
  static generateV4(): string {
    return uuidv4()
  }

  /**
   * 生成 UUID v1（基于时间戳和 MAC 地址）
   * @returns UUID v1 字符串
   */
  static generateV1(): string {
    return uuidv1()
  }

  /**
   * 生成 UUID v5（基于命名空间和名称的 SHA-1 哈希）
   * @param name 名称
   * @param namespace 命名空间 UUID
   * @returns UUID v5 字符串
   */
  static generateV5(name: string, namespace: string): string {
    return uuidv5(name, namespace)
  }

  /**
   * 生成短 UUID（去掉连字符）
   * @returns 短 UUID 字符串
   */
  static generateShort(): string {
    return uuidv4().replace(/-/g, '')
  }

  /**
   * 生成大写 UUID
   * @returns 大写 UUID 字符串
   */
  static generateUpperCase(): string {
    return uuidv4().toUpperCase()
  }

  /**
   * 生成带前缀的 UUID
   * @param prefix 前缀
   * @returns 带前缀的 UUID 字符串
   */
  static generateWithPrefix(prefix: string): string {
    return `${prefix}_${uuidv4()}`
  }

  /**
   * 生成带后缀的 UUID
   * @param suffix 后缀
   * @returns 带后缀的 UUID 字符串
   */
  static generateWithSuffix(suffix: string): string {
    return `${uuidv4()}_${suffix}`
  }

  /**
   * 生成自定义格式的 UUID
   * @param options 选项
   * @returns 自定义格式的 UUID 字符串
   */
  static generateCustom(options: {
    version?: 1 | 4 | 5
    prefix?: string
    suffix?: string
    uppercase?: boolean
    removeDashes?: boolean
    namespace?: string
    name?: string
  } = {}): string {
    const {
      version = 4,
      prefix = '',
      suffix = '',
      uppercase = false,
      removeDashes = false,
      namespace,
      name
    } = options

    let uuid: string

    switch (version) {
      case 1:
        uuid = uuidv1()
        break
      case 5:
        if (!namespace || !name) {
          throw new Error('UUID v5 requires both namespace and name')
        }
        uuid = uuidv5(name, namespace)
        break
      case 4:
      default:
        uuid = uuidv4()
        break
    }

    if (removeDashes) {
      uuid = uuid.replace(/-/g, '')
    }

    if (uppercase) {
      uuid = uuid.toUpperCase()
    }

    if (prefix) {
      uuid = `${prefix}_${uuid}`
    }

    if (suffix) {
      uuid = `${uuid}_${suffix}`
    }

    return uuid
  }

  /**
   * 验证 UUID 格式
   * @param uuid UUID 字符串
   * @returns 是否为有效的 UUID
   */
  static isValid(uuid: string): boolean {
    return validate(uuid)
  }

  /**
   * 获取 UUID 版本
   * @param uuid UUID 字符串
   * @returns UUID 版本号
   */
  static getVersion(uuid: string): number | undefined {
    if (!this.isValid(uuid)) {
      return undefined
    }
    return version(uuid)
  }

  /**
   * 格式化 UUID（添加连字符）
   * @param uuid 无连字符的 UUID 字符串
   * @returns 格式化后的 UUID 字符串
   */
  static format(uuid: string): string {
    if (uuid.length !== 32) {
      throw new Error('Invalid UUID length for formatting')
    }
    return [
      uuid.slice(0, 8),
      uuid.slice(8, 12),
      uuid.slice(12, 16),
      uuid.slice(16, 20),
      uuid.slice(20, 32)
    ].join('-')
  }

  /**
   * 移除 UUID 中的连字符
   * @param uuid UUID 字符串
   * @returns 无连字符的 UUID 字符串
   */
  static removeDashes(uuid: string): string {
    return uuid.replace(/-/g, '')
  }

  /**
   * 比较两个 UUID 是否相等
   * @param uuid1 第一个 UUID
   * @param uuid2 第二个 UUID
   * @param ignoreCase 是否忽略大小写
   * @returns 是否相等
   */
  static isEqual(uuid1: string, uuid2: string, ignoreCase: boolean = true): boolean {
    if (!this.isValid(uuid1) || !this.isValid(uuid2)) {
      return false
    }

    const normalizedUuid1 = ignoreCase ? uuid1.toLowerCase() : uuid1
    const normalizedUuid2 = ignoreCase ? uuid2.toLowerCase() : uuid2

    return normalizedUuid1 === normalizedUuid2
  }

  /**
   * 从 UUID 中提取时间戳（仅适用于 UUID v1）
   * @param uuid UUID v1 字符串
   * @returns 时间戳（毫秒）
   */
  static extractTimestamp(uuid: string): number | null {
    if (!this.isValid(uuid) || this.getVersion(uuid) !== 1) {
      return null
    }

    // UUID v1 时间戳提取逻辑
    const hex = uuid.replace(/-/g, '')
    const timeLow = parseInt(hex.slice(0, 8), 16)
    const timeMid = parseInt(hex.slice(8, 12), 16)
    const timeHigh = parseInt(hex.slice(12, 16), 16) & 0x0fff

    // UUID v1 时间戳是从 1582-10-15 00:00:00 UTC 开始的 100 纳秒间隔数
    const timestamp = (timeHigh << 32) | (timeMid << 16) | timeLow
    const epochOffset = 122192928000000000 // 1582-10-15 到 1970-01-01 的 100 纳秒间隔数
    
    return Math.floor((timestamp - epochOffset) / 10000) // 转换为毫秒
  }

  /**
   * 生成批量 UUID
   * @param count 生成数量
   * @param version UUID 版本
   * @returns UUID 数组
   */
  static generateBatch(count: number, version: 1 | 4 = 4): string[] {
    const uuids: string[] = []
    const generator = version === 1 ? uuidv1 : uuidv4

    for (let i = 0; i < count; i++) {
      uuids.push(generator())
    }

    return uuids
  }

  /**
   * 生成唯一的短 ID（基于 UUID v4 的前 8 位）
   * @returns 8 位短 ID
   */
  static generateShortId(): string {
    return uuidv4().slice(0, 8)
  }

  /**
   * 生成数字 ID（基于 UUID 的哈希）
   * @param length ID 长度
   * @returns 数字 ID 字符串
   */
  static generateNumericId(length: number = 10): string {
    const uuid = uuidv4().replace(/-/g, '')
    let numericId = ''
    
    for (let i = 0; i < length; i++) {
      const char = uuid[i % uuid.length]
      const charCode = char.charCodeAt(0)
      numericId += (charCode % 10).toString()
    }
    
    return numericId
  }

  /**
   * 生成字母数字 ID
   * @param length ID 长度
   * @returns 字母数字 ID 字符串
   */
  static generateAlphanumericId(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const uuid = uuidv4().replace(/-/g, '')
    let id = ''
    
    for (let i = 0; i < length; i++) {
      const char = uuid[i % uuid.length]
      const charCode = char.charCodeAt(0)
      id += chars[charCode % chars.length]
    }
    
    return id
  }

  /**
   * 生成基于时间的唯一 ID
   * @param prefix 前缀
   * @returns 基于时间的唯一 ID
   */
  static generateTimeBasedId(prefix: string = ''): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).slice(2, 8)
    return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`
  }

  /**
   * 生成雪花 ID（简化版）
   * @param workerId 工作节点 ID
   * @param datacenterId 数据中心 ID
   * @returns 雪花 ID
   */
  static generateSnowflakeId(workerId: number = 1, datacenterId: number = 1): string {
    const timestamp = Date.now()
    const workerIdBits = workerId.toString(2).padStart(5, '0')
    const datacenterIdBits = datacenterId.toString(2).padStart(5, '0')
    const sequenceBits = Math.floor(Math.random() * 4096).toString(2).padStart(12, '0')
    
    const snowflakeId = timestamp.toString() + workerIdBits + datacenterIdBits + sequenceBits
    return parseInt(snowflakeId.slice(0, 16), 2).toString()
  }
}

/**
 * 常用的命名空间 UUID
 */
export const UUID_NAMESPACES = {
  DNS: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  URL: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8'
} as const

/**
 * UUID 类型定义
 */
export type UUIDVersion = 1 | 4 | 5
export type UUIDNamespace = keyof typeof UUID_NAMESPACES

/**
 * 快捷函数
 */
export const uuid = UUIDUtils.generateV4
export const shortId = UUIDUtils.generateShortId
export const numericId = UUIDUtils.generateNumericId
export const alphanumericId = UUIDUtils.generateAlphanumericId
export const timeBasedId = UUIDUtils.generateTimeBasedId
export const isValidUUID = UUIDUtils.isValid
export const formatUUID = UUIDUtils.format

/**
 * 默认导出
 */
export default UUIDUtils