import { Node } from '@antv/x6'
import { EventBus } from '@/utils/EventBus'

const obj = import.meta.glob('@/assets/devices/*.svg', {
  eager: true
})
const imageMap = Object.fromEntries(
  Object.entries(obj).map(([key, value]) => [
    key.substring(key.lastIndexOf('/') + 1, key.lastIndexOf('.')),
    value
  ])
) as Record<string, any>

const images = <string[]>[]

for (const key in obj) {
  images.push(obj[key])
}
interface NodeState {
  id: string
  canDelete: boolean
  canEdit: boolean
}
const portCommonAttrs = {
  circle: {
    r: 4,
    stroke: '#31d0c6',
    fill: '#fff',
    magnet: 'true'
  }
}
interface DeviceNodeMeta extends Node.Metadata {
  deviceType: string
}
export class DeviceNode extends Node {
  protected eventBus: EventBus
  protected isSelected = false
  protected canEdit = false
  protected canDelete = false
  deviceType = ''
  constructor(options: DeviceNodeMeta) {
    const meta = options || {}
    super({
      width: 80,
      height: 90,
      zIndex: 3,
      attrs: {
        image: {
          'xlink:href': imageMap[meta.deviceType || 'route'].default,
          width: 64,
          height: 64,
          x: 12,
          y: 12
        },
        label: {
          text: 'Node',
          refX: 20,
          refY: 70,
          fill: 'rgba(0,0,0,0.85)',
          fontSize: 12,
          'text-anchor': 'start'
        }
      },
      label: 'text',
      propHooks(metadata) {
        if (metadata.label) {
          if (!metadata.attrs) {
            metadata.attrs = {}
          }
          metadata.attrs.label = {
            ...metadata.attrs.label,
            text: metadata.label
          }
        }
        return metadata
      },
      markup: [
        {
          tagName: 'image',
          selector: 'image'
        },
        {
          tagName: 'text',
          selector: 'label'
        }
      ],
      ports: {
        items: [
          { group: 'left', id: 'in1' },
          { group: 'top', id: 'in2' },
          { group: 'right', id: 'out1' },
          { group: 'bottom', id: 'out2' }
        ],
        groups: {
          left: {
            position: { name: 'left' },
            attrs: portCommonAttrs,
            zIndex: 1
          },
          top: {
            position: { name: 'top' },
            attrs: portCommonAttrs,
            zIndex: 2
          },
          right: {
            position: { name: 'right' },
            attrs: portCommonAttrs,
            zIndex: 3
          },
          bottom: {
            position: { name: 'bottom' },
            attrs: portCommonAttrs,
            zIndex: 4
          }
        }
      },
      ...meta
    })
    this.deviceType = options.deviceType
    this.eventBus = EventBus.getInstance()
  }
  // 添加一个自定义方法
  setSelected(selected: boolean) {
    this.isSelected = selected
  }

  getState(): NodeState {
    return {
      id: this.id,
      canDelete: this.canDelete,
      canEdit: this.canEdit
    }
  }

  handleToolbarAction(): NodeState {
    return {
      id: this.id,
      canDelete: this.canDelete,
      canEdit: this.canEdit
    }
  }
}
Node.registry.register('device', DeviceNode, true)
