import audioLogo from "@/assets/imgs/fileLogo/audio.png"
import commonLogo from "@/assets/imgs/fileLogo/common.png"
import imageLogo from "@/assets/imgs/fileLogo/image.png"
import pdfLogo from "@/assets/imgs/fileLogo/pdf.png"
import pptLogo from "@/assets/imgs/fileLogo/ppt.png"
import videoLogo from "@/assets/imgs/fileLogo/video.png"
import wordLogo from "@/assets/imgs/fileLogo/word.png"
import xlsxLogo from "@/assets/imgs/fileLogo/xlsx.png"
import zipLogo from "@/assets/imgs/fileLogo/zip.png"
import { TimeRangePickerProps } from "antd"
import dayjs from "dayjs"

export const PAGE_CURRENT = 1
export const PAGE_SIZE = 10

export const SERVER_STATUS: Record<number, string> = {
  400: "请求失败！请您稍后重试",
  401: "登录失效！请您重新登录",
  403: "当前账号无权限访问！",
  404: "你所访问的资源不存在！",
  405: "请求方式错误！请您稍后重试",
  408: "请求超时！请您稍后重试",
  500: "服务异常！",
  502: "网关错误！",
  503: "服务不可用！",
  504: "网关超时！",
}

export const FILE_TYPE_LIST = [
  { value: "kj", logoImg: commonLogo, list: [] },
  { value: "kj", logoImg: imageLogo, list: ["jpg", "jpeg", "png", "gif", "svg"] },
  { value: "wk", logoImg: videoLogo, list: ["mp4", "mov", "wmv"] },
  {
    value: "yp",
    logoImg: audioLogo,
    list: ["mp3", "wma", "wav", "ape", "flac", "ogc", "aac"],
  },
  { value: "kj", logoImg: pdfLogo, list: ["pdf"] },
  { value: "kj", logoImg: pptLogo, list: ["ppt", "pptx"] },
  { value: "kj", logoImg: wordLogo, list: ["docs", "docx"] },
  { value: "kj", logoImg: xlsxLogo, list: ["xlsx"] },
  { value: "kj", logoImg: zipLogo, list: ["zip"] },
]
export const RANGE_PRESETS: TimeRangePickerProps["presets"] = [
  { label: "今天", value: [dayjs().add(0, "d"), dayjs().add(1, "d")] },
  { label: "近一个月", value: [dayjs().add(-1, "month"), dayjs().add(1, "d")] },
  { label: "近三个月", value: [dayjs().add(-3, "month"), dayjs().add(1, "d")] },
]

// 白名单路由
export const WHITE_ROUTES = ["/login"]
// 默认模块value
export const CURRENT_MODULE_KEY = "m_ht"
