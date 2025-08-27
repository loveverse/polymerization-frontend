import { Form, Input, InputNumber, message, Modal, Radio, Select } from "antd"
import { AddUserReq, RoleDataRes, UpdateUserReq } from "@/api/system/types"
import { useAppContext } from "@/context"
import { ModalControlsProps } from "@/hooks/useModalControls"
import { useEffect, useState } from "react"
import { reqAddUser, reqRoleList, reqUpdateUser } from "@/api/system"

const AddOrEditUserModal = (props: ModalControlsProps) => {
  const { modalProps, modalActions, refresh } = props
  const { dict } = useAppContext()

  const [userForm] = Form.useForm<UpdateUserReq>()
  const editable = !!Form.useWatch("id", userForm)
  const [roleList, setRoleList] = useState<RoleDataRes[]>([])
  const getRoleList = async () => {
    const res = await reqRoleList({ status: 1 })
    if (res.code === 200) {
      setRoleList(res.data)
    } else {
      message.error(res.msg)
    }
  }

  const addUser = async (values: AddUserReq) => {
    modalActions.setLoading(true)
    const res = await reqAddUser(values)
    if (res.code === 200) {
      modalActions.hide()
      message.success("添加用户成功")
      userForm.resetFields()
      refresh?.()
    } else {
      message.error(res.msg)
    }
    modalActions.setLoading(false)
  }

  const editUser = async (values: UpdateUserReq) => {
    modalActions.setLoading(true)
    const res = await reqUpdateUser(values)
    if (res.code === 200) {
      modalActions.hide()
      message.success("修改用户信息成功")
      refresh?.()
    } else {
      message.error(res.msg)
    }
    modalActions.setLoading(false)
  }

  useEffect(() => {
    modalActions.exposeMethods({
      setFieldsValue: userForm.setFieldsValue,
    })
    void getRoleList()
  }, [modalProps.open])

  return (
    <Modal
      {...modalProps}
      onOk={() => {
        userForm
          .validateFields()
          .then(values => {
            values.id ? editUser(values) : addUser(values)
          })
          .catch(err => {
            console.error(err)
          })
      }}>
      <Form
        form={userForm}
        autoComplete="off"
        labelCol={{ span: 5 }}
        initialValues={{
          gender: "M",
          avatar: "https://avatars.githubusercontent.com/u/64570135?v=4",
        }}>
        <Form.Item hidden name="id">
          <div></div>
        </Form.Item>
        <Form.Item hidden name="avatar">
          <div></div>
        </Form.Item>
        <Form.Item label="用户名" name="username" rules={[{ required: true, max: 255 }]}>
          <Input placeholder="请输入用户名" />
        </Form.Item>
        {editable ? null : (
          <Form.Item label="密码" name="password" rules={[{ required: true, max: 255 }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}
        <Form.Item label="昵称" name="nickname">
          <Input placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item label="性别" name="gender" rules={[{ required: true }]}>
          <Radio.Group options={dict.getDictItemList("gender_type")}></Radio.Group>
        </Form.Item>
        <Form.Item label="用户角色" name="roleIds">
          <Select
            options={roleList}
            fieldNames={{ value: "id", label: "roleName" }}
            mode="multiple"
            placeholder="请选择用户角色"></Select>
        </Form.Item>
        <Form.Item label="手机号码" name="phoneNumber">
          <InputNumber placeholder="请输入手机号码" controls={false} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="邮箱" name="email">
          <Input placeholder="请输入邮箱" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddOrEditUserModal
