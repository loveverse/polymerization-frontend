type LoginType = "student" | "teacher";
type LoginDevice = "pc" | "app" | "desktop";

export interface LoginInfoReq {
  username: string;
  password: string;
  captchaCode: string;
  captchaKey: string;
  loginType?: LoginType;
  loginDevice?: LoginDevice;
}

export interface LoginInfoRes {
  expireTime: string;
  token: string;
  tokenPrefix: string;
  user: {
    id: string;
    userId: string;
    username: string;
  };
}

export interface UserMenuReq {
  id: string;
  name: string;
  pid: string;
  icon: string;
  route: string;
  type: string;
  orderValue: number;
  createTime: number;
  updateTime: number;
  hasChildren: boolean;
  moduleName: string;
  isDisabled: number;
  children?: UserMenuReq[];
}
