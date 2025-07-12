import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'
import cssnano from 'cssnano'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
    AutoImport({
      resolvers: [TDesignResolver({ library: 'vue-next' })],
    }),
    Components({
      resolvers: [TDesignResolver({ library: 'vue-next' })],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  css: {
    devSourcemap: false, // 开发环境关闭 sourcemap
    postcss: {
      plugins: [
        cssnano({
          preset: 'cssnano-preset-advanced',
        }),
      ],
    },
    preprocessorOptions: {
      less: {
        // Less 配置选项
        javascriptEnabled: true,
        modifyVars: {
          // 可以在这里定义全局变量
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        // 移除 console.log
        drop_console: true,
        // 移除 debugger
        drop_debugger: true,
        // 移除无用代码
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      },
    },
    rollupOptions: {
      output: {
        // 为micro-app优化的输出配置
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: assetInfo => {
          const info = assetInfo.name?.split('.') || []
          let extType = info[info.length - 1]
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name || '')) {
            extType = 'media'
          } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/i.test(assetInfo.name || '')) {
            extType = 'img'
          } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name || '')) {
            extType = 'fonts'
          }
          return `${extType}/[name].[hash].[ext]`
        },
        // 手动分包配置，解决大文件警告
        manualChunks: {
          // Vue 相关
          vue: ['vue', 'vue-router', 'pinia'],
          // UI 组件库
          tdesign: ['tdesign-vue-next', 'tdesign-icons-vue-next', '@tdesign-vue-next/chat'],
          // 工具库
          utils: ['lodash-es', 'dayjs', 'uuid', 'axios', 'clipboard', 'nprogress'],
          // 样式和CSS
          styles: ['normalize.css', 'windicss'],
        },
      },
    },
    // 设置chunk大小警告限制
    chunkSizeWarningLimit: 1000,
  },
  define: {
    __VUE_PROD_DEVTOOLS__: false,
  },
})
