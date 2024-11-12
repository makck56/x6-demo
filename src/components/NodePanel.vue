<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="prop" tab="节点属性">
      <a-form class="pl-4">
        <a-form-item label="文本">
          <a-input
            :value="node.attrs.label.text"
            @input="e => node.attr('label/text', e.target.value)"
          ></a-input>
        </a-form-item>
        <a-form-item label="类型">
          <a-select
            :value="node.shape"
            :style="{ width: '100%' }"
            :options="[
              { label: '服务器', value: 'server' },
              { label: '路由器', value: 'router' }
            ]"
            @change="(val: string) => emits('shapeChange', val)"
          />
        </a-form-item>
      </a-form>
    </a-tab-pane>
    <a-tab-pane key="data" tab="数据">
      <a-form class="pl-4">
        <a-form-item label="IP">
          <a-input />
        </a-form-item>
        <a-form-item label="MAC">
          <a-input />
        </a-form-item>
        <a-form-item label="归属">
          <a-input />
        </a-form-item>
        <a-form-item label="负责人">
          <a-input />
        </a-form-item>
        <a-form-item label="操作系统">
          <a-input />
        </a-form-item>
      </a-form>
    </a-tab-pane>
  </a-tabs>
</template>
<script lang="ts" setup>
import { EventBus } from '@/utils/EventBus'
import { Node } from '@antv/x6'
import { ref } from 'vue'
const activeKey = ref('prop')
const prop = defineProps<{ node: Node }>()
const emits = defineEmits<{
  (e: 'shapeChange', val: string): void
}>()
const eventBus = EventBus.getInstance()

eventBus.publish('node:')
</script>
<style scoped></style>
