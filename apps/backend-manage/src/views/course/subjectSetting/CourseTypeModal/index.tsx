import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Form, FormInstance, Input, Modal, ModalProps, message } from "antd";
import { AddCourseTypeReq, EditCourseTypeReq } from "@/api/course/subject/types";
import { reqAddCourseType, reqEditCourseType } from "@/api/course/subject";

export interface CourseTypeModalRef extends ChildRef {
  courseTypeForm: FormInstance<EditCourseTypeReq>;
}
interface CourseTypeModalProps extends ChildCallback, ModalProps {}
const CourseTypeModal = forwardRef<CourseTypeModalRef, CourseTypeModalProps>(function Child(
  props,
  ref
) {
  useImperativeHandle(ref, () => {
    return {
      setShow,
      courseTypeForm,
      setConfirmLoading,
    };
  });
  const { callback, ...modalProps } = props;
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [courseTypeForm] = Form.useForm<EditCourseTypeReq>();

  const addCourseType = async (values: AddCourseTypeReq) => {
    setConfirmLoading(true);
    const res = await reqAddCourseType({
      courseTypeName: values.courseTypeName,
    });
    if (res.code === 200) {
      setShow(false);
      courseTypeForm.resetFields();
      message.success("新增课程类型成功");
      callback();
    } else {
      message.error(res.message);
    }
    setConfirmLoading(false);
  };
  const editCourseType = async (values: EditCourseTypeReq) => {
    setConfirmLoading(true);
    const res = await reqEditCourseType(values);
    if (res.code === 200) {
      setShow(false);
      callback();
      message.success("编辑课程类型成功");
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
        courseTypeForm
          .validateFields()
          .then((values) => {
            values.id ? editCourseType(values) : addCourseType(values);
          })
          .catch((err) => {
            console.error(err);
          });
      }}>
      <Form form={courseTypeForm} autoComplete="off">
        <Form.Item name="id" hidden>
          <div></div>
        </Form.Item>
        <Form.Item name="courseTypeName" label="课程类型名称" rules={[{ required: true }]}>
          <Input placeholder="请输入课程类型名称" maxLength={255} />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CourseTypeModal;
