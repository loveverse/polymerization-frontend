import  {useDeferredValue, useEffect, useState, useTransition} from "react";
import {useStorage} from "./hooks/useStorage";
import {useHistory} from "./hooks/useHistory";
import * as Antd from "antd";
import {A} from "./A.js";
import {Flex, Input, List} from "antd";




const App = () => {
  // Antd.Button = () => import("./B.tsx")
  return <div>
    <TransitionChild/>
    {/*<HistoryChild/>*/}
    {/*<StorageChild/>*/}
  </div>
}

const DeferredChild = () => {
  // 传入一个初始值，返回延迟更新的值，该函数只会在用户停止输入后重新渲染
  const deferredValue = useDeferredValue("111")
  return <div>
    <A></A>
  </div>
}

interface Item {
  id: number;
  name: string;
  address: string
}

const TransitionChild = () => {
  const [inputValue, setInputValue] = useState('');
  // 返回两个参数，第一个是是否存在待处理的transition,
  // 用于管理UI的过渡状态，允许将更新标记为“过渡”状态，
  const [isPending, startTransition] = useTransition(); // 开始过渡
  const [list, setList] = useState<Item[]>([])
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    fetch(`/api/list?keyWord=${value}`).then(res => res.json()).then(data => {
      const res = data?.list ?? [];
      // 使用过渡 useTransition
      startTransition(() => {
        setList([...res])
      })
      //不使用过渡 useTransition
      //setList([...res])
    })
  }
  return <>
    <Flex>
      <Input
        value={inputValue}
        onChange={handleInputChange} // 实时更新
        placeholder="请输入姓名"
      />
    </Flex>
    {
      isPending && <div>loading...</div>
    }
    <List
      dataSource={list}
      renderItem={(item: any) => (
        <List.Item>
          <List.Item.Meta
            title={item.name}
            description={item.address}
          />
        </List.Item>
      )}
    />
  </>
}

const HistoryChild = () => {
  const [history, push, replace] = useHistory()
  return <div>
    <h2>地址{history}</h2>
    <button onClick={() => {
      push("/aaa")
    }}>切换
    </button>
    <button onClick={() => {
      replace("/bbb")
    }}>跳转
    </button>

  </div>
}


const StorageChild = () => {
  const [val, setVal] = useStorage("aa", 1)
  return <div>
    <button onClick={() => {
      setVal(val + 1)
    }}>加加
    </button>
    <h2>
      {val}
    </h2>

  </div>
}

export default App
