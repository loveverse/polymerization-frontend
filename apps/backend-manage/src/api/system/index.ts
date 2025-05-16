import http from "@/utils/http";
import {
  AddMenuReq,
  UpdateMenuReq,
  IAddDict,
  IDelDict,
  IUpdateDict,
  IAddDictDetail,
  IDelDictDetail,
  IUpdateDictDetail,
  UpdataRoleReq,
  RolePageRes,
  AddRoleReq,
  AssignRoleToUserReq,
  SetRolePermissionReq,
  AddDimensionalityReq,
  EditDimensionalityReq,
  DimensionalityListRes,
  AddSchemeReq,
  EditSchemeReq,
  SchemeListRes,
  EditSchemeStatusReq,
} from "./types";
import { UserPageRes } from "../user/types";
import { MODULE_NAME } from "@/utils/constant";

/* 角色管理 */
export const reqRolePage = (params: PageReq) =>
  http.post<PageRes<RolePageRes>>("/embodied-user-api/manager/role/v1/page", params);
export const reqRoleList = () =>
  http.post<RolePageRes[]>("/embodied-user-api/manager/role/v1/list");
export const reqAddRole = (params: AddRoleReq) =>
  http.post("/embodied-user-api/manager/role/v1/add", params);
export const reqUpdateRole = (params: UpdataRoleReq) =>
  http.post("/embodied-user-api/manager/role/v1/update", params);
export const reqDelRole = (params: CommonId) =>
  http.post("/embodied-user-api/manager/role/v1/delete", params);
export const reqRolePermission = (params: CommonId) =>
  http.post("/embodied-user-api/manager/role/v1/one_with_menu", params);
export const reqSetRolePermission = (params: SetRolePermissionReq) =>
  http.post("/embodied-user-api/manager/role/v1/empowerment", params);
// 用户列表
export const reqUserByRoleList = (params: CommonId) =>
  http.post<UserPageRes[]>("/embodied-user-api/manager/role/v1/listUserByRoleId", params);
export const reqNoAssignUserList = (params: CommonId) =>
  http.post<UserPageRes[]>("/embodied-user-api/manager/role/v1/listUserExcludeRole", params);
export const reqAssignRoleToUser = (params: AssignRoleToUserReq) =>
  http.post("/embodied-user-api/manager/role/v1/addUserRole", params);
export const reqDelUserRole = (params: AssignRoleToUserReq) =>
  http.post("/embodied-user-api/manager/role/v1/deleteUserRole", params);

/* 字典管理 */
export const reqDictList = () => http.post("/embodied-course-api/manager/dict/v1/list");
export const reqAddDict = (params: IAddDict) =>
  http.post("/embodied-user-api/manager/dict/v1/add", params);
export const reqUpdateDict = (params: IUpdateDict) =>
  http.post("/embodied-user-api/manager/dict/v1/update", params);
export const reqDelDict = (params: IDelDict) =>
  http.post("/embodied-user-api/manager/dict/v1/delete", params);
// 字典详情
export const reqDictDetail = () => http.post("/embodied-course-api/manager/dict-detail/v1/list");
export const reqAddDictDetail = (params: IAddDictDetail) =>
  http.post("/embodied-user-api/manager/dict-detail/v1/add", params);
export const reqUpdateDictDetail = (params: IUpdateDictDetail) =>
  http.post("/embodied-user-api/manager/dict-detail/v1/update", params);
export const reqDelDictDetail = (params: IDelDictDetail) =>
  http.post("/embodied-user-api/manager/dict-detail/v1/delete", params);

/* 菜单管理 */
export const reqMenuTree = () =>
  http.post("/embodied-user-api/manager/menu/v1/module_tree", { moduleName: MODULE_NAME });
// 角色菜单
export const reqAddMenu = (params: AddMenuReq) =>
  http.post("/embodied-user-api/manager/menu/v1/add", params);
export const reqUpdateMenu = (params: UpdateMenuReq) =>
  http.post("/embodied-user-api/manager/menu/v1/update", params);
export const reqDelMenu = (params: CommonId) =>
  http.post("/embodied-user-api/manager/menu/v1/delete", params);

/* 测评管理 */
export const reqAddDimensionality = (params: AddDimensionalityReq) =>
  http.post("/embodied-user-api/manager/evaluation/dimension/v1/save", params);
export const reqEditDimensionality = (params: EditDimensionalityReq) =>
  http.post("/embodied-user-api/manager/evaluation/dimension/v1/update", params);
export const reqDelDimensionality = (params: CommonId) =>
  http.post("/embodied-user-api/manager/evaluation/dimension/v1/remove", params);
export const reqDimensionalityList = () =>
  http.get<DimensionalityListRes[]>("/embodied-user-api/manager/evaluation/dimension/v1/list");
// 测评方案
export const reqAddScheme = (params: AddSchemeReq) =>
  http.post("/embodied-user-api/manager/evaluation/plan/v1/save", params);
export const reqEditScheme = (params: EditSchemeReq) =>
  http.post("/embodied-user-api/manager/evaluation/plan/v1/update", params);
export const reqEditSchemeStatus = (params: EditSchemeStatusReq) =>
  http.post("/embodied-user-api/manager/evaluation/plan/v1/updateStatus", params);
export const reqDelScheme = (params: CommonId) =>
  http.post("/embodied-user-api/manager/evaluation/plan/v1/remove", params);
export const reqSchemeList = () =>
  http.get<SchemeListRes[]>("/embodied-user-api/manager/evaluation/plan/v1/list");
