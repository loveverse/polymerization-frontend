import { forwardRef, useImperativeHandle, useState } from "react";
import { Form, FormInstance, Input, Modal, ModalProps, message } from "antd";
import { reqAddDimensionality } from "@/api/system";
import { AddDimensionalityReq, EditDimensionalityReq } from "@/api/system/types";

export interface DimensionalityModalRef extends ChildRef {
  dimensionalityForm: FormInstance<EditDimensionalityReq>;
}
interface DimensionalityModalProps extends ModalProps, ChildCallback {}
const DimensionalityModal = forwardRef<DimensionalityModalRef, DimensionalityModalProps>(
  function Child(props, ref) {
    useImperativeHandle(
      ref,
      () => {
        return {
          setShow,
          setConfirmLoading,
          dimensionalityForm,
        };
      },
      []
    );
    const { callback, ...modalProps } = props;
    const [show, setShow] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [dimensionalityForm] = Form.useForm();
    const addDimensionality = async (values: AddDimensionalityReq) => {
      setConfirmLoading(true);
      const res = await reqAddDimensionality(values);
      if (res.code === 200) {
        setShow(false);
        dimensionalityForm.resetFields();
        message.success("新增测评维度成功");
        callback();
      } else {
        message.error(res.message);
      }
      setConfirmLoading(false);
    };
    const editDimensionality = async (values: EditDimensionalityReq) => {
      setConfirmLoading(true);
      const res = await reqAddDimensionality(values);
      if (res.code === 200) {
        setShow(false);
        dimensionalityForm.resetFields();
        message.success("编辑测评维度成功");
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
          dimensionalityForm
            .validateFields()
            .then((values) => {
              values.id ? editDimensionality(values) : addDimensionality(values);
            })
            .catch((err) => {
              console.error(err);
            });
        }}>
        <Form form={dimensionalityForm} autoComplete="off">
          <Form.Item name="id" hidden>
            <div />
          </Form.Item>
          <Form.Item label="测评维度名称" name="dimensionName" rules={[{ required: true }]}>
            <Input placeholder="请输入测评维度名称" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);

export default DimensionalityModal;
