import {useEffect} from "react";
import {
  App, Avatar,
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Radio,
  Space,
  Tabs,
  TabsProps,
  Tag, Upload,
  UploadProps,
} from "antd";
import {useNavigate} from "react-router-dom";
import {useAppContext} from "@/context";
import {reqUpdateUserPassword, reqUploadFile} from "@/api/base";
import {UpdateUserPasswordReq} from "@/api/base/types";
import styles from "./index.module.scss";
import {DrawerControlsProps} from "@/hooks/useDrawerControls";
import {reqUpdateUser} from "@/api/system";
import {UpdateUserReq, UserInfoRes} from "@/api/system/types";
import {use} from "echarts/core";


const UserCenterDrawer = (props: DrawerControlsProps) => {
  const {drawerProps, actions, refresh} = props
  const {message} = App.useApp()
  const {dict, userInfo, setUserInfo} = useAppContext();
  const navigate = useNavigate();

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
      message.error(res.msg);
    }
  };

  const [userForm] = Form.useForm<Omit<UpdateUserReq, "roleIds">>();
  const updateUserInfo = async (values: UpdateUserReq) => {
    values.roleIds = userInfo?.roleList.map(k => k.id)
    const res = await reqUpdateUser(values);
    if (res.code === 200) {
      message.success("修改用户信息成功");
      const {roleIds, ...rest} = values
      setUserInfo({...userInfo as UserInfoRes, ...rest});
    } else {
      message.error(res.msg);
    }
  };

  const navbar: TabsProps["items"] = [
    {
      key: "base",
      label: "基础信息",
      children: (
        <Form
          form={userForm}
          autoComplete="off"
          variant="filled"
          labelCol={{span: 5}}
          labelAlign="left"
          className="base-form"
          // initialValues={{sex: "M"}}
          onFinish={updateUserInfo}
          onFinishFailed={(err) => console.error(err)}>
          <Form.Item hidden name="id">
            <div></div>
          </Form.Item>
          <Form.Item name="headImg" getValueFromEvent={normFile}>
            <Upload {...uploadProps}>
              <Avatar src={userInfo?.avatar} alt="avatar" style={{width: "100%", height: "100%"}}/>
            </Upload>
          </Form.Item>
          <Form.Item label="用户名" name="username" rules={[{required: true}]}>
            <Input placeholder="请输入用户名" disabled/>
          </Form.Item>
          <Form.Item label="昵称" name="nickname" rules={[{required: true}]}>
            <Input placeholder="请输入昵称"/>
          </Form.Item>
          <Form.Item label="性别" name="sex" rules={[{required: true}]}>
            <Radio.Group options={dict.getDictItemList("sex_type")}></Radio.Group>
          </Form.Item>
          <Form.Item label="角色" name="roleIds">
            <Space>
              {userInfo?.roleList.map((item, index) => {
                return (
                  <Tag key={index} color="processing">
                    {item.roleName}
                  </Tag>
                );
              })}
            </Space>
          </Form.Item>
          <Form.Item label="手机号" name="phoneNumber">
            <InputNumber placeholder="请输入手机号" controls={false} style={{width: "100%"}}/>
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input placeholder="请输入邮箱"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              更新个人信息
            </Button>
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
          labelCol={{span: 5}}
          labelAlign="left"
          className="safety-form"
          onFinish={updateUserPassword}>
          <Form.Item hidden name="id">
            <div></div>
          </Form.Item>
          <Form.Item label="旧密码" name="oldPassword" rules={[{required: true}]}>
            <Input.Password placeholder="请输入旧密码"/>
          </Form.Item>
          <Form.Item label="新密码" name="newPassword" rules={[{required: true}]}>
            <Input.Password placeholder="请输入新密码"/>
          </Form.Item>
          <Form.Item
            label="再次输入"
            name="newPassword2"
            dependencies={["newPassword"]}
            rules={[
              {required: true},
              ({getFieldValue}) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("再次输入的密码与新密码不一致!"));
                },
              }),
            ]}>
            <Input.Password placeholder="再次输入新密码"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              修改密码
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  useEffect(() => {
    if (drawerProps.open) {
      userForm.setFieldsValue({
        id: userInfo?.id,
        username: userInfo?.username,
        nickname: userInfo?.nickname,
        sex: userInfo?.sex,
        avatar: userInfo?.avatar,
        email: userInfo?.email,
        status: userInfo?.status,
        phoneNumber: userInfo?.phoneNumber,
      })
    }
  }, [drawerProps.open]);
  return (
    <Drawer {...drawerProps} width={600} className={styles["root"]}>
      <Tabs items={navbar} className="navbar-box"></Tabs>
    </Drawer>
  );
};

export default UserCenterDrawer;
