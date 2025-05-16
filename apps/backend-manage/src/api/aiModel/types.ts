import { TreeDataNode } from "antd";
import { CoursePageRes } from "../course/course/types";

/* 模型 */
export interface AiModelListRes extends TreeDataNode {
  aiModels: {
    key: string;
    value: string;
    [key: string]: any;
  }[];
  num: number;
  subjectDto: CoursePageRes;
  [key: string]: any;
}

export interface AddAiModelReq {
  subjectId: string;
  name: string;
}
export type EditAiModelReq = AddAiModelReq & CommonId;
export interface DelAiModelReq {
  tagId: string;
}

/* 添加模型标签 */
export interface ModelTagListRes {
  id: string;
  name: string;
  value: string;
  sn: number;
}
export interface ModelTagParams {
  name: string;
  value: string;
  sn?: number;
}
export interface AddModelTagReq {
  aiId: string;
  tagList: ModelTagParams[];
}
export type EditModelTagReq = ModelTagParams & CommonId;
export type ModelTagListReq = Pick<AddModelTagReq, "aiId">;
export interface ExperimentListReq {
  aiId: string;
  page: number;
  size: number;
  sort?: string;
  status?: string;
  subjectId: string;

  isEnable?: string;
}
export interface ExperimentListRes {
  id: string;
  name: string;
  subjectId: string;
  status: string;
  createUserId: string;
  createTime: string;
  isEnable: boolean;
}

// 添加实验内容
export interface AddExperimentContentReq {
  id: string;
  aiId: string;
  equipments: string;
  name: string;
  requirements: string;
  subjectId: number;
}

interface Evaluate {
  evaluateContent: string;
  id: number;
  sn: number;
  score: number;
  tags: string[] | any[];
}
interface StandardForEvaluation {
  evaluates: Evaluate[];
  id: number;
  requirements: string;
  sn: number;
  [key: string]: any;
}
export interface AddExperimentStepReq {
  contentId: string;
  list: StandardForEvaluation[];
}

interface ExperimentQuestion {
  id: string;
  expandsJson: string;
  parse: string;
  question: string;
  questionType: string;
  sn: number;
  score: number;
  [key: string]: any;
}
export interface AddExperimentReportReq {
  list: ExperimentQuestion[];
  contentId: string;
}

export interface AddExperimentReq {
  aiId: string;
  chapterId: string;
  enableAi: boolean;
  name: string;
  subjectId: string;
  gradeId: string;
  type: string;
}
export interface EditExperimentReq{
  
}
export interface GetExperimentInfoReq {
  aiId: string;
}

export interface ViewExperimentRes extends Omit<AddExperimentContentReq, "aiId" | "id"> {
  contentId: string;
  steps: StandardForEvaluation[];
  questions: ExperimentQuestion[];
  questionList: ExperimentQuestion[];
}
export interface ExperimentPageReq extends RecordReq {
  chapterId: string;
  subjectId: string;
  gradeId: string;
  type: string;
}

export interface EditExperimentScoreReq {
  experimentContentId: string;
  experimentStepList: Pick<Evaluate, "id" | "score">[];
  operationPercentage: number;
  questionList: Pick<ExperimentQuestion, "id" | "score">[];
  questionPercentage: number;
  scoreType: string;
}
