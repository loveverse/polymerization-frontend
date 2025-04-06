import {useSyncExternalStore} from "react";

export const useStorage = (key: string, defaultValue: any) => {
  // 订阅数据源的变化，接收一个回调函数，在数据源更新时调用改回调函数
  const subscribe = (callback: () => void) => {
    window.addEventListener("storage", () => {
      console.log("触发设置localStorage")
      callback()
    })
    return () => {
      window.removeEventListener("storage", callback)
    }
  }
  const getSnapshot = () => {

    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : defaultValue;
  }
  const setStorage = (value: any) => {
    // 手动触发storage事件
    localStorage.setItem(key, value);
    window.dispatchEvent(new StorageEvent("storage"))
  }
  const res = useSyncExternalStore(subscribe, getSnapshot)
  return [res, setStorage]
}
