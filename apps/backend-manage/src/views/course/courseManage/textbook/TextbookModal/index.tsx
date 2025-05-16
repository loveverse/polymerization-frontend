import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  FormInstance,
  ModalProps,
  Form,
  Modal,
  Input,
  Select,
  Upload,
  message,
  UploadProps,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAppContext } from "@/context";
import { reqUploadFile } from "@/api/base";
import { GradeListRes } from "@/api/base/types";
import { reqTextbookVersionList } from "@/api/course/subject";
import { TextbookVersionListRes } from "@/api/course/subject/types";
import { reqEditTextbook } from "@/api/course/course/textbook";
import { EditTextbookReq } from "@/api/course/course/textbook/types";

export interface TextbookChildRef extends ChildRef {
  textbookForm: FormInstance<EditTextbookReq>;
}
interface TextbookChildProps extends ChildCallback, ModalProps {
  gradeOptions: GradeListRes[];
  courseId: string;
}
const TextbookModal = forwardRef<TextbookChildRef, TextbookChildProps>(function Child(props, ref) {
  useImperativeHandle(
    ref,
    () => {
      return {
        setShow,
        setConfirmLoading,
        textbookForm,
      };
    },
    []
  );
  const { gradeOptions, courseId, callback, ...modalProps } = props;
  const { dicts } = useAppContext();
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [textbookForm] = Form.useForm<EditTextbookReq>();
  const volumeType = Form.useWatch("volumeType", textbookForm) || "";

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const uploadProps: UploadProps = {
    accept: ".png,.jpg",
    maxCount: 1,
    listType: "picture-card",
    fileList: [],
    beforeUpload: (file) => {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 30) {
        message.warning("上传的封面大于30M，请重新上传！");
        return false;
      }
      return true;
    },
    customRequest(options) {
      const formData = new FormData();
      formData.append("file", options.file);
      reqUploadFile(formData)
        .then((res) => {
          if (res.code === 200) {
            options.onSuccess?.(res.data.url);
            message.success("上传头像成功");
          } else {
            options.onError?.(new Error());
            message.error("上传头像失败");
          }
        })
        .catch((error) => {
          console.error(error);
          message.error("上传头像失败");
        });
    },
  };
  const [textbookVersionList, setTextbookVersionList] = useState<TextbookVersionListRes[]>([]);
  const fetchTextbookList = async () => {
    const res = await reqTextbookVersionList({ current: 1, size: 10000, data: {} });
    if (res.code === 200) {
      setTextbookVersionList(res.data.data);
    } else {
      message.error(res.message);
    }
  };

  const addTextbook = async (values: EditTextbookReq) => {
    setConfirmLoading(true);
    // 创建时，默认关闭
    const res = await reqEditTextbook({ ...values, courseId, disabled: 1 });
    if (res.code === 200) {
      setShow(false);
      callback();
      textbookForm.resetFields();
      message.success("添加教材成功");
    } else {
      message.error(res.message);
    }
    setConfirmLoading(false);
  };
  const updateTextbook = async (values: EditTextbookReq) => {
    setConfirmLoading(true);
    const res = await reqEditTextbook({ ...values, courseId });
    if (res.code === 200) {
      setShow(false);
      callback();
      message.success("修改教材信息成功");
    } else {
      message.error(res.message);
    }
    setConfirmLoading(false);
  };
  useEffect(() => {
    if (show && !textbookVersionList.length) {
      fetchTextbookList();
    }
  }, [show]);

  return (
    <Modal
      {...modalProps}
      open={show}
      confirmLoading={confirmLoading}
      onCancel={() => setShow(false)}
      onOk={() => {
        textbookForm
          .validateFields()
          .then((values) => {
            console.log(values);

            if (Array.isArray(values.img)) {
              values.img = values.img.length
                ? values.img[0].response || values.img[0].url
                : undefined;
            }
            values.id ? updateTextbook(values) : addTextbook(values);
          })
          .catch((err) => {
            console.error(err);
          });
      }}>
      <Form form={textbookForm} autoComplete="off" labelCol={{ span: 5 }}>
        <Form.Item hidden name="id">
          <div></div>
        </Form.Item>
        <Form.Item label="教材名称" name="textbookName" rules={[{ required: true }]}>
          <Input placeholder="请输入教材名称" maxLength={255} />
        </Form.Item>
        <Form.Item label="版本" name="versionId" rules={[{ required: true }]}>
          <Select
            options={textbookVersionList}
            fieldNames={{ value: "id", label: "versionName" }}
            placeholder="请选择教材版本"></Select>
        </Form.Item>
        <Form.Item
          label="册级"
          name="volumeType"
          rules={[{ required: true, message: "请选择册级" }]}>
          <Select options={dicts.getDict("textbook_volume")} placeholder="请选择册级"></Select>
        </Form.Item>
        <Form.Item
          label="应用年级"
          name="gradeId"
          rules={[{ required: true, message: "请选择应用年级" }]}>
          <Select
            options={gradeOptions}
            placeholder="请选择应用年级"
            fieldNames={{ label: "gradeName", value: "id" }}></Select>
        </Form.Item>
        {/* {volumeType ? (
          <Form.Item
            name="img"
            label={"上传" + dicts.getLabel("textbook_volume", volumeType)}
            valuePropName="fileList">
            <Upload {...uploadProps}>
              <button style={{ border: 0, background: "none" }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传封面</div>
              </button>
            </Upload>
          </Form.Item>
        ) : null} */}
      </Form>
    </Modal>
  );
});

export default TextbookModal;
