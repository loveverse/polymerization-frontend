import {useMemo, useRef, useState} from "react";
import {DrawerProps} from "antd";

interface DrawerControls  extends DrawerProps{
  confirmLoading?: boolean
}
export interface ExposeMethods<T> {
  // 可以只更新部分字段
  setFieldsValue: (fields: Partial<T>) => void;
}

export interface BaseActions<T, M> {
  show: (initialValues?: Partial<T>) => void;
  hide: () => void;
  setLoading: (value: boolean) => void;
  /** ✅ 用于子组件注册自定义方法 */
  exposeMethods: (methods: Partial<ExposeMethods<T>> & Partial<M>) => void;
}

type DrawerActions<T, M extends Record<string, any>> = BaseActions<T, M> & M;

// 子组件 props 类型
export interface DrawerControlsProps<T extends Record<string, any> = Record<string, any>, M extends Record<string, any> = Record<string, any>> {
  drawerActions: DrawerActions<T, M>;
  drawerProps: DrawerControls;
  refresh?: () => void
}

// 父组件使用
export const useDrawerControls = <T extends Record<string, any>, M extends Record<string, any> = Record<string, any>>(): [DrawerProps, DrawerActions<T, M>] => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const methodMapRef = useRef<M & ExposeMethods<T>>({} as M & ExposeMethods<T>);
  // const [_, forceUpdate] = useState(0); // 用于强制更新 actions 引用
  const modalProps: DrawerControls = {
    open,
    confirmLoading,
    onClose: () => setOpen(false),
  }
  const baseActions: DrawerActions<T, M> = {
    show: (values?: Partial<T>) => {
      if (values) {
        methodMapRef.current.setFieldsValue(values)
      }
      setOpen(true);
    },
    hide: () => {
      setOpen(false);
    },
    setLoading: setConfirmLoading,
    exposeMethods: (methods) => {
      Object.assign(methodMapRef.current, methods)
      // TODO 将方法合并到 actions，方便直接调用,当前只会调用一次，导致后面又是原来的 actions
      // Object.assign(actions, {a:1})

      // forceUpdate(x => x + 1); // 强制刷新 actions

    }
  } as DrawerActions<T, M>
  // const actions = useMemo(() => {
  //   return {
  //     ...baseActions,
  //     ...methodMapRef.current,
  //   } as DrawerActions<T, O>;
  // }, [_, methodMapRef.current]);

  // 使用 Proxy 包装 actions，确保获取时是最新的,会照成页面卡顿
  const actions = useMemo(() => {
    return new Proxy(baseActions, {
      get(target, key) {
        if (key in target) {
          return target[key as keyof typeof target];
        }
        return methodMapRef.current?.[key as keyof typeof methodMapRef.current];
      },
    }) as DrawerActions<T, M>;
  }, []);
  return [modalProps, actions];
}
