import { forwardRef, useImperativeHandle, useState } from "react";
import {
  FormInstance,
  ModalProps,
  Form,
  Modal,
  Input,
  Select,
  Switch,
  Radio,
  InputNumber,
} from "antd";
import { UpdateUserReq } from "@/api/user/types";
import { RolePageRes } from "@/api/system/types";
import { useAppContext } from "@/context";

interface UserModalProps extends ModalProps, ChildProps<UpdateUserReq> {
  roleOptions: RolePageRes[];
}
export interface UserModalRef extends ChildRef {
  userForm: FormInstance<UpdateUserReq>;
}

const UserModal = forwardRef<UserModalRef, UserModalProps>(function Child(props, ref) {
  useImperativeHandle(
    ref,
    () => {
      return {
        setShow,
        userForm,
        setConfirmLoading,
      };
    },
    []
  );
  const { handleSubmit, roleOptions, ...modalProps } = props;

  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { dicts } = useAppContext();
  const [userForm] = Form.useForm<UpdateUserReq>();

  return (
    <Modal
      {...modalProps}
      open={show}
      confirmLoading={confirmLoading}
      onOk={() => {
        userForm
          .validateFields()
          .then((values) => {
            values.roles = values.roles?.map((item) => {
              return typeof item === "string" ? { id: item } : item;
            });
            values.isLock = Number(!values.isLock);
            handleSubmit(values);
          })
          .catch((err) => {
            console.error(err);
          });
      }}
      onCancel={() => {
        userForm.resetFields();
        setShow(false);
      }}>
      <Form
        form={userForm}
        autoComplete="off"
        labelCol={{ span: 5 }}
        initialValues={{
          isLock: 1,
          gender: "M",
        }}>
        <Form.Item hidden name="id">
          <div></div>
        </Form.Item>
        <Form.Item label="用户名" name="username" rules={[{ required: true, max: 255 }]}>
          <Input placeholder="请输入用户名" />
        </Form.Item>
        {modalProps.title === "新增用户" ? (
          <Form.Item label="密码" name="password" rules={[{ required: true, max: 255 }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        ) : null}
        <Form.Item label="昵称" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item label="性别" name="gender" rules={[{ required: true }]}>
          <Radio.Group options={dicts.getDict("gender")}></Radio.Group>
        </Form.Item>
        <Form.Item
          label="用户角色"
          name="roles"
          rules={[{ required: true, type: "array", message: "请选择用户角色" }]}>
          <Select
            options={roleOptions}
            fieldNames={{ value: "id", label: "roleName" }}
            mode="multiple"
            placeholder="请选择用户角色"></Select>
        </Form.Item>
        <Form.Item label="职称" name="title">
          <Input placeholder="请输入职称" />
        </Form.Item>
        <Form.Item label="手机号码" name="phoneNumber">
          <InputNumber placeholder="请输入手机号码" controls={false} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="邮箱" name="email">
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        {modalProps.title === "新增用户" ? (
          <Form.Item label="状态" name="isLock" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="停用" />
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  );
});

export default UserModal;
