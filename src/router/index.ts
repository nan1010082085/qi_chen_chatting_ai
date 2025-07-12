import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import ChatView from '@/views/ChatView.vue'
import UtilsDemo from '../examples/utils-demo.vue'

/**
 * 路由配置
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Chat',
    component: ChatView,
    meta: {
      title: import.meta.env.VITE_APP_TITLE
    }
  },
  {
    path: '/chat',
    redirect: '/'
  },
  {
    path: '/demo',
    name: 'Demo',
    component: UtilsDemo,
    meta: {
      title: 'Less & UUID 演示'
    }
  }
]

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(
    // 在micro-app环境下使用相对路径
    (window as any).__MICRO_APP_ENVIRONMENT__ ? (window as any).__MICRO_APP_BASE_ROUTE__ || '/' : '/'
  ),
  routes
})

/**
 * 路由守卫
 */
router.beforeEach((to, _from, next) => {
  // 开始进度条
  NProgress.start()
  
  // 设置页面标题
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
  next()
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})

router.onError(() => {
  // 错误时也要完成进度条
  NProgress.done()
})

export default router
