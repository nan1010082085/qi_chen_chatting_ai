<template>
  <t-chat-sender
    ref="chatSenderRef"
    v-model="inputValue"
    class="chat-sender"
    :textarea-props="{
      placeholder: '请输入消息...',
    }"
    :loading="loading"
    @send="inputEnter"
  >
    <template #suffix>
      <!-- 监听键盘回车发送事件需要在sender组件监听 -->
      <t-button theme="default" variant="text" size="large" class="btn" @click="inputEnter"> 发送 </t-button>
    </template>
    <template #prefix>
      <div class="model-select">
        <t-tooltip v-model:visible="allowToolTip" content="切换模型" trigger="hover">
          <t-select
            v-model="selectValue"
            :options="selectOptions"
            value-type="object"
            @focus="allowToolTip = false"
            @change="onSelectChange"
          ></t-select>
        </t-tooltip>
        <t-button class="check-box ml-10px" :class="{ 'is-active': isChecked }" variant="text" @click="checkClick">
          <SystemSumIcon />
          <span>深度思考</span>
        </t-button>
      </div>
    </template>
  </t-chat-sender>
</template>
<script name="LangSender" setup lang="ts">
import { ref } from 'vue'
import { ChatSender as TChatSender } from '@tdesign-vue-next/chat'
import { SystemSumIcon } from 'tdesign-icons-vue-next'
const _emits = defineEmits(['select', 'send'])
const loading = ref(false)
const allowToolTip = ref(false)
const chatSenderRef = ref(null)
const inputValue = ref('')
const selectOptions = [
  {
    label: 'Deepseek-R1',
    value: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B',
  },
  {
    label: '智谱Ai',
    value: 'THUDM/GLM-4.1V-9B-Thinking',
  },
  {
    label: '通义千问',
    value: 'Qwen/Qwen3-8B',
  },
]
const selectValue = ref({
  label: 'Deepseek-R1',
  value: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B',
})
const isChecked = ref(true)
const checkClick = () => {
  isChecked.value = !isChecked.value
}
const onSelectChange = (val: object) => {
  _emits('select', val)
}
// 模拟消息发送
const inputEnter = function () {
  if (loading.value) {
    return
  }
  if (!inputValue.value) return
  _emits('send', {
    content: inputValue.value,
    isChecked: isChecked.value,
    model: selectValue.value.value,
  })

  inputValue.value = ''
  // inputValue.value = '';
  // loading.value = true;
  // setTimeout(() => {
  //   loading.value = false;
  // }, 5000);
}
</script>
<style lang="less" scoped>
.chat-sender {
  padding: 0.625rem 1.25rem;
  .btn {
    color: var(--td-text-color-disabled);
    border: none;
    &:hover {
      color: var(--td-brand-color-hover);
      border: none;
      background: none;
    }
  }
  .btn.t-button {
    height: var(--td-comp-size-m);
    padding: 0;
  }
  .model-select {
    display: flex;
    align-items: center;
    .t-select {
      width: 112px;
      height: var(--td-comp-size-m);
      margin-right: var(--td-comp-margin-s);
      .t-input {
        border-radius: 32px;
        padding: 0 15px;
      }
      .t-input.t-is-focused {
        box-shadow: none;
      }
    }
    .check-box {
      width: 112px;
      height: var(--td-comp-size-m);
      border-radius: 32px;
      border: 0;
      background: var(--td-bg-color-component);
      color: var(--td-text-color-primary);
      box-sizing: border-box;
      flex: 0 0 auto;
      ::v-deep(.t-button__text) {
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          margin-left: var(--td-comp-margin-xs);
        }
      }
    }
    .check-box.is-active {
      border: 1px solid var(--td-brand-color-focus);
      background: var(--td-brand-color-light);
      color: var(--td-text-color-brand);
    }
  }
}
</style>
