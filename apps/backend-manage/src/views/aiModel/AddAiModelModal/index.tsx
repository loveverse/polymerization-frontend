import { forwardRef, useImperativeHandle, useState } from "react";
import { Form, Input, Modal, ModalProps, Select, message } from "antd";
import { reqAddAiModel } from "@/api/aiModel";
import { AddAiModelReq, EditAiModelReq } from "@/api/aiModel/types";
import { CoursePageRes } from "@/api/course/course/types";

interface AddAiModelModalProps extends ChildCallback, ModalProps {
  subjects: Omit<CoursePageRes, "disabled">[];
}
const AddAiModelModal = forwardRef<ChildRef, AddAiModelModalProps>(function Child(props, ref) {
  useImperativeHandle(
    ref,
    () => {
      return { setShow, setConfirmLoading };
    },
    []
  );
  const { subjects, callback, ...modalProps } = props;
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [aiModelForm] = Form.useForm<EditAiModelReq>();

  const addAiModel = async (values: AddAiModelReq) => {
    setConfirmLoading(true);
    const res = await reqAddAiModel(values);
    if (res.code === 200) {
      message.success("新增模型成功");
      setShow(false);
      aiModelForm.resetFields();
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
        aiModelForm.validateFields().then((values) => {
          values.id ? null : addAiModel(values);
        });
      }}>
      <Form autoComplete="off" form={aiModelForm}>
        <Form.Item name="id" hidden>
          <div></div>
        </Form.Item>
        <Form.Item
          label="所属学科"
          name="subjectId"
          rules={[{ required: true, message: "请选择所属学科" }]}>
          <Select
            options={subjects}
            fieldNames={{ value: "id", label: "subjectName" }}
            placeholder="请选择所属学科"></Select>
        </Form.Item>
        <Form.Item label="模型名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入模型名称" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddAiModelModal;
