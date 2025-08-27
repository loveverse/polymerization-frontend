<template>
  <div class="server-error-container">
    <el-result icon="warning" title="500" sub-title="对不起，服务出了点问题。">
      <template #extra>
        <el-space size="large">
          <el-button type="primary" @click="goToHome">返回首页</el-button>
          <el-button type="primary" @click="goBack">返回上一页</el-button>
        </el-space>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts" name="ServerError">
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
.server-error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}
</style>
