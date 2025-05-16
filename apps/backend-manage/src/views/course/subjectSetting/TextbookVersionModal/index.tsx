import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Form, FormInstance, Input, Modal, ModalProps, message } from "antd";
import { AddTextbookVersionReq, EditTextbookVersionReq } from "@/api/course/subject/types";
import { reqAddTextbookVersion, reqEditTextbookVersion } from "@/api/course/subject";

export interface TextbookVersionModalRef extends ChildRef {
  textbookVersionForm: FormInstance<EditTextbookVersionReq>;
}
interface TextbookVersionModalProps extends ChildCallback, ModalProps {}
const TextbookVersionModal = forwardRef<TextbookVersionModalRef, TextbookVersionModalProps>(
  function Child(props, ref) {
    useImperativeHandle(ref, () => {
      return {
        setShow,
        textbookVersionForm,
        setConfirmLoading,
      };
    });
    const { callback, ...modalProps } = props;
    const [show, setShow] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [textbookVersionForm] = Form.useForm<EditTextbookVersionReq>();
    const addTextbookVersion = async (values: AddTextbookVersionReq) => {
      setConfirmLoading(true);
      const res = await reqAddTextbookVersion({ versionName: values.versionName });
      if (res.code === 200) {
        setShow(false);
        textbookVersionForm.resetFields();
        message.success("新增教材版本成功");
        callback();
      } else {
        message.error(res.message);
      }
      setConfirmLoading(false);
    };
    const editTextbookVersion = async (values: EditTextbookVersionReq) => {
      setConfirmLoading(true);
      const res = await reqEditTextbookVersion(values);
      if (res.code === 200) {
        setShow(false);
        message.success("编辑教材版本成功");
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
          textbookVersionForm
            .validateFields()
            .then((values) => {
              values.id ? editTextbookVersion(values) : addTextbookVersion(values);
            })
            .catch((err) => {
              console.error(err);
            });
        }}>
        <Form form={textbookVersionForm} autoComplete="off">
          <Form.Item name="id" hidden>
            <div></div>
          </Form.Item>
          <Form.Item name="versionName" label="教材版本" rules={[{ required: true }]}>
            <Input placeholder="请输入教材版本名称" maxLength={255} />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);

export default TextbookVersionModal;
