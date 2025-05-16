import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  Modal,
  ModalProps,
  Row,
  Select,
  message,
} from "antd";
import styles from "./index.module.scss";
import { AddExperimentStepReq } from "@/api/aiModel/types";

interface AddStepModalProps extends ChildProps, ModalProps {
  modelTags: [];
}
export interface AddStepModalRef extends ChildRef {
  stepForm: FormInstance<AddExperimentStepReq["list"][0]>;
}

const AddStepModal = forwardRef<AddStepModalRef, AddStepModalProps>(function Child(props, ref) {
  useImperativeHandle(
    ref,
    () => {
      return {
        setShow,
        setConfirmLoading,
        stepForm,
      };
    },
    []
  );
  const { handleSubmit, modelTags, ...modalProps } = props;
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [stepForm] = Form.useForm();
  return (
    <Modal
      {...modalProps}
      width="70%"
      open={show}
      rootClassName={styles["root"]}
      confirmLoading={confirmLoading}
      onCancel={() => setShow(false)}
      onOk={() => {
        stepForm
          .validateFields()
          .then((values) => {
            if (!values.evaluates) {
              message.warning("请添加评分标准！");
              return;
            }
            handleSubmit(values);
          })
          .catch((err) => console.error(err));
      }}>
      <Form autoComplete="off" layout="vertical" form={stepForm} className="step-form">
        <Form.Item label="操作要求" name="requirements" rules={[{ required: true }]}>
          <Input.TextArea placeholder="请输入操作要求" rows={4} />
        </Form.Item>
        <Form.Item name="sn" hidden>
          <div></div>
        </Form.Item>
        <Form.List name="evaluates">
          {(fields, { add, remove }) => (
            <div className="standard-list">
              <div className="standard-list-header">
                <Row gutter={40}>
                  <Col span={3}>序号</Col>
                  <Col span={8}>评分标准</Col>
                  <Col span={8}>模型标签</Col>
                  <Col span={5}>操作</Col>
                </Row>
              </div>
              {fields.map((field, index) => (
                <div key={field.key} className="standard-item">
                  <Row gutter={40}>
                    <Col span={3} className="num">
                      <Form.Item name={[field.name, "sn"]} noStyle>
                        {index + 1}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name={[field.name, "evaluateContent"]} noStyle>
                        <Input placeholder="请输入评分标准" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name={[field.name, "tags"]} noStyle>
                        <Select
                          showSearch={false}
                          options={modelTags}
                          mode="multiple"
                          fieldNames={{ value: "id", label: "name" }}
                          style={{ width: "80%" }}
                          placeholder="请选择模型标签"></Select>
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Button
                        type="link"
                        danger
                        onClick={() => {
                          remove(field.name);
                          const steps = stepForm.getFieldValue("evaluates");
                          steps.forEach((item: any, index: number) => {
                            item.sn = index;
                          });
                          stepForm.setFieldValue("evaluates", steps);
                        }}>
                        删除
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
              <Button
                type="dashed"
                block
                className="create-standard-btn"
                onClick={() => {
                  add({ sn: fields.length, tags: [] });
                }}>
                新建评分标准
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
});

export default AddStepModal;
