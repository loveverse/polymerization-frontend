<template>
  <el-upload  v-bind="$attrs">
    <template v-for="(item, index) in slots" #[index]="scope">
      <slot :name="item" v-bind="scope || {}"></slot>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import {UploadProps} from "element-plus";
import {useSlots} from "vue";

type ComUploadProps = UploadProps
const props = defineProps<ComUploadProps>()

defineOptions({
  inheritAttrs: false, // 解决自定义封装事件多次执行
})
const slots = useSlots()
console.log(slots)
</script>


<style scoped lang="scss">

</style>
