/* 模块管理 */
export interface ModuleDataRes {
  id: string;
  version: string;
  valid: number;
  updateTime: number;
  createTime: number;
  moduleName: string;
  moduleValue: string;
  schoolNumber: number;
}

export interface AddModuleReq {
  moduleName: string;
  moduleValue?: string;
}
export type UpdateModuleReq = AddModuleReq & CommonId;
