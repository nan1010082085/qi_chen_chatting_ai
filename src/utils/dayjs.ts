import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/zh-cn'

// 扩展 dayjs 插件
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(isTomorrow)
dayjs.extend(weekOfYear)
dayjs.extend(quarterOfYear)
dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)

// 设置默认语言为中文
dayjs.locale('zh-cn')

/**
 * 时间格式常量
 */
export const TIME_FORMATS = {
  // 日期格式
  DATE: 'YYYY-MM-DD',
  DATE_CN: 'YYYY年MM月DD日',
  DATE_SHORT: 'MM-DD',
  DATE_MONTH: 'YYYY-MM',
  
  // 时间格式
  TIME: 'HH:mm:ss',
  TIME_SHORT: 'HH:mm',
  TIME_12: 'hh:mm A',
  
  // 日期时间格式
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATETIME_SHORT: 'YYYY-MM-DD HH:mm',
  DATETIME_CN: 'YYYY年MM月DD日 HH:mm:ss',
  DATETIME_FRIENDLY: 'MM月DD日 HH:mm',
  
  // ISO格式
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  
  // 文件名安全格式
  FILENAME: 'YYYY-MM-DD_HH-mm-ss'
} as const

/**
 * 时间工具类
 */
export class DateTimeUtils {
  /**
   * 格式化时间
   * @param date - 时间
   * @param format - 格式
   * @returns 格式化后的时间字符串
   */
  static format(date?: dayjs.ConfigType, format: string = TIME_FORMATS.DATETIME): string {
    return dayjs(date).format(format)
  }

  /**
   * 获取相对时间
   * @param date - 时间
   * @param baseDate - 基准时间
   * @returns 相对时间字符串
   */
  static fromNow(date: dayjs.ConfigType, baseDate?: dayjs.ConfigType): string {
    const target = dayjs(date)
    return baseDate ? target.from(dayjs(baseDate)) : target.fromNow()
  }

  /**
   * 获取友好的时间显示
   * @param date - 时间
   * @returns 友好的时间字符串
   */
  static friendly(date: dayjs.ConfigType): string {
    const target = dayjs(date)
    const now = dayjs()
    
    // 今天
    if (target.isToday()) {
      return target.format('HH:mm')
    }
    
    // 昨天
    if (target.isYesterday()) {
      return `昨天 ${target.format('HH:mm')}`
    }
    
    // 明天
    if (target.isTomorrow()) {
      return `明天 ${target.format('HH:mm')}`
    }
    
    // 本年内
    if (target.year() === now.year()) {
      return target.format('MM月DD日 HH:mm')
    }
    
    // 其他年份
    return target.format('YYYY年MM月DD日 HH:mm')
  }

  /**
   * 获取时间戳
   * @param date - 时间
   * @returns 时间戳（毫秒）
   */
  static timestamp(date?: dayjs.ConfigType): number {
    return dayjs(date).valueOf()
  }

  /**
   * 获取Unix时间戳
   * @param date - 时间
   * @returns Unix时间戳（秒）
   */
  static unix(date?: dayjs.ConfigType): number {
    return dayjs(date).unix()
  }

  /**
   * 判断是否为有效时间
   * @param date - 时间
   * @returns 是否有效
   */
  static isValid(date: dayjs.ConfigType): boolean {
    return dayjs(date).isValid()
  }

  /**
   * 判断是否为今天
   * @param date - 时间
   * @returns 是否为今天
   */
  static isToday(date: dayjs.ConfigType): boolean {
    return dayjs(date).isToday()
  }

  /**
   * 判断是否为昨天
   * @param date - 时间
   * @returns 是否为昨天
   */
  static isYesterday(date: dayjs.ConfigType): boolean {
    return dayjs(date).isYesterday()
  }

  /**
   * 判断是否为明天
   * @param date - 时间
   * @returns 是否为明天
   */
  static isTomorrow(date: dayjs.ConfigType): boolean {
    return dayjs(date).isTomorrow()
  }

  /**
   * 获取时间差
   * @param date1 - 时间1
   * @param date2 - 时间2
   * @param unit - 单位
   * @returns 时间差
   */
  static diff(
    date1: dayjs.ConfigType,
    date2: dayjs.ConfigType,
    unit: dayjs.UnitType = 'millisecond'
  ): number {
    return dayjs(date1).diff(dayjs(date2), unit)
  }

  /**
   * 添加时间
   * @param date - 基准时间
   * @param value - 添加的值
   * @param unit - 单位
   * @returns 新的时间
   */
  static add(
    date: dayjs.ConfigType,
    value: number,
    unit: dayjs.ManipulateType
  ): dayjs.Dayjs {
    return dayjs(date).add(value, unit)
  }

  /**
   * 减去时间
   * @param date - 基准时间
   * @param value - 减去的值
   * @param unit - 单位
   * @returns 新的时间
   */
  static subtract(
    date: dayjs.ConfigType,
    value: number,
    unit: dayjs.ManipulateType
  ): dayjs.Dayjs {
    return dayjs(date).subtract(value, unit)
  }

