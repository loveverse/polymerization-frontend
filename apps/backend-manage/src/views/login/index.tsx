import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Navigate, useNavigate } from "react-router-dom";

import styles from "./index.module.scss";

import loginLeft from "@/assets/imgs/ikon.png";
import { reqLogin } from "@/api/login";
import { ReqLoginForm } from "@/api/login/types";
import { username, password } from "@/config/index";
import { reqUserInfo } from "@/api/base";
import { useAppContext } from "@/context";

function Login() {
  const token = localStorage.getItem("backend-token");
  if (token) {
    return <Navigate to="/home" replace />;
  }

  const { setUserInfo } = useAppContext();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  // 登录
  const onFinish = async (loginForm: ReqLoginForm) => {
    const params: ReqLoginForm = {
      loginType: "teacher",
      loginDevice: "pc",
      ...loginForm,
    };
    setLoading(true);
    const res = await reqLogin(params);
    if (res.code === 200) {
      const { token } = res.data;
      localStorage.setItem("backend-token", token);
      const res2 = await reqUserInfo();
      if (res2.code === 200) {
        setUserInfo(res2.data);
        navigate("/home");
        message.success("登录成功");
      } else {
        message.error("获取用户信息失败");
      }
    } else {
      message.error(res.message);
    }
    setLoading(false);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed:", errorInfo);
  };
  return (
    <div className={styles.root}>
      <div className="login-box">
        <div className="login-left">
          <img src={loginLeft} alt="login" />
        </div>
        <div className="login-form">
          <div className="login-logo">
            <span className="logo-text">具身课程管理端</span>
            <div className="underline"></div>
          </div>
          <Form
            form={form}
            autoComplete="off"
            size="large"
            initialValues={{ username: username, password: password }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}>
            <Form.Item name="username" rules={[{ required: true, message: "请输入用户名" }]}>
              <Input placeholder="请输入账号" prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
              <Input.Password placeholder="请输入密码" prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item className="login-btn">
              <Button loading={loading} type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default Login;
