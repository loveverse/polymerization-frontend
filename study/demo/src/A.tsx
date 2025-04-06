import React, {useDeferredValue} from "react";
import {Button} from "antd";

export const A = () => {
  // 传入一个初始值，返回延迟更新的值，该函数只会在用户停止输入后重新渲染
  const deferredValue = useDeferredValue("111")
  return <div>
    <Button>123</Button>
  </div>
}
