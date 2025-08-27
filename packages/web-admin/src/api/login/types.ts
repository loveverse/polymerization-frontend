import { MenuListRes } from "@/api/system/types"

type LoginType = "student" | "teacher"
type LoginDevice = "pc" | "app" | "desktop"

export interface LoginInfoReq {
  username: string
  password: string
  captchaCode: string
  captchaKey: string
  loginType?: LoginType
  loginDevice?: LoginDevice
}

export interface LoginInfoRes {
  expireTime: string
  token: string
  tokenPrefix: string
  user: {
    id: string
    userId: string
    username: string
  }
}

export interface AuthorityInfoRes {
  menus: MenuListRes[]
  permissions: []
  roles: []
}
