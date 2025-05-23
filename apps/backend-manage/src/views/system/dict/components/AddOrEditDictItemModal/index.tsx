import {App, Form, Input, InputNumber, Modal, Tooltip} from "antd";
import {ModalControlsProps} from "@/hooks/useModalControls";
import {AddDictItemReq, UpdateDictItemReq} from "@/api/system/types";
import {ExclamationCircleOutlined} from "@ant-design/icons";

import {reqAddDictItem, reqUpdateDictItem} from "@/api/system";
import {useEffect} from "react";

const AddOrEditDictItemModal = (props: ModalControlsProps) => {
  const {modalProps, actions, refresh} = props
  const {message} = App.useApp()
  const [dictForm] = Form.useForm<UpdateDictItemReq>();

  const addDictItem = async (values: AddDictItemReq) => {
    actions.setLoading(true)
    const res = await reqAddDictItem({
      ...values,
    });
    if (res.code === 200) {
      actions.hide()

      message.success("添加字典详情成功");
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
      message.success("修改字典信息成功");
    } else {
      message.error(res.msg);
    }
    actions.setLoading(false);
  };
// 监听modalProps.open变化，设置表单初始值
  useEffect(() => {
    if (modalProps.open) {
      const initialValues = actions.getInitialValues();
      if (initialValues) {
        dictForm.setFieldsValue(initialValues);
      }
    }
  }, [modalProps.open]);
  return (
    <Modal
      {...modalProps}
      onOk={() => {
        dictForm
          .validateFields()
          .then((values) => {
            // values.id ? editDictItem(values) : addDictItem(values)
          })
          .catch((err) => {
            console.error(err);
          });
      }}
    >
      <Form form={dictForm} autoComplete="off" labelCol={{span: 6}}>
        <Form.Item hidden name="id">
          <div></div>
        </Form.Item>
        <Form.Item hidden name="dictId">
          <div></div>
        </Form.Item>
        <Form.Item label="展示值(label)" name="label" rules={[{required: true, max: 255}]}>
          <Input placeholder="请输入展示值(label)"/>
        </Form.Item>
        <Form.Item label="字典值(value)" name="value" rules={[{required: true, max: 255}]}>
          <Input placeholder="请输入字典值(value)"/>
        </Form.Item>

        <Form.Item label="排序值" name="dictSort" rules={[{required: true, type: "number"}]}>
          <InputNumber

            placeholder="请输入排序值"
            style={{width: "100%"}}
            addonBefore={
              <Tooltip className="cur-pointer" placement="bottom" title="数字越小，排序越靠前">
                <ExclamationCircleOutlined/>
              </Tooltip>
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default AddOrEditDictItemModal
