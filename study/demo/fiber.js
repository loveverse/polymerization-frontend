const channel = new MessageChannel()
const port1 = channel.port1;
const port2 = channel.port2;

port1.onmessage = (event) => {
  port1.postMessage("111")
}

port2.onmessage = (event) => {
  console.log("222", event.data);
}

port2.postMessage("222")


const ImmediatePriority = 1; // 立即执行的优先级, 级别最高 [点击事件，输入框，]
const UserBlockingPriority = 2; // 用户阻塞级别的优先级, [滚动，拖拽这些]
const NormalPriority = 3; // 正常的优先级 [redner 列表 动画 网络请求]
const LowPriority = 4; // 低优先级  [分析统计]
const IdlePriority = 5;// 最低阶的优先级, 可以被闲置的那种 [console.log]

class SimpleScheduler {
  constructor() {
    this.taskQueue = []
    this.isPerformingWork = false;
    const channel = new MessageChannel()
    this.port = channel.port2;
    channel.port1.onmessage = this.performWorkUntilDeadline.bind(this);
  }

  performWorkUntilDeadline() {

  }
}

const name = "2"

const obj = {
  name: "1",
  say: function () {
    console.log(this.name)
  }
}
obj.say() // 1
setTimeout(obj.say, 0) // 2

Function.prototype.myBind = function () {
  const _this = this;
  const context = arguments[0];
  let arg = [].slice.call(arguments, 1);
  return function () {
    arg = [].concat.apply(arg, arguments);
    _this.apply(context, arg);
  }
};

Function.prototype.myBind.iterator = function (callback) {
  for (let i = 0; i < this.length; i++) {
    callback.bind(this.get(i), i, this.get(i), this)
  }
}
