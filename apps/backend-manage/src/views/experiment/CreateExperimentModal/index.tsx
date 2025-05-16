import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { reqAddExperiment, reqAiModelList, reqEditExperiment } from "@/api/aiModel";
import { AddExperimentReq, AiModelListRes } from "@/api/aiModel/types";
import { Form, Input, Modal, ModalProps, Radio, Select, message } from "antd";
import { FormInstance } from "antd/lib";

import { useIds } from "@/store";

interface CreateExperimentModalProps extends ModalProps, ChildCallback {}
export interface AddOrEditExerpimentRef extends ChildRef {
  experimentForm: FormInstance;
}

const CreateExperimentModal = forwardRef<AddOrEditExerpimentRef, CreateExperimentModalProps>(
  
  function Child(props, ref) {
    useImperativeHandle(
      ref,
      () => {
        return {
          setShow,
          setConfirmLoading,
          experimentForm,
        };
      },
      []
    );
    const { ids } = useIds();
    const { callback, ...modalProps } = props;
    const [show, setShow] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [experimentForm] = Form.useForm();
    const [aiModelList, setAiModelList] = useState<AiModelListRes["aiModels"]>([]);
    
    const fetchAiModelList = async () => {
      const res = await reqAiModelList();
      if (res.code === 200) {
        const modelInfo = res.data.find((k) => k.subjectDto.id === ids.course.courseId);
        if (modelInfo) {
          setAiModelList(modelInfo.aiModels);
        }
      } else {
        message.error(res.message);
      }
    };
    const addExperiment = async (values: AddExperimentReq) => {
      setConfirmLoading(true);
      const res = await reqAddExperiment({
        ...values,
        subjectId: ids.course.courseId,
        chapterId: ids.node.chapterId,
        gradeId: ids.textbook.gradeId,
        type: "company",
      });
      if (res.code === 200) {
        message.success("创建实验成功！");
        setShow(false);
        callback();
      } else {
        message.error(res.message);
      }
      setConfirmLoading(false);
    };
    const editExperiment = async (values: AddExperimentReq) => {
      setConfirmLoading(true);
      const res = await reqEditExperiment({
        ...values,
        subjectId: ids.course.courseId,
        chapterId: ids.node.chapterId,
        gradeId: ids.textbook.gradeId,
        type: "company",
      });
      if (res.code === 200) {
        message.success("编辑实验成功！");
        setShow(false);
        callback();
      } else {
        message.error(res.message);
      }
      setConfirmLoading(false);
    };

    useEffect(() => {
      if (show) {
        fetchAiModelList();
      }
    }, [show]);

    return (
      <Modal
        {...modalProps}
        open={show}
        confirmLoading={confirmLoading}
        onCancel={() => setShow(false)}
        onOk={() => {
          experimentForm
            .validateFields()
            .then((values) => {
              values.id ? editExperiment(values) : addExperiment(values);
            })
            .catch((err) => {
              console.error(err);
            });
        }}>
        <Form form={experimentForm} autoComplete="off" labelCol={{ span: 5 }}>
          <Form.Item name="id" hidden>
            <div />
          </Form.Item>
          <Form.Item label="实验名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入实验名称" />
          </Form.Item>
          <Form.Item label="AI模型" name="aiId" rules={[{ required: true }]}>
            <Select
              options={aiModelList}
              fieldNames={{ value: "key", label: "value" }}
              placeholder="请选择对应AI模型"></Select>
          </Form.Item>
          <Form.Item label="是否AI评分" name="enableAi">
            <Radio.Group
              options={[
                { label: "是", value: true },
                { label: "否", value: false },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);

export default CreateExperimentModal;
