import { forwardRef, useImperativeHandle, useState } from "react";
import { FormInstance, ModalProps, Form, Modal, Input } from "antd";
import { UpdataRoleReq } from "@/api/system/types";

interface RoleModalProps extends ModalProps, ChildProps<UpdataRoleReq> {}
export interface RoleModalRef extends ChildRef {
  roleForm: FormInstance<UpdataRoleReq>;
}
const RoleModal = forwardRef<RoleModalRef, RoleModalProps>(function Child(props, ref) {
  useImperativeHandle(
    ref,
    () => {
      return {
        setShow,
        roleForm,
        setConfirmLoading,
      };
    },
    []
  );
  const { handleSubmit, ...modalProps } = props;
  const [roleForm] = Form.useForm<UpdataRoleReq>();
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  return (
    <Modal
      {...modalProps}
      open={show}
      confirmLoading={confirmLoading}
      onOk={() => {
        roleForm
          .validateFields()
          .then((values) => {
            handleSubmit(values);
          })
          .catch((err) => {
            console.error(err);
          });
      }}
      onCancel={() => setShow(false)}>
      <Form form={roleForm} autoComplete="off">
        <Form.Item hidden name="id">
          <div></div>
        </Form.Item>
        <Form.Item label="角色名称" name="roleName" rules={[{ required: true, max: 255 }]}>
          <Input placeholder="请输入角色名称" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default RoleModal;
