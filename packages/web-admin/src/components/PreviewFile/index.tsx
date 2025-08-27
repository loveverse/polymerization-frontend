import React, { memo, useEffect, useMemo, useState } from "react"
import { Button, message, Modal, ModalProps, Space } from "antd"
import { downloadFile, findFileLogo, generatePreviewURL } from "@/utils/common"
import styles from "./index.module.scss"

export interface FileInfo {
  id?: string
  fileSize?: number
  fileType?: string
  fileUrl: string
  fileName: string
  source?: string

  [key: string]: any
}

interface PreviewChildProps extends ModalProps {
  file: FileInfo[] | FileInfo | null
  initFileIndex?: number
}

const PreviewFile = (props: PreviewChildProps) => {
  const { file, initFileIndex, ...modalProps } = props
  const files = Array.isArray(file) ? file : file ? [file] : []
  const [fileIndex, setFileIndex] = useState(initFileIndex || 0)
  const fileInfo = useMemo(() => {
    if (!files.length) {
      return { fileUrl: "", fileName: "" }
    }
    const fileUrl = files[fileIndex].fileUrl
    return {
      source: generatePreviewURL(fileUrl),
      fileUrl: fileUrl,
      fileName: files[fileIndex]?.fileName,
    }
  }, [fileIndex, files])

  const [isFull, setIsFull] = useState(false)
  const handleFullScreen = () => setIsFull(!isFull)

  useEffect(() => {
    if (modalProps.open) {
    } else {
      setFileIndex(0)
    }
  }, [modalProps.open])

  return (
    <Modal
      {...modalProps}
      title="预览"
      width={isFull ? "100%" : "1000px"}
      footer={
        <div className="preview-footer">
          <div className="file-info">
            <img src={findFileLogo(fileInfo.fileName)} alt="" />
            <span> {fileInfo.fileName}</span>
          </div>
          <Space>
            {files.length > 1 ? (
              <Button
                type="primary"
                ghost
                disabled={fileIndex === 0}
                onClick={() => {
                  if (fileIndex === 0) return message.warning("当前已是第一份")
                  setFileIndex(previousIndex => previousIndex - 1)
                }}>
                上一份
              </Button>
            ) : null}

            {files.length > 1 ? (
              <Button
                type="primary"
                ghost
                disabled={files.length - 1 === fileIndex}
                onClick={() => {
                  if (fileIndex === files.length - 1) return message.warning("当前已是最后一份")
                  setFileIndex(previousIndex => previousIndex + 1)
                }}>
                下一份
              </Button>
            ) : null}
            <Button
              type="primary"
              onClick={() => downloadFile(fileInfo.fileUrl, fileInfo.fileName)}>
              下载
            </Button>
            <Button type="primary" onClick={handleFullScreen}>
              全屏
            </Button>
          </Space>
        </div>
      }
      rootClassName={[styles["preview-modal"], isFull ? styles["full-screen"] : ""].join(" ")}>
      <iframe src={fileInfo.source}></iframe>
    </Modal>
  )
}

export default memo(PreviewFile)
