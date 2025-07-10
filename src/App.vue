<template>
  <div id="app" class="app-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()

  /**
   * 处理来自micro-app的数据
   * @param data - 外部传入的数据
   */
  const handleMicroAppData = (data: any) => {
    if (data.userInfo) {
      userStore.setUserInfo(data.userInfo)
    }
    if (data.config) {
      // 处理配置信息
      console.log('Config received:', data.config)
    }
  }

  onMounted(() => {
    // 如果在micro-app环境中，监听数据变化
    if (window.microApp) {
      window.microApp.addDataListener(handleMicroAppData)
      
      // 获取初始数据
      const initialData = window.microApp.getData()
      if (initialData) {
        handleMicroAppData(initialData)
      }
    }
  })

  onUnmounted(() => {
    // 清理监听器
    if (window.microApp) {
      window.microApp.removeDataListener(handleMicroAppData)
    }
  })
</script>

<style scoped>
  .app-container {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
</style>