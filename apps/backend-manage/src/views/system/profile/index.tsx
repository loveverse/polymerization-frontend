import { useEffect } from "react";
import {
  Avatar,
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Radio,
  Space,
  Tabs,
  TabsProps,
  Tag,
  Upload,
  UploadProps,
  message,
} from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context";
import { reqUpdateUserInfo, reqUpdateUserPassword, reqUploadFile } from "@/api/base";
import { UpdateUserPasswordReq, UserInfo } from "@/api/base/types";
import styles from "./index.module.scss";

const Profile = () => {
  const { dicts, userInfo, setUserInfo } = useAppContext();
  const navigate = useNavigate();
  const [baseForm] = Form.useForm<UserInfo>();
  const userRoles = Form.useWatch("roles", baseForm) || [];
  const userAvator = Form.useWatch("headImg", baseForm);
  const updateUserInfo = async (values: UserInfo) => {
    const res = await reqUpdateUserInfo(values);
    if (res.code === 200) {
      setUserInfo(values);
      message.success("修改用户信息成功");
    } else {
      message.error(res.message);
    }
  };
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const uploadProps: UploadProps = {
    accept: ".png,.jpg",
    maxCount: 1,
    listType: "picture-circle",
    fileList: [],
    showUploadList: false,
    beforeUpload: (file) => {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 30) {
        message.warning("上传的头像大于30M，请重新上传！");
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
            baseForm.setFieldValue("headImg", res.data.url);
            options.onSuccess?.(res.data);
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

  const [passwordForm] = Form.useForm();
  const updateUserPassword = async (values: UpdateUserPasswordReq) => {
    const res = await reqUpdateUserPassword(values);
    if (res.code === 200) {
      localStorage.removeItem("backend-token");
      navigate("/login");
      message.success("修改密码成功");
    } else {
      message.error(res.message);
    }
  };
  const navbar: TabsProps["items"] = [
    {
      key: "base",
      label: "基础信息",
      children: (
        <Form
          form={baseForm}
          autoComplete="off"
          variant="filled"
          labelCol={{ span: 5 }}
          labelAlign="left"
          className="base-form"
          initialValues={{ gender: "M" }}
          onFinish={updateUserInfo}
          onFinishFailed={(err) => console.error(err)}>
          <Form.Item hidden name="id">
            <div></div>
          </Form.Item>
          <Form.Item name="headImg" getValueFromEvent={normFile}>
            <Upload {...uploadProps}>
              <Avatar src={userAvator} alt="avatar" style={{ width: "100%", height: "100%" }} />
            </Upload>
          </Form.Item>
          <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
            <Input placeholder="请输入用户名" disabled />
          </Form.Item>
          <Form.Item label="昵称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item label="性别" name="gender" rules={[{ required: true }]}>
            <Radio.Group options={dicts.getDict("gender")}></Radio.Group>
          </Form.Item>
          <Form.Item label="角色" name="roles">
            <Space>
              {userRoles.map((item: UserInfo["roles"][0], index: number) => {
                return (
                  <Tag key={index} color="processing">
                    {item.roleName}
                  </Tag>
                );
              })}
            </Space>
          </Form.Item>
          <Form.Item label="职务" name="title">
            <Input placeholder="请输入职务" />
          </Form.Item>
          <Form.Item label="手机号" name="phoneNumber">
            <InputNumber placeholder="请输入手机号" controls={false} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item>
            <Space size={50}>
              <div>
                账号ID：<b>{userInfo?.id}</b>
              </div>
              <div>
                注册时间：<b>{dayjs(userInfo?.createTime).format("YYYY/MM/DD HH:mm")}</b>
              </div>
            </Space>
          </Form.Item>
          <Form.Item>
            <Flex justify="end">
              <Space>
                <Button>重置</Button>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Space>
            </Flex>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "safety",
      label: "安全设置",
      children: (
        <Form
          form={passwordForm}
          autoComplete="off"
          variant="filled"
          labelCol={{ span: 5 }}
          labelAlign="left"
          className="safety-form"
          onFinish={updateUserPassword}>
          <Form.Item hidden name="id">
            <div></div>
          </Form.Item>
          <Form.Item label="旧密码" name="oldPassword" rules={[{ required: true }]}>
            <Input.Password placeholder="请输入旧密码" />
          </Form.Item>
          <Form.Item label="新密码" name="newPassword" rules={[{ required: true }]}>
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            label="再次输入"
            name="newPassword2"
            dependencies={["newPassword"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("再次输入的密码与新密码不一致!"));
                },
              }),
            ]}>
            <Input.Password placeholder="再次输入新密码" />
          </Form.Item>
          <Form.Item>
            <Flex justify="end">
              <Button type="primary" htmlType="submit">
                修改密码
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      ),
    },
  ];

  useEffect(() => {
    baseForm.setFieldsValue({
      id: userInfo?.id,
      username: userInfo?.username,
      name: userInfo?.name,
      gender: userInfo?.gender,
      roles: userInfo?.roles,
      title: userInfo?.title,
      phoneNumber: userInfo?.phoneNumber,
      email: userInfo?.email,
      headImg: userInfo?.headImg,
    });
    passwordForm.setFieldValue("id", userInfo?.id);
  }, []);

  return (
    <div className={styles["root"]}>
      <Tabs items={navbar} className="navbar-box tabs-box"></Tabs>
    </div>
  );
};

export default Profile;
