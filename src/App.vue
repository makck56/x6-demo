<script setup lang="ts">
import { Edge, Node } from '@antv/x6'
import { onMounted, ref } from 'vue'
import DeviceList from './components/device-list/index.vue'
import { Vue3ColorPicker } from '@cyhnkckali/vue3-color-picker'

import '@cyhnkckali/vue3-color-picker/dist/style.css'
import NodePanel from './components/NodePanel.vue'
import { DeviceNode, Submask } from './nodes'
import { TopologyGraph } from './TopologyGraph'
import ToolsBar from './components/tools-bar/index.vue'

let selectNode = ref<Node | null>()
let selectEdge = ref<Edge | null>()
const deviceListRef = ref<InstanceType<typeof DeviceList>>()
const topologyGraph = ref<TopologyGraph | null>()

const initGrap = () => {
  const container = document.querySelector('#container') as HTMLElement
  topologyGraph.value = new TopologyGraph(container)
  const parent = topologyGraph.value.graph.addNode(
    new Submask({
      x: 50,
      y: 50
    })
  )
  parent.addChild(
    topologyGraph.value.graph.addNode(
      new DeviceNode({
        deviceType: 'router',
        x: 100,
        y: 100
      })
    )
  )

  deviceListRef.value?.initDnd(topologyGraph.value.graph)
}

onMounted(() => {
  initGrap()
})
</script>

<template>
  <div id="app" class="flex">
    <DeviceList ref="deviceListRef" />
    <div id="container" class="flex-1"></div>
    <ToolsBar :cell="topologyGraph?.selectedNode"></ToolsBar>
  </div>
</template>

<style scoped></style>
