<template>
  <div class="app-container" :class="{ dark: isDark }">
    <!-- 背景装饰 -->
    <div class="bg-element bg-primary"></div>
    <div class="bg-element bg-secondary"></div>

    <Header :is-dark="isDark" @toggle-theme="toggleTheme" />

    <main class="container main-container">
      <router-view />
    </main>

    <Footer />

    <BackToTop />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import Header from "./components/header/index.vue"
import Footer from "./components/footer/index.vue"
import BackToTop from "@/components/BackToTop/index.vue"

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  const theme = isDark.value ? "dark" : "light"
  localStorage.setItem("theme", theme)
  document.documentElement.classList.toggle("dark", isDark.value)
}

onMounted(() => {
  // 检查本地存储中的主题偏好
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  const shouldDark = savedTheme === "dark" || (!savedTheme && prefersDark)
  isDark.value = shouldDark
  document.documentElement.classList.toggle("dark", shouldDark)
})
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  //overflow-x: clip; // 防止装饰元素造成横向滚动
  //height: 100%;
  display: flex;
  flex-direction: column;

  .main-container {
    /* 预留与固定头部相同的空间，避免被覆盖并保持布局稳定 */
    padding-top: 60px;
    //padding-bottom: 60px;
    flex: 1;
  }
}


</style>