  /**
   * 获取时间的开始
   * @param date - 时间
   * @param unit - 单位
   * @returns 时间的开始
   */
  static startOf(date: dayjs.ConfigType, unit: dayjs.OpUnitType): dayjs.Dayjs {
    return dayjs(date).startOf(unit)
  }

  /**
   * 获取时间的结束
   * @param date - 时间
   * @param unit - 单位
   * @returns 时间的结束
   */
  static endOf(date: dayjs.ConfigType, unit: dayjs.OpUnitType): dayjs.Dayjs {
    return dayjs(date).endOf(unit)
  }

  /**
   * 获取时区时间
   * @param date - 时间
   * @param timezone - 时区
   * @returns 时区时间
   */
  static timezone(date: dayjs.ConfigType, timezone: string): dayjs.Dayjs {
    return dayjs(date).tz(timezone)
  }

  /**
   * 获取UTC时间
   * @param date - 时间
   * @returns UTC时间
   */
  static utc(date?: dayjs.ConfigType): dayjs.Dayjs {
    return dayjs(date).utc()
  }

  /**
   * 解析时间字符串
   * @param dateString - 时间字符串
   * @param format - 格式
   * @returns 解析后的时间
   */
  static parse(dateString: string, format?: string): dayjs.Dayjs {
    return format ? dayjs(dateString, format) : dayjs(dateString)
  }

  /**
   * 获取持续时间
   * @param milliseconds - 毫秒数
   * @returns 持续时间对象
   */
  static duration(milliseconds: number): any {
    return dayjs.duration(milliseconds)
  }

  /**
   * 格式化持续时间
   * @param milliseconds - 毫秒数
   * @param format - 格式
   * @returns 格式化后的持续时间
   */
  static formatDuration(milliseconds: number, format: string = 'HH:mm:ss'): string {
    const duration = dayjs.duration(milliseconds)
    
    if (format === 'human') {
      const days = duration.days()
      const hours = duration.hours()
      const minutes = duration.minutes()
      const seconds = duration.seconds()
      
      const parts: string[] = []
      if (days > 0) parts.push(`${days}天`)
      if (hours > 0) parts.push(`${hours}小时`)
      if (minutes > 0) parts.push(`${minutes}分钟`)
      if (seconds > 0 || parts.length === 0) parts.push(`${seconds}秒`)
      
      return parts.join('')
    }
    
    return duration.format(format)
  }

  /**
   * 获取年龄
   * @param birthDate - 出生日期
   * @param referenceDate - 参考日期（默认为当前时间）
   * @returns 年龄
   */
  static getAge(birthDate: dayjs.ConfigType, referenceDate?: dayjs.ConfigType): number {
    const birth = dayjs(birthDate)
    const reference = dayjs(referenceDate)
    return reference.diff(birth, 'year')
  }

  /**
   * 获取星期几
   * @param date - 时间
   * @param format - 格式（'short' | 'long' | 'min'）
   * @returns 星期几
   */
  static getWeekday(date: dayjs.ConfigType, format: 'short' | 'long' | 'min' = 'short'): string {
    const target = dayjs(date)
    const day = target.day()
    
    const weekdays = {
      min: ['日', '一', '二', '三', '四', '五', '六'],
      short: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      long: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    }
    
    return weekdays[format][day]
  }

  /**
   * 获取季度
   * @param date - 时间
   * @returns 季度
   */
  static getQuarter(date: dayjs.ConfigType): number {
    return dayjs(date).quarter()
  }

  /**
   * 获取周数
   * @param date - 时间
   * @returns 周数
   */
  static getWeek(date: dayjs.ConfigType): number {
    return dayjs(date).week()
  }

  /**
   * 判断是否为工作日
   * @param date - 时间
   * @returns 是否为工作日
   */
  static isWorkday(date: dayjs.ConfigType): boolean {
    const day = dayjs(date).day()
    return day >= 1 && day <= 5
  }

  /**
   * 判断是否为周末
   * @param date - 时间
   * @returns 是否为周末
   */
  static isWeekend(date: dayjs.ConfigType): boolean {
    const day = dayjs(date).day()
    return day === 0 || day === 6
  }

  /**
   * 获取月份的天数
   * @param date - 时间
   * @returns 月份的天数
   */
  static daysInMonth(date: dayjs.ConfigType): number {
    return dayjs(date).daysInMonth()
  }

  /**
   * 判断是否为闰年
   * @param date - 时间
   * @returns 是否为闰年
   */
  static isLeapYear(date: dayjs.ConfigType): boolean {
    const year = dayjs(date).year()
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }
}

// 导出 dayjs 实例
export default dayjs
export { dayjs }

// 常用的快捷方法
export const now = () => dayjs()
export const today = () => dayjs().startOf('day')
export const tomorrow = () => dayjs().add(1, 'day').startOf('day')
export const yesterday = () => dayjs().subtract(1, 'day').startOf('day')
export const thisWeek = () => dayjs().startOf('week')
export const thisMonth = () => dayjs().startOf('month')
export const thisYear = () => dayjs().startOf('year')
