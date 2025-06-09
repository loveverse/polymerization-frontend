/* 角色管理 */

export interface RolePageReq extends PageParam {

}

export type RoleListReq = Partial<Pick<RoleDataRes, "status">>

export interface RoleDataRes {
  id: string;
  createTime: string;
  updateTime: string;
  roleName: string;
  roleKey: string;
  status: number;
  disabled?: boolean;
  menuIds: string[]
}

export interface AddRoleReq {
  roleName: string;
  roleKey: string;
  status?: number;
}

export type UpdateRoleReq = AddRoleReq & CommonId;
export type UpdateRoleStatusReq = Pick<AddRoleReq, "status"> & CommonId;
export type SetRolePermissionsReq = Pick<RoleDataRes, "menuIds"> & CommonId;


/* 字典管理 */
export interface AddDictReq {
  dictValue: string;
  dictLabel: string;
  dictType?: string;
}

export type UpdateDictReq = AddDictReq & CommonId;

export interface DictDataRes {
  id: string;
  createTime: string;
  updateTime: string;
  dictValue: string;
  dictLabel: string;
  dictType: string;
}

export interface AddDictItemReq {
  dictId: string;
  dictItemValue: string;
  dictItemLabel: string;
  sortOrder: number;
}

export type UpdateDictItemReq = Omit<AddDictItemReq, "dictId"> & CommonId;

export interface DictItemListReq {
  dictId?: string;
}

export interface DictItemDataRes {
  id: string;
  createTime: string;
  updateTime: string;
  dictId: string;
  dictItemValue: string;
  dictItemLabel: string;
  sortOrder: number;
}

export interface DictItemCollectReq {
  moduleId?: string
}

export interface DictItemCollectRes {
  dictMap: {
    [key: string]: DictItemDataRes[]
  }
  dictKeyMap: {
    [key: string]: Record<string, any>
  }
}

/* 用户管理 */
export interface UserDataRes {
  id: string;
  createTime: string;
  updateTime: string;
  username: string;
  nickname: string;
  sex: string;
  status: number;
  phoneNumber: string;
  email: string;
  avatar: string;
  roleList: Pick<RoleDataRes, "id" | "roleKey" | "roleName">[]
}

export interface AddUserReq {
  username: string;
  nickname?: string;
  password: string;
  sex: string;
  status?: number;
  phoneNumber?: string;
  email?: string;
  avatar?: string
  roleIds?: string[];
}

export type UpdateUserReq = AddUserReq & CommonId;
export type UpdateUserStatusReq = Pick<AddUserReq, "status"> & CommonId;
export type ResetUserPasswordReq = Pick<AddUserReq, "password"> & CommonId;
export type UpdateUserInfoReq = UpdateUserReq | UpdateUserStatusReq | ResetUserPasswordReq;
export type UserInfoRes = UserDataRes


/* 菜单管理 */
export interface AddMenuReq {
  id: string;
  moduleId: string;
  createTime: string;
  updateTime: string;
  menuName: string;
  path: string;
  menuType: string;
  parentId: string;
  icon?: string;
  permission?: string;
  visible: number;
  sortOrder?: number;
}

export type UpdateMenuReq = AddMenuReq & CommonId;

export interface MenuListRes {
  id: string;
  createTime: string;
  updateTime: string;
  menuName: string;
  path: string;
  menuType: string;
  parentId: string;
  icon: string;
  permission: string;
  visible: number;
  sortOrder: number;
  children?: MenuListRes[]
}






