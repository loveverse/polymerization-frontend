<template>
  <el-container class="layout_wrapper">
    <el-header class="layout-header">
      <ComHeader/>
    </el-header>
    <!-- 直接使用router-view不显示,不需要padding的在meta定义inter为true -->
    <el-main :class="['layout-main',$route.meta.inter && 'interval']">
      <router-view v-slot="{ Component }">
        <transition name="move" mode="out-in">
          <component :is="Component"></component>
        </transition>
      </router-view>
    </el-main>
    <el-footer class="layout-footer">
      <ComFooter/>
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
import ComHeader from "./components/ComHeader.vue";
import ComFooter from "./components/ComFooter.vue";


</script>
<style lang="scss" scoped>
.layout_wrapper {
  .layout-header {
    position: sticky;
    top: 0;
    height: 48px;
    padding-bottom: 48px;
    box-shadow: 0 2px 5px 0 #ddd;
    z-index: 9999; // 头部保持最高层级
  }

  .layout-main {
    @include scroll-default;
    @include tranition;
    // 需要包含默认边距
    padding-bottom: 60px;
  }

  .interval {
    padding: 0;
  }

  .layout-footer {
    position: absolute;
    width: 100%;
    //padding-top: 40px;
    bottom: 0;
    height: 40px;
    background-color: #99ccff;
  }

  // .el-main {
  //   padding: 0;
  //   .interval {
  //     // height: 100%;
  //     padding: 20px;
  //     box-sizing: border-box;
  //   }
  // }
  // .el-footer {
  //   padding: 0;
  //   background-color: antiquewhite;
  // }
}
</style>
