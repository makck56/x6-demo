import { Node } from '@antv/x6'
import omit from 'lodash-es/omit'
import { BaseNode } from './BaseNode'
const portCommonAttrs = {
  circle: {
    r: 4,
    stroke: '#31d0c6',
    fill: '#fff',
    magnet: 'true'
  }
}
export class RegularArea extends BaseNode {
  preSize = { width: 240, height: 160 }
  isExpand = false
  constructor(options?: any) {
    const _options = omit(options || {}, ['zIndex'])
    console.log(options)
    super({
      width: 240,
      height: 160,
      zIndex: 1,
      label: '常规区域',
      data: {
        regular: true
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
          stroke: '#000',
          strokeWidth: 1,
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
            zIndex: 1
          },
          right: {
            position: { name: 'right' },
            attrs: portCommonAttrs,
            zIndex: 1
          },
          bottom: {
            position: { name: 'bottom' },
            attrs: portCommonAttrs,
            zIndex: 1
          }
        }
      },
      ..._options
    })
    this.toggleExpand = this.toggleExpand.bind(this)
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
Node.registry.register('regular-area', RegularArea, true)
