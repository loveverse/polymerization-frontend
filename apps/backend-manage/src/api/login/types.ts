type LoginType = "student" | "teacher";
type LoginDevice = "pc" | "app" | "desktop";
export interface ReqLoginForm {
  username?: string | number;
  password?: any;
  loginType?: LoginType;
  loginDevice?: LoginDevice;
}
export interface ResLogin {
  permission: any[];
  token: string;
  user: any;
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
