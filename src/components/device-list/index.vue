<template>
  <div id="dndContainer" class="dnd-wrap basis-[240px]">
    <template v-for="(svg, path) in obj">
      <div
        :data-type="path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))"
        @mousedown="startDrag"
      >
        <img :src="svg.default" width="80px" height="80px" alt="" />
      </div>
    </template>
    <div data-type="submask" class="mt-2" @mousedown="startDrag">
      <div class="w-[120px] h-[60px] border border-black"></div>
    </div>
    <div data-type="regular-area" class="mt-2" @mousedown="startDrag">
      <div class="w-[120px] h-[60px] border border-black"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DeviceNode, RegularArea, Submask } from '@/nodes'
import { Graph } from '@antv/x6'
import { Dnd } from '@antv/x6-plugin-dnd'
import { ref } from 'vue'

const obj = import.meta.glob('@/assets/devices/*.svg', {
  eager: true
})

const images = ref<Map<string, any>>(new Map())

for (const key in obj) {
  images.value.set(key, obj[key].default)
}
console.log(images)

const dnd = ref<Dnd>()
const graph = ref<Graph>()
const initDnd = (_graph: Graph) => {
  const dndContainer = document.querySelector('#dndContainer') as HTMLElement
  graph.value = _graph
  dnd.value = new Dnd({
    target: _graph,
    scaled: false,
    dndContainer: dndContainer
  })
}
const startDrag = (e: MouseEvent) => {
  if (!graph.value) {
    return
  }
  const target = e.currentTarget as HTMLElement
  const type = target.getAttribute('data-type')
  let node = null
  if (type === 'submask') {
    node = graph.value?.createNode(new Submask())
  } else if (type === 'regular-area') {
    node = graph.value?.createNode(new RegularArea())
  } else {
    node = graph.value?.createNode(
      new DeviceNode({
        deviceType: type
      })
    )
  }
  dnd.value?.start(node, e)
}
defineExpose({
  initDnd
})
</script>

<style scoped></style>
