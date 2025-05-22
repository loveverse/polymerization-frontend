import {useState} from "react";
import type {ModalProps} from "antd";

export interface Actions<T> {
  show: (initialValues?: T) => void;
  hide: () => void;
  setLoading: (value: boolean) => void;
  getInitialValues: () => T | undefined; // 新增方法获取初始值
}

export type ModalControls<T> = [ModalProps, Actions<T>]

export interface ModalControlsProps<T = any> {
  actions: Actions<T>;
  modalProps: ModalProps;
  refresh?: () => void
}

export const useModalControls = <T = any>(): ModalControls<T> => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<T>();

  return [
    {
      open,
      confirmLoading,
      onCancel: () => setOpen(false),
    },
    {
      show: (values?: T) => {
        if (values) {
          setInitialValues(values);
        }
        setOpen(true);
      },
      hide: () => {
        setOpen(false);
      },
      setLoading: setConfirmLoading,
      getInitialValues: () => initialValues, // 提供获取初始值的方法
    }]
}
