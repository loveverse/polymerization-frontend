import {App, Form, Input, InputNumber, Modal} from "antd";
import {ModalControlsProps} from "@/hooks/useModalControls";
import {AddDictItemReq, UpdateDictItemReq} from "@/api/system/types";

import {reqAddDictItem, reqUpdateDictItem} from "@/api/system";
import {useEffect} from "react";

const AddOrEditDictItemModal = (props: ModalControlsProps) => {
  const {modalProps, actions, refresh} = props
  const {message} = App.useApp()
  const [dictItemForm] = Form.useForm<UpdateDictItemReq | AddDictItemReq>();

  const addDictItem = async (values: AddDictItemReq) => {
    actions.setLoading(true)

    const res = await reqAddDictItem(values);
    if (res.code === 200) {
      actions.hide()
      message.success("添加字典项成功");
      dictItemForm.resetFields()
      refresh?.()
    } else {
      message.error(res.msg);
    }
    actions.setLoading(false)
  };

  const editDictItem = async (values: UpdateDictItemReq) => {
    actions.setLoading(true)
    const res = await reqUpdateDictItem(values);
    if (res.code === 200) {
      actions.hide();
      message.success("修改字典项信息成功");
      refresh?.()
    } else {
      message.error(res.msg);
    }
    actions.setLoading(false);
  };
// 监听modalProps.open变化，设置表单初始值
  useEffect(() => {
    actions.exposeMethods?.({
      setFieldsValue: dictItemForm.getFieldsValue
    })
  }, []);
  return (
    <Modal
      {...modalProps}
      onOk={() => {
        dictItemForm
          .validateFields()
          .then((values) => {
            "id" in values && values.id ? editDictItem(values) : addDictItem(values as AddDictItemReq)
          })
          .catch((err) => {
            console.error(err);
          });
      }}
    >
      <Form form={dictItemForm} autoComplete="off" labelCol={{span: 6}}>
        <Form.Item hidden name="id">
          <div></div>
        </Form.Item>
        <Form.Item hidden name="dictId">
          <div></div>
        </Form.Item>
        <Form.Item label="展示值(label)" name="dictItemLabel" rules={[{required: true, max: 255}]}>
          <Input placeholder="请输入展示值(label)"/>
        </Form.Item>
        <Form.Item label="字典值(value)" name="dictItemValue" rules={[{required: true, max: 255}]}>
          <Input placeholder="请输入字典值(value)"/>
        </Form.Item>

        <Form.Item label="排序值" name="sortOrder" tooltip="数字越小，排序越靠前" rules={[{required: true, type: "number"}]}>
          <InputNumber
            placeholder="请输入排序值"
            style={{width: "100%"}}
            step={10}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default AddOrEditDictItemModal
