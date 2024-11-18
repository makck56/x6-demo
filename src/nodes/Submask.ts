import { Node } from '@antv/x6'
import { BaseNode } from './BaseNode'
export class Submask extends BaseNode {
  preSize = { width: 240, height: 160 }
  protected isSelected = false
  isExpand = false
  constructor(options?: any) {
    super({
      width: 180,
      height: 160,
      zIndex: 2,
      label: '子网区域',
      data: {
        submask: true
      },
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
      attrs: {
        label: {
          refX: 16,
          refY: 16,
          fontSize: 12
        },
        body: {
          fill: '#BEE6FF',
          stroke: '#1890ff',
          strokeWidth: 1,
          strokeDasharray: 5,
          refWidth: 1,
          refHeight: 1
        }
      },
      markup: [
        {
          tagName: 'rect',
          selector: 'body'
        },
        {
          tagName: 'text',
          selector: 'label'
        }
      ],
      ...(options || {})
    })
    this.toggleExpand = this.toggleExpand.bind(this)
  }

  canEmbedding(node: BaseNode) {
    if (node.shape === 'device') {
      return true
    }
    return false
  }

  protected hideChildren() {
    const children = this.getChildren() || []
    children.forEach(child => {
      child.hide()
    })
  }
  protected showChildren() {
    const children = this.getChildren() || []
    children.forEach(child => {
      child.show()
    })
  }
  // 添加一个自定义方法
  toggleExpand() {
    if (this.isExpand) {
      this.hideChildren()
      this.attr('label/text', '子网区域')
      this.resize(this.preSize.width, this.preSize.height)
    } else {
      this.preSize = this.getSize()
      this.showChildren()
      this.resize(120, 50)
      this.attr('label/text', '子网区域(1)')
    }
    this.isExpand = !this.isExpand
  }
}
Node.registry.register('submask', Submask, true)
