import { UploadFile } from "antd";

export interface ResponseFile  {
  id: string;
  name: string;
  url: string;
}
export type UploadFileRes = UploadFile<ResponseFile>

export interface UploadExcelData {
  baseType: string;
  choiceNumber: number;
  questionAnalysis: string;
  questionContent: string;
  answerNumber: number;
  sourceType: string;
  [key: string]: any;
}
export interface UploadExcelRes {
  failList: UploadExcelData[];
  successList: UploadExcelData[];
  failColumns: Record<string, any>[];
}
export interface SaveUploadExcelReq {
  chapterId: string;
  courseId: string;
  gradeId: string;
  questions: UploadExcelData[];
}
