<template>
  <t-chat-content v-if="item.status === 'error'" :content="item.error"> </t-chat-content>
  <!-- @ts-ignore -->
  <t-chat-reasoning
    v-if="item.role === 'assistant'"
    expand-icon-placement="right"
    :collapse-panel-props="{
      header: renderHeader(chatStore.isLoading, item),
      content: renderReasoningContent(item.reasoning_content),
    }"
    @expand-change="handleReasoningChange($event, { index })"
  >
  </t-chat-reasoning>
  <t-chat-content v-if="item.content.length > 0" :content="item.content"> </t-chat-content>
</template>
<script name="LangContent" setup lang="ts">
import { computed, h } from 'vue'
import { useChatStore, type ChatMessage } from '@/stores/chat';
import { ChatContent, ChatLoading } from '@tdesign-vue-next/chat';
import { CheckCircleIcon } from 'tdesign-icons-vue-next';
const _props = defineProps<{
  item: ChatMessage
  index: number
}>()
const chatStore = useChatStore()
const item = computed(() => _props.item)
const index = computed(() => _props.index)

// 动态渲染深度思考
const handleReasoningChange = (value: any, { index }: any) => {
  console.log('handleChange', value, index)
}
const renderReasoningContent = (reasoningContent: string) => {
  return h(ChatContent, { content: reasoningContent, role: 'assistant' })
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
<style lang="less" scoped></style>
