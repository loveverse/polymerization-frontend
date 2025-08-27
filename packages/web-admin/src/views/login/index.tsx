import { useEffect, useState } from "react"
import { Button, Form, Input, message } from "antd"
import { LockOutlined, UserOutlined } from "@ant-design/icons"

import { v4 as uuidV4 } from "uuid"

import { Navigate, useNavigate } from "react-router-dom"

import styles from "./index.module.scss"

import loginLeft from "@/assets/imgs/ikon.png"
import { reqLogin } from "@/api/login"
import { LoginInfoReq } from "@/api/login/types"
import { domain, password, username } from "@/config"

function Login() {
  const navigate = useNavigate()
  const [form] = Form.useForm<LoginInfoReq>()
  const [loading, setLoading] = useState<boolean>(false)

  // 登录
  const onFinish = async (loginForm: LoginInfoReq) => {
    const params: LoginInfoReq = {
      loginType: "teacher",
      loginDevice: "pc",
      ...loginForm,
    }
    setLoading(true)
    const res = await reqLogin(params)
    if (res.code === 200) {
      localStorage.setItem("backend-token", res.data.token)
      localStorage.setItem("userInfo", JSON.stringify(res.data.user))
      message.success("登录成功")
      navigate("/module")
    } else {
      message.error(res.msg)
    }
    setLoading(false)
  }
  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed:", errorInfo)
  }
  const [captchaImg, setCaptchaImg] = useState("")
  const generateCaptchaImg = () => {
    const uuid = uuidV4()
    form.setFieldValue("captchaKey", uuid)
    setCaptchaImg(`${domain}/auth-api/v1/auth/captcha/${uuid}?w=100&h=30`)
  }
  useEffect(() => {
    generateCaptchaImg()
  }, [])

  const token = localStorage.getItem("backend-token")
  if (token) {
    return <Navigate to="/module" replace />
  }
  return (
    <div className={styles.root}>
      <div className="login-box">
        <div className="login-left">
          <img src={loginLeft} alt="login" />
        </div>
        <div className="login-form">
          <div className="login-logo">
            <span className="logo-text">后台管理</span>
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
            {process.env.REACT_APP_CAPTCHA_ENABLE === "true" ? (
              <>
                <Form.Item>
                  <Form.Item
                    name="captchaCode"
                    rules={[{ required: true, message: "请输入验证码" }]}
                    style={{ display: "inline-block", width: "calc(50% - 8px)" }}>
                    <Input placeholder="请输入验证码" prefix={<LockOutlined />} />
                  </Form.Item>
                  <img
                    src={captchaImg}
                    alt="验证码"
                    className="captcha-img"
                    onClick={generateCaptchaImg}
                  />
                </Form.Item>
                <Form.Item name="captchaKey" hidden={true}>
                  <div></div>
                </Form.Item>
              </>
            ) : null}
            <Form.Item className="login-btn">
              <Button loading={loading} type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Login
