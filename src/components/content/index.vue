<template>
  <div class="message-content-wrapper">
    <TChatContent v-if="item.status === 'error'" :content="item.error"> </TChatContent>
    <!-- @ts-ignore -->
    <TChatReasoning
      v-if="item.role === 'assistant'"
      expand-icon-placement="right"
      :collapse-panel-props="{
        header: renderHeader(chatStore.isLoading, item),
        content: renderReasoningContent(item.reasoning_content),
      }"
      @expand-change="handleReasoningChange($event, { index })"
    >
    </TChatReasoning>
    <TChatContent v-if="item.content.length > 0" :content="item.content"> </TChatContent>
  </div>
</template>
<script name="LangContent" setup lang="ts">
import { computed, h } from 'vue'
import { useChatStore, type ChatMessage } from '@/stores/chat'
import { ChatContent as TChatContent, ChatReasoning as TChatReasoning, ChatLoading } from '@tdesign-vue-next/chat'
import { CheckCircleIcon } from 'tdesign-icons-vue-next'

/**
 * 组件属性
 */
interface Props {
  item: ChatMessage
  index: number
}

/**
 * 组件事件
 */
// interface Emits {
//   (e: 'message-click', message: ChatMessage, index: number): void
// }

const _props = defineProps<Props>()
// const emit = defineEmits<Emits>()
const chatStore = useChatStore()
const item = computed(() => _props.item)
const index = computed(() => _props.index)

/**
 * 动态渲染深度思考
 * @param value - 展开状态值
 * @param index - 消息索引
 */
const handleReasoningChange = (value: any, { index }: any) => {
  console.log('handleChange', value, index)
}
const renderReasoningContent = (reasoningContent: string) => {
  return h(TChatContent, { content: reasoningContent, role: 'assistant' })
}
const renderHeader = (flag: boolean, item: any) => {
  if (flag) {
    return h(ChatLoading, { animation: 'moving', text: '思考中...' })
  }
  const endText = item.duration ? `已深度思考(用时${item.duration}秒)` : '已深度思考'
  return h('div', { style: 'display:flex;align-items:center' }, [
    h(CheckCircleIcon, {
      style: {
        color: 'var(--td-success-color-5)',
        fontSize: '20px',
        marginRight: '8px',
      },
    }),
    h('span', {}, endText),
  ])
}
</script>

<style lang="less" scoped>
.message-content-wrapper {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  padding: 4px;
  margin: -4px;
  background-color: var(--td-bg-color-container);

  &:hover {
    background-color: var(--td-bg-color-container-hover);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }

  ::v-deep(.t-chat__detail-reasoning) {
    padding-top: 0;
    .t-collapse-panel {
      margin-left: 0;
    }
  }
}
</style>
