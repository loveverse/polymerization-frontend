import { TreeDataNode } from "antd";

export interface TextBookListReq extends PageReq {
  data: {
    courseId: string;
    textbookName: string;
    disabled: number;
    gradeId: string;
  };
}

export interface TextBookListRes {
  id: string;
  version: string;
  valid: number;
  updateTime: number;
  createTime: number;
  textbookName: string;
  createBy: string;
  img: string;
  volumeType: string;
  disabled: number;
  orderValue: number;
  courseId: string;
  gradeId: string;
  periodId: string;
  editable: number;
  versionId: string;
  versionName: string;
  gradeName: string;
  periodName: string;
}

export type EditTextbookReq = TextBookListReq["data"] & {
  id?: string;
  volumeType: string;
  img?: string | Record<string, any>[];
  versionId: string;
};
export interface UpdateTextbookStatusReq extends CommonId {
  disabled: number;
}
export interface ChapterTreeRes extends TreeDataNode {
  id: string;
  version: string;
  valid: number;
  updateTime: number;
  createTime: number;
  schoolId: string;
  textbookId: string;
  chapterName: string;
  createBy: string;
  pid: string;
  orderValue: number;
  // disabled: number;
  flag: boolean; // 操作字段
  children: ChapterTreeRes[];
}

export interface AddOrUpdateChapterNode {
  chapterName: string;
  textbookId: string;
  disabled: number;
  orderValue: number;
  pid: string;
  id?: string;
}
