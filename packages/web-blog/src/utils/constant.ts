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
export const FILE_TYPE = [
  "file",
  "folder",
  "gif",
  "html",
  "ico",
  "image",
  "java",
  "javascript",
  "jpeg",
  "jpg",
  "json",
  "log",
  "lua",
  "mkv",
  "mov",
  "mp4",
  "mpeg",
  "mpg",
  "pdf",
  "php",
  "png",
  "ppt",
  "py",
  "python",
  "rar",
  "rm",
  "rmvb",
  "shell",
  "sql",
  "swf",
  "tar",
  "webm",
  "webp",
  "wma",
  "wmv",
  "xls",
  "xml",
  "zip",
]

type DictItem = {
  value: string | number
  label: string
}
type Label = {
  [key: string]: {
    [key: string | number]: string
  }
}
type Dict = {
  [key: string]: DictItem[]
}

type Dicts = {
  label: Label
  dict: Dict
}

const label: Label = {
  survivalStatus: {
    0: "存活",
    1: "已屏蔽",
    2: "查无此人",
  },
  person: {
    0: "真人",
    1: "骗子",
  },
}
const dict: Dict = {}
Object.keys(label).forEach(item => {
  dict[item] = Object.entries(label[item]).reduce((pre: DictItem[], cur) => {
    const [value, label] = cur
    console.log(cur)

    pre = pre.concat({ value, label })
    return pre
  }, [])
})

export const dicts: Dicts = {
  dict,
  label,
}
console.log(dicts)
