import { Graph } from '@antv/x6'
import { EventBus } from './utils/EventBus'
import { DeviceNode } from './nodes'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { ref } from 'vue'

export class TopologyGraph {
  graph: Graph
  private eventBus: EventBus
  selectedNode = ref<DeviceNode | null>(null)
  constructor(container: HTMLElement) {
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
          const data = node.getData<{ submask: boolean; regular: boolean }>() || {}
          const currentNodeType = data.submask ? 'submask' : data.regular ? 'regular' : 'node'

          return this.getNodes().filter(node => {
            const data = node.getData<{ submask: boolean; regular: boolean }>()
            if (!data) {
              return
            }
            if (data.regular || !(currentNodeType === 'submask' && data.submask)) {
              const targetBBox = node.getBBox()
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
          minWidth: 1,
          maxWidth: 400,
          minHeight: 1,
          maxHeight: 400,
          restrict: false,
          preserveAspectRatio: false
        }
      }),
      new Selection({
        enabled: false,
        multiple: false
      })
    )
    this.initializeEvents()
  }

  private initializeEvents() {
    // 监听节点选中事件
    this.graph.on('node:click', ({ node }) => {
      // 更新选中节点
      // debugger
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
