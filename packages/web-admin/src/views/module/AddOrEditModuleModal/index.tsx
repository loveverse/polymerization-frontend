import { AddModuleReq, UpdateModuleReq } from "@/api/module/types"
import { Button, Form, Input, InputNumber, message, Modal } from "antd"
import { ModalControlsProps } from "@/hooks/useModalControls"
import { reqAddModule, reqUpdateModule } from "@/api/module"
import { useEffect } from "react"

const AddOrEditModuleModal = (props: ModalControlsProps) => {
  const { modalProps, modalActions, refresh } = props
  const [moduleForm] = Form.useForm<UpdateModuleReq>()
  const editable = !!Form.useWatch("id", moduleForm)
  const addModule = async (values: AddModuleReq) => {
    modalActions.setLoading(true)
    const res = await reqAddModule(values)
    if (res.code === 200) {
      modalActions.hide()
      moduleForm.resetFields()
      message.success("添加模块成功")
      refresh?.()
    } else {
      message.error(res.msg)
    }
    modalActions.setLoading(false)
  }

  const editModule = async (values: UpdateModuleReq) => {
    modalActions.setLoading(true)
    const res = await reqUpdateModule(values)
    if (res.code === 200) {
      modalActions.hide()
      message.success("修改模块信息成功")
      refresh?.()
    } else {
      message.error(res.msg)
    }
    modalActions.setLoading(false)
  }
  useEffect(() => {
    modalActions.exposeMethods({
      setFieldsValue: moduleForm.setFieldsValue,
    })
  }, [])
  return (
    <Modal
      {...modalProps}
      onOk={() => {
        moduleForm
          .validateFields()
          .then(values => {
            values.id ? editModule(values) : addModule(values)
          })
          .catch(err => {
            console.error(err)
          })
      }}>
      <Form
        form={moduleForm}
        autoComplete="off"
        labelCol={{ span: 6 }}
        onFinish={values => {
          values.id ? editModule(values) : addModule(values)
        }}>
        <Form.Item hidden name="id">
          <div></div>
        </Form.Item>
        <Form.Item label="模块名(中文)" name="moduleName" rules={[{ required: true }]}>
          <Input placeholder="请输入模块名" maxLength={255} />
        </Form.Item>
        <Form.Item label="模块标识(英文)" name="moduleValue" rules={[{ required: true }]}>
          <Input placeholder="请输入模块标识" disabled={editable} maxLength={255} />
        </Form.Item>
        <Form.Item label="模块链接" name="url" rules={[{ required: true }]}>
          <Input placeholder="请输入模块标识" maxLength={255} />
        </Form.Item>
        <Form.Item label="排序值" name="sortOrder">
          <InputNumber step={10} style={{ width: 150 }} placeholder="请输入排序值" />
        </Form.Item>
        <Form.Item hidden>
          <Button htmlType="submit"></Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default AddOrEditModuleModal
