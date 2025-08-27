<template>
  <div class="not-auth-container">
    <el-result icon="warning" title="403" sub-title="对不起，您没有权限访问此页面。">
      <template #extra>
        <el-space size="large">
          <el-button type="primary" @click="goToHome">返回首页</el-button>
          <el-button type="primary" @click="goBack">返回上一页</el-button>
        </el-space>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts" name="NotAuth">
import { ElResult, ElButton, ElSpace } from "element-plus"
import { useRouter } from "vue-router"

const router = useRouter()

// 返回首页
const goToHome = () => {
  router.push("/home")
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}
</style>
