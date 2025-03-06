<template>
  <el-upload v-bind="$attrs" :file-list="innerFileList">
    <template v-for="(item) in Object.keys($slots)" #[item]="scope">
      <slot :name="item" v-bind="scope || {}"></slot>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import {UploadProps} from "element-plus";
import {computed, useAttrs, useSlots} from "vue";

type ComUploadProps = Partial<UploadProps>
const {fileList} = defineProps<ComUploadProps>()

defineOptions({
  inheritAttrs: false, // 解决自定义封装事件多次执行
})
const emit = defineEmits(["setFileList"])
const innerFileList = computed({
  get: () => {
    return fileList;
  },
  set: (values) => {
    emit("setFileList", values)
  }
})

// 一般来说使用 slots 和 attrs 的情况应该是相对来说较为罕见的，因为可以在模板中直接通过 $slots 和 $attrs 来访问它们
</script>


<style scoped lang="scss">

</style>
