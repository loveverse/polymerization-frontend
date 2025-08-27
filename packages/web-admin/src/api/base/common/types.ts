import { RoleDataRes } from "@/api/system/types"
import { TreeDataNode } from "antd"

/* 学校管理 */
export interface PeriodListRes {
  id: string
  version: string
  valid: number
  updateTime: number
  createTime: number
  periodName: string
  orderValue: number
}

export interface AreaTreeRes {
  id: number
  level: number
  parentCode: string
  areaCode: string
  zipCode: number
  cityCode: string
  name: string
  shortName: string
  mergerName: string
  pinyin: string
  lng: string
  lat: string
  children: AreaTreeRes[]
}

export interface UserInfo {
  username: string
  name: string
  roles: RoleDataRes[]
  title: string
  gender: string
  phoneNumber: string
  email: string
  id: string
  createTime: number
  headImg: string
}

export interface UpdateUserPasswordReq {
  id: string
  oldPassword: string
  newPassword: string
}

export interface GradeListRes {
  id: string
  gradeName: string
  periodId: string
  orderValue: number
  schoolId: string
  gradeNumber: number
}

export interface ChapterTreeReq {
  courseId: string
  gradeId: string
  textbookId: string
  periodId: string
  countType: string //统计类型[1: 题库, 2: 卷库, 3: 多媒体]
}

export interface ChapterTreeRes extends TreeDataNode {
  nodeName: string
  nodeId: string
  chapterId: string
  courseId: string
  gradeId: string
  leafId: string
  number: number
  pid?: string
  nodePid: string
  children: ChapterTreeRes[]
}
