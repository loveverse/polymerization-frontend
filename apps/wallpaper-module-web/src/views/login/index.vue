<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <img src="@/assets/imgs/ikon.png" alt="login"/>
      </div>
      <div class="login-form">
        <div class="login-logo">
          <span class="logo-text">登录</span>
          <div class="underline"></div>
        </div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入账号"
              :prefix-icon="User"
              maxlength="255"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              maxlength="255"
              show-password
            />
          </el-form-item>
          <el-form-item prop="captcha">
            <el-space>
              <el-input v-model="loginForm.captcha" placeholder="请输入验证码"
                        :prefix-icon="Position"/>
              <img class="hand" :src="captchaImg" @click="generateCaptchaImg" alt="验证码"/>
            </el-space>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              @click="handleLogin"
              style="width: 100%"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {Base64} from 'js-base64'
import {ElMessage, FormInstance} from 'element-plus'

import {reqLogin, reqUserInfo} from '@/api/login/index.ts'
import {username, password, domain} from '../../../config'
import {User, Lock, Position} from "@element-plus/icons-vue";
import {v4 as uuidV4} from "uuid"


const router = useRouter()

const loginForm = reactive({
  username: username,
  password: password,
  captcha: ""
})

const loginRules = reactive({
  username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
  password: [{required: true, message: '请输入密码', trigger: 'blur'}],
  captcha: [{required: true, message: '请输入验证码', trigger: 'blur'}]
})

const captchaImg = ref("")


const loading = ref(false)
const loginFormRef = ref<FormInstance>()

// 登录处理
const handleLogin = () => {
  loginFormRef.value?.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const res = await reqLogin({
        ...loginForm,
        loginType: "teacher",
        loginDevice: "pc",
        password: Base64.encode(loginForm.password),
      })

      if (res.code === 200) {
        const {token} = res.data
        localStorage.setItem("token", token)

      } else {
        ElMessage.error(res.msg)
      }
    } catch (error) {
      console.error(error)
      ElMessage.error('登录失败，请重试')
    } finally {
      loading.value = false
    }
  })
}
const generateCaptchaImg = () => {
  captchaImg.value = `${domain}/auth-api/auth/v1/captcha/${uuidV4()}?w=100&h=30`
}
// 如果已登录，直接跳转
onMounted(() => {
  generateCaptchaImg()
})
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 550px;
  height: 100vh;
  min-height: 500px;
  background-color: #fff;

  .login-box {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 10px;

    .login-left {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52%;
      height: 100%;
      padding: 0 100px;
      box-sizing: border-box;
      background: linear-gradient(
          180deg,
          rgba(14, 100, 244, 0.02) 0%,
          rgba(14, 100, 244, 0.08) 100%
      );

      img {
        width: 90%;
      }
    }

    .login-form {
      margin: auto;
      border-radius: 10px;

      .login-logo {
        width: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 40px;

        .login-icon {
          width: 70px;
        }

        .logo-text {
          font-size: 40px;
          font-weight: bold;
          white-space: nowrap;
        }

        .underline {
          margin-top: 20px;
          width: 100px;
          height: 6px;
          background-color: #4187ff;
          border-radius: 6px;
        }
      }

      .ant-form-item {
        height: 75px;
        margin-bottom: 0;

        .ant-input-prefix {
          margin-right: 10px;
        }

        .ant-input-affix-wrapper-lg {
          padding: 8.3px 11px;
        }

        .ant-input-affix-wrapper,
        .ant-input-lg {
          font-size: 14px;
        }

        .ant-input-affix-wrapper {
          color: #aaa;
          background-color: #f5f5f5;
        }

        .ant-input {
          background-color: transparent !important;
        }
      }

      .login-btn {
        width: 100%;
        margin-top: 10px;

        .ant-form-item-control-input-content {
          .ant-btn {
            border-radius: 143px;
          }
        }
      }
    }
  }

}

</style>
