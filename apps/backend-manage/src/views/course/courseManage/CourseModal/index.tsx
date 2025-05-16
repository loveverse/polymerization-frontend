import { forwardRef, useImperativeHandle, useState } from "react";
import { FormInstance, ModalProps, Form, Modal, Input, Select, Checkbox, Radio } from "antd";
import { CourseTypeListRes, SubjectListRes } from "@/api/course/subject/types";
import { EditCourseReq } from "@/api/course/course/types";
import { PeriodListRes } from "@/api/base/types";
import { useAppContext } from "@/context";

export interface CourseChildRef extends ChildRef {
  courseForm: FormInstance<EditCourseReq>;
}
export interface CourseChildProps extends ChildProps<EditCourseReq>, ModalProps {
  options: {
    subject: SubjectListRes[];
    courseType: CourseTypeListRes[];
    period: PeriodListRes[];
  };
}

const CourseModal = forwardRef<CourseChildRef, CourseChildProps>(function Child(props, ref) {
  useImperativeHandle(
    ref,
    () => {
      return {
        setShow,
        courseForm,
        setConfirmLoading,
      };
    },
    []
  );
  const { dicts } = useAppContext();
  const { options, ...modalProps } = props;
  const [courseForm] = Form.useForm<EditCourseReq>();
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  return (
    <Modal
      {...modalProps}
      open={show}
      confirmLoading={confirmLoading}
      onOk={() => {
        courseForm
          .validateFields()
          .then((values) => {
            props.handleSubmit(values);
          })
          .catch((err) => {
            console.error(err);
          });
      }}
      onCancel={() => {
        courseForm.resetFields();
        setShow(false);
      }}>
      <Form
        form={courseForm}
        autoComplete="off"
        labelCol={{ span: 5 }}
        onFinish={(values) => {
          props.handleSubmit(values);
        }}>
        <Form.Item hidden name="id">
          <div></div>
        </Form.Item>
        <Form.Item label="课程名称" name="subjectName" rules={[{ required: true, max: 255 }]}>
          <Input placeholder="请输入课程名称" />
        </Form.Item>
        <Form.Item
          label="所属学科"
          name="subjectId"
          rules={[{ required: true, message: "请选择所属学科" }]}>
          <Select
            options={options.subject}
            fieldNames={{
              value: "id",
              label: "subjectName",
            }}
            placeholder="请选择所属学科"></Select>
        </Form.Item>
        <Form.Item
          label="课程类型"
          name="courseTypeId"
          rules={[{ required: true, message: "请选择课程类型" }]}>
          <Select
            options={options.courseType}
            fieldNames={{
              value: "id",
              label: "courseTypeName",
            }}
            placeholder="请选择课程类型"></Select>
        </Form.Item>
        <Form.Item
          label="课程分类"
          name="courseClassify"
          rules={[{ required: true, message: "请选择课程分类" }]}>
          <Select options={dicts.getDict("course_classify")} placeholder="请选择课程分类"></Select>
        </Form.Item>
        <Form.Item
          label="应用学段"
          name="periodIds"
          rules={[{ required: true, message: "请选择应用学段" }]}>
          <Checkbox.Group
            options={options.period.map((item) => {
              return {
                value: item.id,
                label: item.periodName,
              };
            })}></Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
});
export default CourseModal;
