import { Graph } from '@antv/x6'
import { ref } from 'vue'

export const useNodeRemoveTool = (graph: Graph) => {
  const excludeNodeIds = ref<string[]>([])
  graph.on('node:mouseenter', ({ node }) => {
    if (excludeNodeIds.value.includes(node.id)) {
      return
    }
    node.addTools({
      name: 'button-remove',
      args: {
        x: '100%',
        y: 0,
        offset: { x: -10, y: 10 }
      }
    })
  })
  graph.on('node:mouseleave', ({ node }) => {
    if (excludeNodeIds.value.includes(node.id)) {
      return
    }
    node.removeTools()
  })
  return {
    excludeNodeIds
  }
}

export const useEdgeRemoveTool = (graph: Graph) => {
  const excludeNodeIds = ref<string[]>([])
  graph.on('edge:mouseenter', ({ cell }) => {
    if (excludeNodeIds.value.includes(cell.id)) {
      return
    }
    cell.addTools([
      {
        name: 'button-remove',
        args: { distance: -40 }
      }
    ])
  })
  graph.on('edge:mouseleave', ({ cell }) => {
    if (excludeNodeIds.value.includes(cell.id)) {
      return
    }
    cell.removeTools()
  })

  return {
    excludeNodeIds
  }
}
