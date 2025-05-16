import { Dispatch, SetStateAction, useImperativeHandle, useState, forwardRef } from "react";
import { FormInstance, ModalProps, Form, Modal, Input, Select, InputNumber } from "antd";
import { UpdateMenuReq } from "@/api/system/types";
import { useAppContext } from "@/context";

interface IOptions {
  label: string;
  value: string;
}
interface MenuModalProps extends ChildProps<UpdateMenuReq>, ModalProps {}
export interface MenuModalRef extends ChildRef {
  menuForm: FormInstance<UpdateMenuReq>;
  setPidOptions: Dispatch<SetStateAction<IOptions[]>>;
}

const MenuModal = forwardRef<MenuModalRef, MenuModalProps>(function Child(props, ref) {
  useImperativeHandle(
    ref,
    () => {
      return {
        setShow,
        menuForm,
        setConfirmLoading,
        setPidOptions,
      };
    },
    []
  );
  const { handleSubmit, ...modalProps } = props;
  const { dicts } = useAppContext();

  const [menuForm] = Form.useForm<UpdateMenuReq>();
  const [show, setShow] = useState(false);
  const [pidOptions, setPidOptions] = useState<IOptions[]>([]);
  const menuId = Form.useWatch("id", menuForm);

  const [confirmLoading, setConfirmLoading] = useState(false);
  return (
    <Modal
      {...modalProps}
      open={show}
      confirmLoading={confirmLoading}
      onOk={() => {
        menuForm
          .validateFields()
          .then((values) => {
            handleSubmit(values);
          })
          .catch((err) => {
            console.error(err);
          });
      }}
      onCancel={() => {
        menuForm.resetFields();
        setShow(false);
      }}>
      <Form form={menuForm} autoComplete="off" labelCol={{ span: 5 }}>
        <Form.Item hidden name="id">
          <div></div>
        </Form.Item>
        <Form.Item label="菜单名称" name="name" rules={[{ required: true, max: 255 }]}>
          <Input placeholder="请输入菜单名称" />
        </Form.Item>
        <Form.Item label="父级菜单" name="pid" required>
          <Select options={pidOptions} disabled={!menuId}></Select>
        </Form.Item>
        <Form.Item label="图标" name="icon">
          <Input placeholder="请输入图标" maxLength={255} />
        </Form.Item>
        <Form.Item label="路由名称" name="route" rules={[{ required: true, max: 255 }]}>
          <Input placeholder="请输入路由名称" />
        </Form.Item>
        <Form.Item label="菜单类型" name="type">
          <Select options={dicts.getDict("menu_type")} placeholder="请选择菜单类型"></Select>
        </Form.Item>
        <Form.Item label="权限值" name="powerKey">
          <Input placeholder="请输入权限值" maxLength={255} />
        </Form.Item>
        <Form.Item label="排序值" name="orderValue">
          <InputNumber
            placeholder="请输入排序值"
            step={10}
            min={0}
            maxLength={255}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="模块名称"
          name="moduleName"
          hidden
          rules={[{ required: true, message: "请选择模块名称" }]}>
          <div></div>
          {/* <Select
            options={options?.moduleOptions}
            fieldNames={{ value: "moduleValue", label: "moduleName" }}
            placeholder="请选择模块名称"
            disabled></Select> */}
        </Form.Item>
      </Form>
    </Modal>
  );
});
export default MenuModal;
