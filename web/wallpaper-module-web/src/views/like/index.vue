<template>
  <ComUpload multiple :limit="3">
    <el-button type="primary">Click to upload</el-button>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500KB.
      </div>
    </template>
  </ComUpload>
  <el-button @click="getFileInfo">查询文件</el-button>
</template>
<script setup lang="ts">
import {ref} from 'vue'
import {ElMessage, ElMessageBox, UploadProps, UploadUserFile} from 'element-plus'
import {reqUploadFile} from "@/api/base";
import http from "@/utils/http";

const getFileInfo = () => {
  http.get("http://localhost:30100/oss-file-api/file/info/1910250480878096384").then((res) => {
    console.log(res)
  })
  http.get("http://localhost:30100/oss-file-api/file/info",{id: "1910250480878096384"}).then((res) => {
    console.log(res)
  })
}
const fileList = ref<UploadUserFile[]>([])

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {

  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  )
}
</script>


<style lang="scss" scoped>

</style>
