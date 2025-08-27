<template>
  <el-sub-menu :index="menuItem.path" v-if="menuItem.children && menuItem.children.length">
    <template #title>{{ menuItem.meta?.label }}</template>
    <template v-for="item in menuItem.children">
      <MenuItem :menu-item="item"></MenuItem>
    </template>
  </el-sub-menu>
  <el-menu-item v-else :index="menuItem.path">{{ menuItem.meta?.label }}</el-menu-item>
</template>
<script setup lang="ts">
import { RouteRecordRaw } from "vue-router"
// 传递给defineProps的泛型参数本身不能是一个导入的类型，因为vue组件时单独编译的

const props = defineProps<{ menuItem: RouteRecordRaw }>()
</script>
<style scoped lang="scss"></style>
