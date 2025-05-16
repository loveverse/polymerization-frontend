import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Form, FormInstance, Input, Modal, ModalProps, message } from "antd";
import { reqAddSubject, reqEditSubject } from "@/api/course/subject";
import { AddSubjectReq, EditSubjectReq } from "@/api/course/subject/types";

export interface SubjectModalRef extends ChildRef {
  subjectForm: FormInstance<EditSubjectReq>;
}
interface SubjectModalProps extends ModalProps, ChildCallback {}

const SubjectModal = forwardRef<SubjectModalRef, SubjectModalProps>(function Child(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      setShow,
      subjectForm,
      setConfirmLoading,
    };
  });
  const { callback, ...modalProps } = props;
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [subjectForm] = Form.useForm<EditSubjectReq>();

  const addSubject = async (values: AddSubjectReq) => {
    setConfirmLoading(true);
    const res = await reqAddSubject({ subjectName: values.subjectName });
    if (res.code === 200) {
      setShow(false);
      subjectForm.resetFields();
      message.success("新增学科成功");
      callback();
    } else {
      message.error(res.message);
    }
    setConfirmLoading(false);
  };
  const editSubject = async (values: EditSubjectReq) => {
    setConfirmLoading(true);
    const res = await reqEditSubject(values);
    if (res.code === 200) {
      setShow(false);
      callback();
      message.success("编辑学科成功");
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
        subjectForm
          .validateFields()
          .then((values) => {
            values.id ? editSubject(values) : addSubject(values);
          })
          .catch((err) => {
            console.error(err);
          });
      }}>
      <Form form={subjectForm} autoComplete="off">
        <Form.Item name="id" hidden>
          <div></div>
        </Form.Item>
        <Form.Item name="subjectName" label="学科名称" rules={[{ required: true }]}>
          <Input placeholder="请输入学科名称" maxLength={255} />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default SubjectModal;
