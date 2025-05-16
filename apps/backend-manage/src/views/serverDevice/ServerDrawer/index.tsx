import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { reqSchoolPage } from "@/api/school";
import { SchoolPageRes } from "@/api/school/types";
import { reqAddServer, reqEditServer } from "@/api/server";
import { AddServerReq, EditServerReq } from "@/api/server/types";
import {
  Button,
  Drawer,
  DrawerProps,
  Form,
  FormInstance,
  Input,
  Select,
  Space,
  message,
} from "antd";

export interface ServerDrawerProps extends ChildCallback, DrawerProps {}
export interface ServerDrawerRef extends ChildRef {
  serverForm: FormInstance<EditServerReq>;
}
const ServerDrawer = forwardRef<ServerDrawerRef, ServerDrawerProps>(function Child(props, ref) {
  useImperativeHandle(
    ref,
    () => {
      return {
        setShow,
        setConfirmLoading,
        serverForm,
      };
    },
    []
  );
  const { callback, ...drawerProps } = props;
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [serverForm] = Form.useForm();
  const addServer = async (values: AddServerReq) => {
    setConfirmLoading(true);
    const res = await reqAddServer(values);
    if (res.code === 200) {
      setShow(false);
      message.success("添加服务器成功");
      serverForm.resetFields();
      callback();
    } else {
      message.error(res.message);
    }
    setConfirmLoading(false);
  };
  const editServer = async (values: EditServerReq) => {
    setConfirmLoading(true);
    const res = await reqEditServer(values);
    if (res.code === 200) {
      setShow(false);
      message.success("编辑服务器成功");
      serverForm.resetFields();
      callback();
    } else {
      message.error(res.message);
    }
    setConfirmLoading(false);
  };
  const [schoolData, setSchoolData] = useState<SchoolPageRes[]>([]);
  const fetchSchoolPage = async () => {
    const res = await reqSchoolPage({
      current: 1,
      size: 1000,
      data: {},
    });
    if (res.code === 200) {
      setSchoolData(res.data.data);
    } else {
      message.error(res.message);
    }
  };
  useEffect(() => {
    if (show) {
      fetchSchoolPage();
    }
  }, [show]);

  return (
    <Drawer
      {...drawerProps}
      open={show}
      width={520}
      onClose={() => setShow(false)}
      extra={
        <Space size={15}>
          <Button onClick={() => setShow(false)}>取消</Button>
          <Button
            type="primary"
            loading={confirmLoading}
            onClick={() => {
              serverForm
                .validateFields()
                .then((values) => {
                  values.id ? editServer(values) : addServer(values);
                })
                .catch((err) => {
                  console.error(err);
                });
            }}>
            确定
          </Button>
        </Space>
      }>
      <Form form={serverForm} autoComplete="off" labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <div />
        </Form.Item>
        <Form.Item label="学校/机构" name="schoolId" rules={[{ required: true }]}>
          <Select
            options={schoolData}
            fieldNames={{ label: "schoolName", value: "id" }}
            placeholder="请选择学校/机构"></Select>
        </Form.Item>
        <Form.Item label="服务器名称" name="serverName" rules={[{ required: true }]}>
          <Input placeholder="请输入服务器名称" />
        </Form.Item>
        <Form.Item label="IP地址" name="serverIp" rules={[{ required: true }]}>
          <Input placeholder="请输入IP地址" />
        </Form.Item>
        <Form.Item label="设备号" name="deviceCode" rules={[{ required: true }]}>
          <Input placeholder="请输入设备号" />
        </Form.Item>
        <Form.Item label="静态资源前缀" name="staticPrefix" rules={[{ required: true }]}>
          <Input placeholder="请输入静态资源前缀" />
        </Form.Item>
        <Form.Item label="上传文件前缀" name="uploadPrefix" rules={[{ required: true }]}>
          <Input placeholder="请输入上传文件前缀" />
        </Form.Item>
        <Form.Item label="推送前缀" name="pushPrefix" rules={[{ required: true }]}>
          <Input placeholder="请输入推送前缀" />
        </Form.Item>
      </Form>
    </Drawer>
  );
});

export default ServerDrawer;
