/* 角色管理 */
export interface RolePageParam extends PageParam {

}

export interface RoleDataRes {
  id: string;
  createTime: string;
  updateTime: string;
  roleName: string;
  roleKey: string;
  status: number;
}

export interface AddRoleReq {
  roleName: string;
  roleKey: string;
}

export type UpdateRoleReq = AddRoleReq & CommonId;

export interface SetRolePermissionReq {
  roleId: string;
  powerIds: string[];
}

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
export interface  DictItemListReq{
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

/* 菜单管理 */
export interface AddMenuReq {
  name: string;
  pid: string;
  icon?: string;
  route?: string;
  type?: string;
  powerKey?: string;
  orderValue?: number;
  moduleName: string;
}

export type UpdateMenuReq = AddMenuReq & CommonId;
export type IMenuList = Pick<AddMenuReq, "moduleName">;

export interface AssignRoleToUserReq {
  userIds: string[];
  roleId: string;
}






