import http from "http"

const RestController = (value: number) => {
  const fn: ClassDecorator = target => {
    target.prototype.age = value
    target.prototype.fn = () => {
      console.log("age", target.prototype.age)
    }
  }
  return fn
}
const Get = (url: string) => {
  return (target: Object, key: string | symbol, descriptor: PropertyDescriptor) => {
    if (!descriptor) {
      throw new Error("Method decorator requires a descriptor.")
    }

    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      console.log(`Calling ${String(key)} with URL: ${url}`)
      http.get(url, (res: any) => {
        originalMethod.apply(this, [res, ...args]) // 确保绑定 this
      })
    }
  }
}

@RestController(20)
class Controller {
  // private name: string;

  // constructor(name: string) {
  //   // this.name = name;
  // }
  // 需要启用 experimentalDecorators 和 emitDecoratorMetadata
  @Get("/api")
  getList(data: any) {
    console.log(data)
  }
}

// console.log(111)
// const controller = new Controller() as any

// RestController(Controller)
// controller.age
// console.log(controller.age)
