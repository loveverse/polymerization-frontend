<template>
  <header class="header" :class="{ 'scrolled': isScrolled }">
    <nav class="nav glass">
      <div class="nav-container">
        <!-- 博客Logo -->
        <router-link to="/" class="logo">
          <div class="logo-icon">
            <span>B</span>
          </div>
          <span class="logo-text">GlassBlog</span>
        </router-link>

        <!-- 桌面导航 -->
        <div class="desktop-nav">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            class="nav-link"
            :to="item.path"
          >
            {{ item.label || item.meta?.label || item.meta?.title }}
          </router-link>
        </div>

        <!-- 搜索和主题切换 -->
        <div class="nav-actions">
          <button class="icon-btn" @click="toggleSearch">
            <i class="fa fa-search"></i>
          </button>
          <button class="icon-btn" @click="$emit('toggle-theme')">
            <i class="fa" :class="isDark ? 'fa-sun-o' : 'fa-moon-o'"></i>
          </button>

          <!-- 移动端菜单按钮 -->
          <button class="icon-btn mobile-menu-toggle" @click="toggleMobileMenu">
            <i class="fa fa-bars"></i>
          </button>
        </div>
      </div>

      <!-- 移动端导航菜单 -->
      <div class="mobile-menu" :class="{ 'active': mobileMenuOpen }">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          class="mobile-nav-link"
          :to="item.path"
          @click="mobileMenuOpen = false"
        >
          {{ item.label || item.meta?.label || item.meta?.title }}
        </router-link>
      </div>

      <!-- 搜索框 -->
      <div class="search-box" :class="{ 'active': searchOpen }">
        <div class="search-input-wrapper">
          <input
            type="text"
            placeholder="搜索文章..."
            class="search-input"
            v-model="searchQuery"
          >
          <button class="search-btn">
            <i class="fa fa-search"></i>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { usePermissionStoreHook } from '@/store/permission'

const _props = defineProps<{
  isDark: boolean;
}>()

const _emit = defineEmits(['toggle-theme'])

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')

interface MenuItem { path: string; label?: string; meta?: { label?: string; title?: string } }
const menuItems = computed<MenuItem[]>(() => {
  const perm = usePermissionStoreHook()
  return perm.navRoutes.map((r) => ({
    path: r.path as string,
    label: (r.meta && (r.meta as { label?: string; title?: string }).label) || (r.meta && (r.meta as { label?: string; title?: string }).title) || undefined,
    meta: r.meta as { label?: string; title?: string } | undefined,
  }))
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  // 关闭搜索框如果打开
  if (searchOpen.value) {
    searchOpen.value = false
  }
}

const toggleSearch = () => {
  searchOpen.value = !searchOpen.value
  // 关闭移动菜单如果打开
  if (mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.glass {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.dark .glass {
  background: rgba(30, 30, 30, 0.5);
  border-color: rgba(255, 255, 255, 0.1);
}

.nav {
  transition: box-shadow .25s ease, background .25s ease;
  height: 64px;
  display: flex;
  align-items: center;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1100px;
  margin: 0 auto;
  padding: .75rem 1rem;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  text-decoration: none;
}

.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
}

.logo-text {
  font-weight: 700;
}

.desktop-nav {
  display: none;
  gap: 1rem;
}

.nav-link {
  color: inherit;
  text-decoration: none;
  padding: .5rem .75rem;
  border-radius: 8px;
}

.nav-link:hover {
  background: rgba(0,0,0,.04);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: .5rem;
}

.icon-btn {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
}

.icon-btn:hover {
  background: rgba(0,0,0,.06);
}

.mobile-menu-toggle { display: inline-grid; }

.mobile-menu {
  display: none;
  padding: .5rem 1rem 1rem;
}

.mobile-menu.active { display: block; }

.mobile-nav-link {
  display: block;
  padding: .5rem .75rem;
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
}

.mobile-nav-link:hover { background: rgba(0,0,0,.04); }

/* 搜索框样式 */
.search-box {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  display: none;
  padding: .5rem 1rem 1rem;
}

.search-box.active { display: block; }

.search-input-wrapper {
  display: flex;
  gap: .5rem;
  background: rgba(255,255,255,.6);
  border: 1px solid rgba(0,0,0,.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: .5rem .75rem;
}

.dark .search-input-wrapper {
  background: rgba(30,30,30,.5);
  border-color: rgba(255,255,255,.1);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  color: inherit;
}

.search-btn {
  border: none;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  color: #fff;
  border-radius: 10px;
  padding: .4rem .7rem;
  cursor: pointer;
}
@media (min-width: 768px) {
  .desktop-nav { display: flex; }
  .mobile-menu-toggle { display: none; }
  .mobile-menu { display: none !important; }
}
</style>
