<template>
  <div class="not-found-container">
    <el-result icon="warning" title="404" sub-title="对不起，您访问的页面不存在。">
      <template #extra>
        <el-space size="large">
          <el-button type="primary" @click="goToHome">返回首页</el-button>
          <el-button type="primary" @click="goBack">返回上一页</el-button>
        </el-space>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts" name="NotFound">
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
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}
</style>
