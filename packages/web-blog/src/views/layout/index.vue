<template>
  <div class="app" :class="{ dark: isDark }">
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
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"
import BackToTop from "@/components/BackToTop/index.vue"

const isDark = ref(false)


const toggleTheme = () => {
  isDark.value = !isDark.value
  const theme = isDark.value ? "dark" : "light"
  localStorage.setItem("theme", theme)
  document.documentElement.classList.toggle('dark', isDark.value)
}

onMounted(() => {
  // 检查本地存储中的主题偏好
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  const shouldDark = savedTheme === "dark" || (!savedTheme && prefersDark)
  isDark.value = shouldDark
  document.documentElement.classList.toggle('dark', shouldDark)
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.app {
  position: relative;
  overflow-x: clip; // 防止装饰元素造成横向滚动
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main-container {
  /* 预留与固定头部相同的空间，避免被覆盖并保持布局稳定 */
  padding-top: 64px;
  padding-bottom: 2rem;
  flex: 1;
  width: 100%;
}

.glass-footer {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

.dark .glass-footer {
  background: rgba(30, 30, 30, 0.5);
}
</style>
