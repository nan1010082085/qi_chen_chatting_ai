/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// micro-app 相关类型声明
declare global {
  interface Window {
    microApp?: {
      getData(): any
      dispatch(data: any): void
      addDataListener(callback: (data: any) => void): void
      removeDataListener(callback: (data: any) => void): void
      addGlobalDataListener(callback: (data: any) => void): void
      removeGlobalDataListener(callback: (data: any) => void): void
    }
    __MICRO_APP_NAME__?: string
    __MICRO_APP_ENVIRONMENT__?: string
    __MICRO_APP_BASE_ROUTE__?: string
  }
}

// 环境变量类型声明
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_OPENAI_API_KEY?: string
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}
