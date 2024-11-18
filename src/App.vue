<script setup lang="ts">
import { Edge, Node } from '@antv/x6'
import { onMounted, ref } from 'vue'
import DeviceList from './components/device-list/index.vue'
import { Vue3ColorPicker } from '@cyhnkckali/vue3-color-picker'

import '@cyhnkckali/vue3-color-picker/dist/style.css'
import NodePanel from './components/NodePanel.vue'
import { DeviceNode, Submask } from './nodes'
import { TopologyGraph } from './TopologyGraph'

let selectNode = ref<Node | null>()
let selectEdge = ref<Edge | null>()
const deviceListRef = ref<InstanceType<typeof DeviceList>>()
const topologyGraph = ref<TopologyGraph | null>()

const initGrap = () => {
  const container = document.querySelector('#container') as HTMLElement
  const miniMapContainer = document.querySelector('#miniMapContainer') as HTMLElement
  topologyGraph.value = new TopologyGraph(container,miniMapContainer)
  // graph.on('node:click', ({ e, x, y, node, view }) => {
  //   selectNode.value = node
  //   selectEdge.value = null
  //   console.log(node)
  //   if (node.shape === 'submask') {
  //     ;(node as Submask).toggleExpand()
  //   }
  // })

  // graph.on('edge:click', ({ e, x, y, edge, view }) => {
  //   console.log(edge)
  //   selectNode.value = null
  //   selectEdge.value = edge
  // })

  // graph.on('node:added', ({ node }) => {
  //   if (node.shape === 'regular-area') {
  //     node.setZIndex(1)
  //   }
  // })

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

// const shapeChangeHandle = (val: string) => {
//   const oldNode = graph.getCellById(selectNode.value.id)
//   const oldNodeId = oldNode.id
//   const newNode = graph.createNode({
//     shape: val,
//     // 保持原节点的位置
//     x: oldNode.getPosition().x,
//     y: oldNode.getPosition().y,
//     // 其他配置
//     label: '新节点'
//   })
//   const connectedEdges = graph.getConnectedEdges(oldNode).map(edge => ({
//     source: edge.getSourceCell().id,
//     target: edge.getTargetCell().id,
//     // 可以根据需要保存边的其他属性
//     attrs: edge.getAttrs(),
//     zIndex: edge.getZIndex()
//     // ... 其他需要保存的边的属性
//   }))
//   graph.removeNode(oldNodeId)
//   selectNode.value = graph.addNode(newNode)
//   connectedEdges.forEach(edgeData => {
//     graph.addEdge({
//       source: edgeData.source === oldNodeId ? newNode.id : edgeData.source,
//       target: edgeData.target === oldNodeId ? newNode.id : edgeData.target,
//       attrs: edgeData.attrs,
//       zIndex: edgeData.zIndex
//       // ... 其他边的属性
//     })
//   })
// }
</script>

<template>
  <div id="app" class="flex">
    <DeviceList ref="deviceListRef" />
    <div id="container" class="flex-1"></div>
    <div id="attrRef" class="basis-[240px]">
      <template v-if="topologyGraph && topologyGraph.selectedNode">
        <NodePanel :node="topologyGraph.selectedNode" />
      </template>
      <template v-if="selectEdge">
        <div>
          <a-input
            :value="selectEdge.label"
            @input="e => selectEdge.setLabels(e.target.value)"
          ></a-input>
        </div>
        <div>
          <Vue3ColorPicker
            :model-value="selectEdge.attrs.line.stroke"
            mode="solid"
            :showColorList="false"
            :showEyeDrop="false"
            type="RGBA"
            @update:model-value="val => selectEdge.attr('line/stroke', val)"
          />
        </div>
      </template>
    </div>
    <div id="miniMapContainer" class="absolute top-0 right-[260px] bg-white border border-base"></div>
  </div>
</template>

<style scoped></style>
