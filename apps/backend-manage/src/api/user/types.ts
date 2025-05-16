/* 用户管理 */

import { RolePageRes } from "../system/types";

/* 用户管理 */

export interface UserPageRes {
  id: string;
  version: string;
  valid: number;
  updateTime: number;
  createTime: number;
  username: string;
  password: string;
  detail?: string;
  title?: string;
  phoneNumber?: string;
  email?: string;
  isLock: number;
  name: string;
  roles: RolePageRes[];
  gender: string;
  headImg: string;
  [key: string]: any;
}
export interface AddUserReq {
  roles: CommonId[] | string[];
  phoneNumber?: string;
  title?: string;
  username: string;
  name: string;
  gender: string;
  email?: string;
  password?: string;
  isLock?: number;
}
export type UpdateUserReq = AddUserReq & CommonId;
export type UpdateUserStatusReq = Pick<AddUserReq, "isLock"> & CommonId;
