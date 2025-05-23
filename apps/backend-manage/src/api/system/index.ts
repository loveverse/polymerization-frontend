import http from "@/utils/http";
import {
  AddMenuReq,
  UpdateMenuReq,
  AddRoleReq,
  AssignRoleToUserReq,
  SetRolePermissionReq,
  UpdateRoleReq,
  RoleDataRes,
  RolePageParam,
  AddDictReq,
  UpdateDictReq,
  UpdateDictItemReq, AddDictItemReq, DictDataRes, DictItemDataRes, DictItemListReq,
} from "./types";
import {MODULE_NAME} from "@/utils/constant";
import {UserDataRes} from "@/api/user/types";

/* 角色管理 */
export const reqAddRole = (params: AddRoleReq) =>
  http.post("/auth-api/v1/role/create", params);
export const reqBatchDelRole = (params: string[]) =>
  http.post("/auth-api/v1/role/delete", params);
export const reqUpdateRole = (params: UpdateRoleReq) =>
  http.put("/auth-api/v1/role/update", params);
export const reqRoleList = () =>
  http.get<RoleDataRes[]>("/auth-api/v1/role/list");
export const reqRolePage = (params: RolePageParam) =>
  http.get<PageResult<RoleDataRes>>("/auth-api/v1/role/page", params);


/* 字典管理 */
export const reqAddDict = (params: AddDictReq) =>
  http.post("/auth-api/v1/dict/create", params);
export const reqDelDict = (params: CommonId) =>
  http.delete("/auth-api/v1/dict/delete", params);
export const reqUpdateDict = (params: UpdateDictReq) =>
  http.put("/auth-api/v1/dict/update", params);
export const reqDictList = () => http.get<DictDataRes[]>("/auth-api/v1/dict/list");
// 字典项
export const reqAddDictItem = (params: AddDictItemReq) =>
  http.post("/auth-api/v1/dict-item/create", params);
export const reqDelDictItem = (params: CommonId) =>
  http.delete("/auth-api/v1/dict-item/delete", params);
export const reqUpdateDictItem = (params: UpdateDictItemReq) =>
  http.put("/auth-api/v1/dict-item/update", params);
export const reqDictItemList = (params?: DictItemListReq) => http.get<DictItemDataRes[]>("/auth-api/v1/dict/dict-item/list", params);


export const reqRolePermission = (params: CommonId) =>
  http.post("/auth-api/manager/role/v1/one_with_menu", params);
export const reqSetRolePermission = (params: SetRolePermissionReq) =>
  http.post("/auth-api/manager/role/v1/empowerment", params);
// 用户列表
export const reqUserByRoleList = (params: CommonId) =>
  http.post<UserDataRes[]>("/auth-api/manager/role/v1/listUserByRoleId", params);
export const reqNoAssignUserList = (params: CommonId) =>
  http.post<UserDataRes[]>("/auth-api/manager/role/v1/listUserExcludeRole", params);
export const reqAssignRoleToUser = (params: AssignRoleToUserReq) =>
  http.post("/auth-api/manager/role/v1/addUserRole", params);
export const reqDelUserRole = (params: AssignRoleToUserReq) =>
  http.post("/auth-api/manager/role/v1/deleteUserRole", params);


/* 菜单管理 */
export const reqMenuTree = () =>
  http.post("/auth-api/manager/menu/v1/module_tree", {moduleName: MODULE_NAME});
// 角色菜单
export const reqAddMenu = (params: AddMenuReq) =>
  http.post("/auth-api/manager/menu/v1/add", params);
export const reqUpdateMenu = (params: UpdateMenuReq) =>
  http.post("/auth-api/manager/menu/v1/update", params);
export const reqDelMenu = (params: CommonId) =>
  http.post("/auth-api/manager/menu/v1/delete", params);


