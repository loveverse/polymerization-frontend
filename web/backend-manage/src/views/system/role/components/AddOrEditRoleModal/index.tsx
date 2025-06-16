import {App, Form, Input, Modal} from "antd";
import {AddRoleReq, UpdateRoleReq} from "@/api/system/types";
import {reqAddRole, reqUpdateRole} from "@/api/system";
import {ModalControlsProps} from "@/hooks/useModalControls";
import {useEffect} from "react";


const AddOrEditRoleModal = (props: ModalControlsProps<UpdateRoleReq>) => {
  const {message} = App.useApp()
  const {modalProps, modalActions, refresh} = props;
  const [roleForm] = Form.useForm<UpdateRoleReq>();
  const roleId = Form.useWatch("id", roleForm);

  const addRole = async (values: AddRoleReq) => {
    modalActions.setLoading(true)
    const res = await reqAddRole(values);
    if (res.code === 200) {
      modalActions.hide();
      roleForm.resetFields();
      message.success("添加角色成功");
      refresh?.()
    } else {
      message.error(res.msg);
    }
    modalActions.setLoading(false)
  };

  const editRole = async (values: UpdateRoleReq) => {
    modalActions.setLoading(true);
    const res = await reqUpdateRole(values);
    if (res.code === 200) {
      modalActions.hide();
      message.success("修改角色信息成功");
      refresh?.()
    } else {
      message.error(res.msg);
    }
    modalActions.setLoading(false)
  };
// 监听modalProps.open变化，设置表单初始值
  useEffect(() => {
    modalActions.exposeMethods({
      setFieldsValue: roleForm.setFieldsValue
    })
  }, []);

  return (
    <Modal
      {...modalProps}
      onOk={() => {
        roleForm
          .validateFields()
          .then((values) => {
            values.id ? editRole(values) : addRole(values)
          })
          .catch((err) => {
            console.error(err);
          });
      }}
    >
      <Form form={roleForm} autoComplete="off">
        <Form.Item hidden name="id">
          <div></div>
        </Form.Item>
        <Form.Item label="角色名称" name="roleName" rules={[{required: true, max: 255}]}>
          <Input placeholder="请输入角色名称"/>
        </Form.Item>
        <Form.Item label="角色标识" name="roleKey" rules={[{required: true, max: 255}]}>
          <Input placeholder="请输入角色标识" disabled={!!roleId}/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddOrEditRoleModal;
