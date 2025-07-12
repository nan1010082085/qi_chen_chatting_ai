/**
 * IndexedDB 服务
 * 用于存储聊天历史数据
 */

import type { ChatSession } from '@/stores/chat'
import { toRaw } from 'vue'

/**
 * IndexedDB 数据库配置
 */
const DB_NAME = 'ChatHistoryDB'
const DB_VERSION = 1
const STORE_NAME = 'chatSessions'

/**
 * IndexedDB 服务类
 */
class IndexedDBService {
  private db: IDBDatabase | null = null

  /**
   * 初始化数据库
   * @returns Promise<IDBDatabase>
   */
  async initDB(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result

        // 创建对象存储
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })

          // 创建索引
          store.createIndex('createdAt', 'createdAt', { unique: false })
          store.createIndex('updatedAt', 'updatedAt', { unique: false })
        }
      }
    })
  }

  /**
   * 获取所有聊天会话
   * @returns Promise<ChatSession[]>
   */
  async getAllSessions(): Promise<ChatSession[]> {
    const db = await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onerror = () => {
        reject(new Error('Failed to get sessions from IndexedDB'))
      }

      request.onsuccess = () => {
        const sessions = request.result as ChatSession[]
        // 按更新时间倒序排列
        sessions.sort((a, b) => b.updatedAt - a.updatedAt)
        resolve(sessions)
      }
    })
  }

  /**
   * 保存聊天会话
   * @param session - 聊天会话
   * @returns Promise<void>
   */
  async saveSession(session: ChatSession): Promise<void> {
    const db = await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(toRaw(session))

      request.onerror = () => {
        reject(new Error('Failed to save session to IndexedDB'))
      }

      request.onsuccess = () => {
        resolve()
      }
    })
  }

  /**
   * 删除聊天会话
   * @param sessionId - 会话ID
   * @returns Promise<void>
   */
  async deleteSession(sessionId: string): Promise<void> {
    const db = await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(sessionId)

      request.onerror = () => {
        reject(new Error('Failed to delete session from IndexedDB'))
      }

      request.onsuccess = () => {
        resolve()
      }
    })
  }

  /**
   * 获取指定会话
   * @param sessionId - 会话ID
   * @returns Promise<ChatSession | null>
   */
  async getSession(sessionId: string): Promise<ChatSession | null> {
    const db = await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(sessionId)

      request.onerror = () => {
        reject(new Error('Failed to get session from IndexedDB'))
      }

      request.onsuccess = () => {
        resolve(request.result || null)
      }
    })
  }

  /**
   * 清空所有数据
   * @returns Promise<void>
   */
  async clearAll(): Promise<void> {
    const db = await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onerror = () => {
        reject(new Error('Failed to clear IndexedDB'))
      }

      request.onsuccess = () => {
        resolve()
      }
    })
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

// 导出单例实例
export const indexedDBService = new IndexedDBService()
