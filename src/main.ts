import { createApp } from 'vue'
import { createPinia } from 'pinia'
import TDesign from 'tdesign-vue-next'
import TDesignChat from '@tdesign-vue-next/chat'
import NProgress from 'nprogress'
import router from './router'
import App from './App.vue'
import 'normalize.css'
import 'nprogress/nprogress.css'
import 'tdesign-vue-next/es/style/index.css'
import './styles/index.less'
import 'virtual:windi.css'

// 配置 NProgress
NProgress.configure({
  showSpinner: true,
  speed: 200,
  minimum: 0.1,
})

/**
 * 创建Vue应用实例
 * @returns Vue应用实例
 */
function createVueApp() {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)
  app.use(TDesign).use(TDesignChat)

  return app
}

/**
 * 挂载应用
 * @param container - 挂载容器
 */
function mount(container?: string | Element) {
  const app = createVueApp()
  const mountElement = container || '#app'
  app.mount(mountElement)
  return app
}

/**
 * 卸载应用
 */
function unmount() {
  // 在micro-app环境下的清理逻辑
  if (window.__MICRO_APP_ENVIRONMENT__) {
    console.log('AI Chat App unmounted from micro-app')
  }
}

// 判断是否在micro-app环境中
if (window.__MICRO_APP_ENVIRONMENT__) {
  // micro-app环境下的生命周期
  ;(window as any)[`micro-app-${window.__MICRO_APP_NAME__}`] = {
    mount,
    unmount,
  }

  // 监听来自主应用的数据
  if (window.microApp) {
    window.microApp.addDataListener((data: any) => {
      console.log('Received data from main app:', data)
      // 处理外部传入的用户信息
      if (data.userInfo) {
        // 可以通过Pinia store来管理用户信息
        console.log('User info received:', data.userInfo)
      }
    })
  }
} else {
  // 独立运行模式
  mount()
}

export { mount, unmount }
