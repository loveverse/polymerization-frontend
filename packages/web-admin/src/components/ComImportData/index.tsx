import { App, Modal, UploadProps } from "antd"
import { ModalControlsProps } from "@/hooks/useModalControls"
import Dragger from "antd/es/upload/Dragger"
import { InboxOutlined } from "@ant-design/icons"
import styles from "./index.module.scss"
import { reqDownloadExcelTemplate, reqUploadFile } from "@/api/base"
import { useState } from "react"
import { UploadFileRes } from "@/api/base/upload/types"
import { downloadFile } from "@/utils/common"

const ComImportData = (props: ModalControlsProps) => {
  const { modalProps } = props
  const { message } = App.useApp()

  const [fileList, setFileList] = useState<UploadFileRes[]>([])
  const uploadProps: UploadProps = {
    name: "file",
    maxCount: 1,
    accept: ".xls,.xlsx",
    beforeUpload: file => {
      //文件类型校验
      const fileType = file.name.split(".").pop()
      if (fileType !== "xls" && fileType !== "xlsx") {
        message.warning(`上传失败：上传文件格式不符合`)
        return false
      }
      // 检查文件大小
      const fileSize = file.size / 1024 / 1024
      if (fileSize > 10) {
        message.warning("上传的文件大于10M，请重新上传")
        return false
      }
      return true
    },
    onRemove: file => {
      const files = fileList.filter(item => item.response?.id !== file.response.id)
      setFileList(files)
    },
    customRequest: options => {
      const formData = new FormData()
      formData.append("file", options.file)
      reqUploadFile(formData)
        .then(res => {
          if (res.code === 200) {
            setFileList([{ uid: res.data.id, name: res.data.name, response: res.data }])
            options.onSuccess?.(res.data)
            message.success("上传文件成功")
          } else {
            options.onError?.(new Error())
            message.error("上传文件失败")
          }
        })
        .catch(error => {
          console.error(error)
          message.error("上传文件失败")
        })
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files)
    },
  }
  const downloadTemplate = async () => {
    // FIXME 当前可能会返回错误消息，key不存在会下载不到，这里不打印，没有解决在非组件页面打印 message 消息问题
    const res = await reqDownloadExcelTemplate({ key: "sys_user_excel" })
    await downloadFile(res, "用户导入模板.xlsx")
  }
  return (
    <Modal {...modalProps} title="导入" className={styles["import-data-modal"]}>
      <div>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击上传 或 拖拽到此区域</p>
        </Dragger>
        <ul className="tooltip-list">
          <li>· 上传文件支持 xls 格式，大小不超过 10M</li>
          <li>· 请先下载文件模板，参考模板内容格式，否则可能无法正常识别</li>
          <li>
            · 文件模板下载：<a onClick={downloadTemplate}>xls 文件</a>
          </li>
        </ul>
      </div>
    </Modal>
  )
}
export default ComImportData
