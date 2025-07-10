import { defineConfig } from 'windicss/helpers'
import type { Config } from 'windicss/types/interfaces'

/**
 * Windi CSS 配置文件
 * @see https://windicss.org/guide/configuration.html
 */
export default defineConfig({
  // 扫描文件路径
  extract: {
    include: [
      'index.html',
      'src/**/*.{vue,js,ts,jsx,tsx}',
      'tests/**/*.{vue,js,ts,jsx,tsx}'
    ],
    exclude: [
      'node_modules/**/*',
      '.git/**/*',
      'dist/**/*',
      'coverage/**/*'
    ]
  },

  // 预设配置
  presets: [],

  // 主题配置
  theme: {
    extend: {
      // 自定义颜色
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f'
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        }
      },

      // 自定义字体
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace'
        ]
      },

      // 自定义间距
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },

      // 自定义圆角
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem'
      },

      // 自定义阴影
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'hard': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      },

      // 自定义动画
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
        'pulse-soft': 'pulseSoft 2s infinite'
      },

      // 自定义关键帧
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceSoft: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
          '70%': { transform: 'translate3d(0, -4px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        }
      },

      // 自定义断点
      screens: {
        'xs': '475px',
        '3xl': '1600px'
      }
    }
  },

  // 插件配置
  plugins: [
    // 排版插件
    require('windicss/plugin/typography'),
    // 表单插件
    require('windicss/plugin/forms'),
    // 长宽比插件
    require('windicss/plugin/aspect-ratio'),
    // 行高插件
    require('windicss/plugin/line-clamp')
  ],

  // 快捷方式
  shortcuts: {
    // 布局相关
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-around': 'flex items-center justify-around',
    'flex-col-center': 'flex flex-col items-center justify-center',
    'absolute-center': 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    'fixed-center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',

    // 按钮样式
    'btn-base': 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    'btn-primary': 'btn-base bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    'btn-secondary': 'btn-base bg-secondary-200 text-secondary-900 hover:bg-secondary-300 focus:ring-secondary-500',
    'btn-success': 'btn-base bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
    'btn-warning': 'btn-base bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500',
    'btn-error': 'btn-base bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
    'btn-ghost': 'btn-base bg-transparent text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500',

    // 输入框样式
    'input-base': 'block w-full px-3 py-2 text-sm border border-secondary-300 rounded-md placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-secondary-50 disabled:cursor-not-allowed',
    'input-error': 'input-base border-error-300 focus:ring-error-500 focus:border-error-500',

    // 卡片样式
    'card-base': 'bg-white rounded-lg shadow-soft border border-secondary-200',
    'card-hover': 'card-base hover:shadow-medium transition-shadow duration-200',

    // 文本样式
    'text-gradient': 'bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent',
    'text-muted': 'text-secondary-600',
    'text-error': 'text-error-600',
    'text-success': 'text-success-600',
    'text-warning': 'text-warning-600',

    // 滚动条样式
    'scrollbar-thin': 'scrollbar scrollbar-thin scrollbar-thumb-secondary-300 scrollbar-track-secondary-100 hover:scrollbar-thumb-secondary-400',
    'scrollbar-none': 'scrollbar-none',

    // 过渡动画
    'transition-base': 'transition-all duration-200 ease-in-out',
    'transition-fast': 'transition-all duration-150 ease-in-out',
    'transition-slow': 'transition-all duration-300 ease-in-out'
  },

  // 安全列表（确保这些类不会被清除）
  safelist: [
    'bg-primary-500',
    'bg-secondary-500',
    'bg-success-500',
    'bg-warning-500',
    'bg-error-500',
    'text-primary-500',
    'text-secondary-500',
    'text-success-500',
    'text-warning-500',
    'text-error-500'
  ],

  // 变体配置
  variants: {
    extend: {
      backgroundColor: ['active', 'disabled'],
      textColor: ['active', 'disabled'],
      borderColor: ['active', 'disabled'],
      opacity: ['disabled']
    }
  }
} as Config)