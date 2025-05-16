import { PeriodListRes } from "../base/types";

/* 角色管理 */
export interface RolePageRes {
  id: string;
  version: string;
  valid: number;
  updateTime: number;
  createTime: number;
  roleName: string;
  detail: string;
  userCount?: number;
}
export interface AddRoleReq {
  roleName: string;
}
export type UpdataRoleReq = AddRoleReq & CommonId;
export interface SetRolePermissionReq {
  roleId: string;
  powerIds: string[];
}

/* 字典管理 */
export interface IAddDict {
  name: string;
  description: string;
}
export interface IDelDict {
  dictId: string;
}
export type IUpdateDict = IAddDict & IDelDict;
export interface IAddDictDetail extends IDelDict {
  value: string;
  label: string;
  dictSort: number;
}
export interface IDelDictDetail {
  detailId: string;
}
export type IUpdateDictDetail = Omit<IAddDictDetail, "dictId"> & IDelDictDetail;

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

/* 测评 */
export interface AddDimensionalityReq {
  dimensionName: string;
}
export type EditDimensionalityReq = AddDimensionalityReq & CommonId;
export interface DimensionalityListRes {
  id: string;
  updateTime: number;
  createTime: number;
  dimensionName: string;
}
export interface AddSchemeReq {
  planDimensions: (Pick<PlanDimension, "dimensionId" | "leftNum" | "rightNum"> & { id?: string })[];
  courseId: string;
  isEnabled: boolean;
  planName: string;
  periodIds: string[];
}
export type EditSchemeReq = AddSchemeReq & CommonId;
export type EditSchemeStatusReq = Pick<EditSchemeReq, "id" | "isEnabled">;
interface PlanDimension extends DimensionalityListRes {
  planId: string;
  dimensionId: string;
  leftNum: number;
  rightNum: number;
}
export interface SchemeListRes {
  planName: string;
  courseId: string;
  periodIds: string[];
  isEnabled: boolean;
  planDimensions: PlanDimension[];
  courseName: string;
  periods: PeriodListRes[];
  id: string;
}
