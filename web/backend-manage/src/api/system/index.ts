import http from "@/utils/http";
import {
  AddDictItemReq,
  AddDictReq,
  AddMenuReq,
  AddRoleReq,
  AddUserReq,
  DictDataRes,
  DictItemCollectReq,
  DictItemCollectRes,
  DictItemDataRes,
  DictItemListReq,
  MenuListRes,
  RoleDataRes,
  RoleListReq,
  RolePageReq,
  SetRolePermissionsReq,
  UpdateDictItemReq,
  UpdateDictReq,
  UpdateMenuReq,
  UpdateRoleReq,
  UpdateUserInfoReq,
  UserDataRes, UserInfoRes,
} from "./types";


/* 角色管理 */
export const reqAddRole = (params: AddRoleReq) =>
  http.post("/auth-api/v1/system/role/create", params);
export const reqBatchDelRole = (params: string[]) =>
  http.post("/auth-api/v1/system/role/delete", params);
export const reqUpdateRole = (params: UpdateRoleReq) =>
  http.put("/auth-api/v1/system/role/update", params);
export const reqRoleList = (params?: RoleListReq) =>
  http.get<RoleDataRes[]>("/auth-api/v1/system/role/list", params);
export const reqRolePage = (params: RolePageReq) =>
  http.get<PageResult<RoleDataRes>>("/auth-api/v1/system/role/page", params);
export const reqMenuIdsByRoleId = (params: { roleId: string }) =>
  http.get<RoleDataRes>("/auth-api/v1/system/role/menu-tree-by-role/" + params.roleId);
export const reqSetRolePermissions = (params: SetRolePermissionsReq) =>
  http.post("/auth-api/v1/system/role/update-role-permissions", params);

/* 字典管理 */
export const reqAddDict = (params: AddDictReq) =>
  http.post("/auth-api/v1/system/dict/create", params);
export const reqDelDict = (params: CommonId) =>
  http.delete("/auth-api/v1/system/dict/delete", params);
export const reqUpdateDict = (params: UpdateDictReq) =>
  http.put("/auth-api/v1/system/dict/update", params);
export const reqDictList = () => http.get<DictDataRes[]>("/auth-api/v1/system/dict/list");
// 字典项
export const reqAddDictItem = (params: AddDictItemReq) =>
  http.post("/auth-api/v1/system/dict/dict-item/create", params);
export const reqDelDictItem = (params: CommonId) =>
  http.delete("/auth-api/v1/system/dict/dict-item/delete", params);
export const reqUpdateDictItem = (params: UpdateDictItemReq) =>
  http.put("/auth-api/v1/system/dict/dict-item/update", params);
export const reqDictItemList = (params?: DictItemListReq) =>
  http.get<DictItemDataRes[]>("/auth-api/v1/system/dict/dict-item/list", params);
export const reqDictItemCollect = (params?: DictItemCollectReq) =>
  http.get<DictItemCollectRes>("/auth-api/v1/system/dict/dict-items", params);

/* 用户管理 */
export const reqAddUser = (params: AddUserReq) =>
  http.post("/auth-api/v1/system/user/create", params);
export const reqDelBatchUser = (params: string[]) =>
  http.post("/auth-api/v1/system/user/delete", params);
export const reqUpdateUser = (params: UpdateUserInfoReq) =>
  http.put("/auth-api/v1/system/user/update", params);
export const reqUserPage = (params: PageParam) =>
  http.get<PageResult<UserDataRes>>("/auth-api/v1/system/user/page", params);
export const reqUserInfo = (params: CommonId) =>
  http.get<UserInfoRes>("/auth-api/v1/system/user/detail/" + params.id);

/* 菜单管理 */
export const reqAddMenu = (params: AddMenuReq) =>
  http.post("/auth-api/v1/system/menu/create", params);
export const reqDelMenu = (params: CommonId) =>
  http.delete("/auth-api/v1/system/menu/delete", params);
export const reqUpdateMenu = (params: UpdateMenuReq) =>
  http.put("/auth-api/v1/system/menu/update", params);
export const reqMenuTreeByModuleId = (params: { moduleId: string }) =>
  http.get<MenuListRes[]>("/auth-api/v1/system/menu/menu-tree-by-module/" + params.moduleId);

