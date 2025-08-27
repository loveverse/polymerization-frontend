<template>
  <el-menu
    :default-active="route.path"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    :router="state.flag">
    <template v-if="state.flag">
      <template v-for="item in routerList">
        <MenuItem :menu-item="item"></MenuItem>
      </template>
    </template>
    <el-menu-item v-else index="0" @click="() => (state.showAside = true)" class="unfold">
      <template #title>
        <el-icon>
          <Expand />
        </el-icon>
        <span>展开</span>
      </template>
    </el-menu-item>
  </el-menu>
  <el-drawer
    v-model="state.showAside"
    direction="ltr"
    :with-header="false"
    :before-close="() => (state.showAside = false)"
    :size="200"
    class="aside-drawer"
  >
    <el-menu
      :default-active="route.path"
      mode="vertical"
      :ellipsis="false"
      router
    >
      <template v-for="item in routerList">
        <MenuItem :menu-item="item"></MenuItem>
      </template>
    </el-menu>
  </el-drawer>
</template>

<script setup lang="ts">
import { Expand } from "@element-plus/icons-vue"
import { computed, reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
import MenuItem from "./MenuItem.vue"

interface StateProps {
  flag: boolean
  showAside: boolean
}

const state = reactive<StateProps>({
  flag: true, // 小屏适配
  showAside: false, // 显示抽屉
})
const router = useRouter()
const route = useRoute()

const routerList = computed(() => {
  const routes = router.getRoutes()
  const asyncRoutes = routes.find(k => k.path === "/")
  return asyncRoutes?.children || []
})
</script>

<style scoped lang="scss">
.el-menu-demo {
  transition: all 0.3s;
  border: none;
  height: inherit;

  .flex-grow {
    flex-grow: 1;
  }

  .btn_login {
    display: flex;
    align-items: center;

    .theme_toggle {
      margin: 0 20px;
    }

    .user_info {
      display: flex;
      align-items: center;
      cursor: pointer;

      .name {
        margin-right: 5px;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }

  .unfold {
    padding: 0 5px 0 0;
  }
}
</style>
<!-- 使用scoped无法生效 -->
<style lang="scss">
// 这里样式会在全局生效
.aside-drawer {
  .el-drawer__body {
    padding: 0;
  }
}
</style>
