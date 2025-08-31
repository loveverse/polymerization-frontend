<template>
  <button
    class="back-to-top"
    :class="{ 'back-to-top-visible': isVisible }"
    @click="scrollToTop"
    aria-label="回到顶部">
    <el-icon>
      <ArrowUp />
    </el-icon>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { ArrowUp } from "@element-plus/icons-vue"

const isVisible = ref(false)

// 监听滚动事件
const handleScroll = () => {
  isVisible.value = window.scrollY > 500
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener("scroll", handleScroll)
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<style scoped lang="scss">
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  visibility: hidden;
  z-index: 900;

  .el-icon {
    font-size: 1.2rem;
  }

  &.back-to-top-visible {
    opacity: 1;
    visibility: visible;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
}
</style>
