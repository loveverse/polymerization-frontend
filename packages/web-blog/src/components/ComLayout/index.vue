<template>
  <router-view v-slot="{ Component }">
    <transition
      name="move"
      mode="out-in"
      leave-active-class=""
      enter-active-class="animate__animated animate__fadeInDown">
      <component :is="Component"></component>
    </transition>
  </router-view>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
//@include tranition;
</style>
