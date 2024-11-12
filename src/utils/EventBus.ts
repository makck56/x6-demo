export class EventBus {
  private static instance: EventBus
  private subscribers: Map<string, Function[]>

  private constructor() {
    this.subscribers = new Map()
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus()
    }
    return EventBus.instance
  }

  subscribe(event: string, callback: Function) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, [])
    }
    this.subscribers.get(event)?.push(callback)
  }

  publish(event: string, data?: any) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event)?.forEach(callback => callback(data))
    }
  }

  unsubscribe(event: string, callback: Function) {
    const callbacks = this.subscribers.get(event) || []
    const index = callbacks.indexOf(callback)
    if (index > -1) {
      callbacks.splice(index, 1)
    }
  }
}
