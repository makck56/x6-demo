import { Graph } from '@antv/x6'
import { EventBus } from './utils/EventBus'
import { DeviceNode } from './nodes'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { MiniMap } from '@antv/x6-plugin-minimap'

import { ref } from 'vue'
import { BaseNode } from './nodes/BaseNode'

export class TopologyGraph {
  graph: Graph
  private eventBus: EventBus
  selectedNode = ref<DeviceNode | null>(null)

  constructor(container: HTMLElement, miniMapContainer: HTMLElement) {
    this.eventBus = EventBus.getInstance()
    this.graph = new Graph({
      container: container,
      background: {
        color: '#F2F7FA'
      },
      connecting: {
        router: 'manhattan',
        connector: {
          name: 'rounded',
          args: {
            radius: 8
          }
        },
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        snap: {
          radius: 20
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#12B100',
                strokeWidth: 2
              }
            },
            zIndex: 0
          })
        },
        validateConnection({ targetMagnet }) {
          return !!targetMagnet
        }
      },
      panning: {
        enabled: true
      },
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox()
          node.toFront()
          node.children?.forEach(child => {
            child.toFront()
          })

          return this.getNodes().filter(parent => {
            const parentNode = parent as BaseNode
            if (parentNode.canEmbedding && parentNode.canEmbedding(node as BaseNode)) {
              const targetBBox = parent.getBBox()
              console.log(bbox.isIntersectWithRect(targetBBox))
              return bbox.isIntersectWithRect(targetBBox)
            }
            return false
          })
        }
      },
      mousewheel: {
        enabled: true,
        global: true,
        modifiers: ['ctrl', 'meta'],
        zoomAtMousePosition: true
      }
    })
    this.graph.use(
      new Transform({
        resizing: {
          enabled(node) {
            const data = node.getData<{ parent: boolean }>()
            if (data) {
              return true
            }
            return false
          },
          minWidth: 300,
          maxWidth: 900,
          minHeight: 300,
          maxHeight: 900,
          restrict: false,
          preserveAspectRatio: false
        }
      }),
      new Selection({
        enabled: false,
        multiple: false
      })
    )
    this.graph.use(
      new MiniMap({
        container: miniMapContainer,
        width: 200,
        height: 160,
        padding: 10
      })
    )
    this.initializeEvents()
  }

  private initializeEvents() {
    // 监听节点选中事件
    this.graph.on('node:click', ({ node }) => {
      // 更新选中节点
      const oldNode = this.selectedNode
      if (oldNode) {
        oldNode.value?.setSelected(false)
      }

      console.log(`选中节点:`, node)
      this.selectedNode.value = node as DeviceNode
      this.selectedNode.value.setSelected(true)

      // 发布节点状态
      const state = this.selectedNode.value.getState()
      this.eventBus.publish('node:stateChange', state)
    })

    // 监听画布点击事件，取消选中
    this.graph.on('blank:click', () => {
      if (this.selectedNode.value) {
        this.selectedNode.value.setSelected(false)
        this.selectedNode.value = null
        this.eventBus.publish('node:unselected')
      }
    })

    // 关键点：在 Graph 层面监听工具栏事件
    this.eventBus.subscribe('toolbar:action', (action: string) => {
      if (this.selectedNode) {
        this.selectedNode.value?.handleToolbarAction(action)
      }
    })
  }
}
