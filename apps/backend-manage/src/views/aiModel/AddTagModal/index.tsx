import { reqAddModelTag, reqEditModelTag } from "@/api/aiModel";
import { EditModelTagReq, ModelTagParams } from "@/api/aiModel/types";
import { Form, FormInstance, Input, Modal, ModalProps, message } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
interface AddTagModalProps extends ChildCallback, ModalProps {
  aiId: string;
  count: number;
}
export interface AddTagModalRef extends ChildRef {
  tagForm: FormInstance<EditModelTagReq>;
}
const AddTagModal = forwardRef<AddTagModalRef, AddTagModalProps>(function Child(props, ref) {
  useImperativeHandle(
    ref,
    () => {
      return {
        setShow,
        setConfirmLoading,
        tagForm,
      };
    },
    []
  );
  const { aiId, count, callback, ...modalProps } = props;
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [tagForm] = Form.useForm<EditModelTagReq>();

  const addModelTag = async (values: ModelTagParams) => {
    setConfirmLoading(true);
    const res = await reqAddModelTag({
      aiId,
      tagList: [{ ...values, sn: count + 1 }],
    });
    if (res.code === 200) {
      message.success("创建模型标签成功");
      tagForm.resetFields();
      setShow(false);
      callback();
    } else {
      message.error(res.message);
    }
    setConfirmLoading(false);
  };
  const editModelTag = async (values: EditModelTagReq) => {
    setConfirmLoading(true);
    const res = await reqEditModelTag(values);
    if (res.code === 200) {
      message.success("编辑模型标签成功");
      setShow(false);
      callback();
    } else {
      message.error(res.message);
    }
    setConfirmLoading(false);
  };
  return (
    <Modal
      {...modalProps}
      open={show}
      confirmLoading={confirmLoading}
      onCancel={() => setShow(false)}
      onOk={() => {
        tagForm
          .validateFields()
          .then((values) => {
            values.id ? editModelTag(values) : addModelTag(values);
          })
          .catch((err) => {
            console.error(err);
          });
      }}>
      <Form form={tagForm} autoComplete="off" labelCol={{ span: 5 }}>
        <Form.Item name="id" hidden>
          <div></div>
        </Form.Item>
        <Form.Item label="模型标签" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入模型标签" />
        </Form.Item>
        <Form.Item label="标签值" name="value" rules={[{ required: true }]}>
          <Input placeholder="请输入标签值" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddTagModal;
