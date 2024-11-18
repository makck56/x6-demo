import { Node } from '@antv/x6'
import { EventBus } from '@/utils/EventBus'

interface NodeState {
  id: string
  canDelete: boolean
  canEdit: boolean
}

export class BaseNode extends Node {
  protected eventBus: EventBus
  protected isSelected = false
  protected canEdit = false
  protected canDelete = false
  deviceType = ''
  constructor(options: Node.Metadata) {
    super(options)
    this.eventBus = EventBus.getInstance()
  }
  canEmbedding(node: BaseNode) {
    return false
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
