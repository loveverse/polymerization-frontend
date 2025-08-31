interface IEmitter {
  events: Map<string, Array<Function>>
  once: (event: string, callback: Function) => void
  emit: (event: string, ...args: any[]) => void
  on: (event: string, callback: Function) => void
  off: (event: string, callback: Function) => void
}

class Emitter implements IEmitter {
  events: Map<string, Array<Function>>

  constructor() {
    this.events = new Map()
  }

  emit(event: string, ...args: any): void {
    if (this.events.has(event)) {
      const list = this.events.get(event)
      if (list) {
        list.forEach(callback => {
          callback && callback(args)
        })
      }
    }
  }

  off(event: string, callback: Function): void {
    if (this.events.has(event)) {
      const list = this.events.get(event)
      if (list) {
        list.splice(list.indexOf(callback), 1)
      }
    }
  }

  on(event: string, callback: Function): void {
    if (this.events.has(event)) {
      const list = this.events.get(event)
      // 可以重复监听多次
      list && list.push(callback)
    } else {
      // 没有就添加进去
      this.events.set(event, [callback])
    }
  }

  once(event: string, callback: Function): void {
    const cb = () => {
      if (this.events.has(event)) {
        callback()
        this.off(event, cb)
      }
    }
    this.on(event, cb)
  }
}

const emitter = new Emitter()
emitter.on("storage", (data: any) => {
  console.log(data, "111")
})

emitter.emit("storage")

interface Obj {
  a: number
  b: number
}

type PartialObj<T> = {
  [key in keyof T]?: T[key]
}

type Obj2 = PartialObj<Obj>
const obj: Obj2 = {
  a: 1,
}
