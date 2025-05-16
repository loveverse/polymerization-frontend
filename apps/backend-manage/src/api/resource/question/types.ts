import { TreeDataNode } from "antd";

export interface NodeInfoReq {
  levelId?: string;
  chapterId?: string;
  knowledgeId?: string;
  nodePid?: string;
}
export interface KnowledgeOrChapterTreeReq {
  containerChildren: boolean; // true: 包含子节点, false: 不包含
  countSchool: boolean; // ture:学校数量, 2: 个人数量
  countType: number; // 1:题库, 2:卷库
  courseId: string;
  gradeId: string;
  leafType: number; // 1:章节, 2:知识点
  textbookId?: string;
  periodId: string;
}
export interface KnowledgeOrChapterTreeRes extends TreeDataNode {
  nodeName: string;
  nodeId: string;
  type?: number;
  knowledgeId?: string;
  chapterId?: string;
  courseId: string;
  gradeId: string;
  leafId: string;
  levelId?: string;
  number: number;
  pid?: string;
  nodePid: string;
  children: KnowledgeOrChapterTreeRes[];
}

export interface SchoolQuestionData {
  baseType?: string;
  dateRange?: string[];
  courseId: string;
  gradeId: string;
  chapterId: string;
}
export interface SchoolQuestionPageReq extends PageReq {
  data: SchoolQuestionData;
}
/* 题库响应 */

interface QuestionAnswer {
  type: string;
  answer: string;
}
export interface QuestionKnowledge {
  id: string;
  nodeName: string;
}
export interface QuestionPageRes {
  id: string;
  createTime: number;
  questionContent: string;
  questionAnalysis: string;
  questionAnswer: QuestionAnswer[];
  answerNumber: number;
  choiceNumber: number;
  baseType: string;
  sourceType: string;
  origin: string;
  hardType: string;
  useNumber: number;
  schoolId: string;
  levelId: string;
  relativeId: string;
  leafId: string;
  hashValue: string;
  isDisabled: number;
  createBy: string;
  updateBy: string;
  updateTime: number;
  answerList: QuestionAnswer[];
  num: number;
  levelName: string;
  metrics: TargetTreeRes[];
  knowledgeId: string;
  chapterId: string;
  courseId: string;
  gradeId: string;
  containerChildren: boolean;
  knowledges: QuestionKnowledge[];
  isSchoolQuestion: number;
  chapterName: string;
  editable: number; // 0:不可编辑题目，1:可编辑
  resourceEditable: boolean; // 是否可以编辑知识点，章节，指标
  show: boolean; // 控制查看解析
  selected: boolean; // 控制是否选中
  auditStatus: string; // 审核状态
  questionContentTemp: string;
  shareCreateByName: string;
  shareTime: number;
}
/* 知识点 */
export interface KnowledgeTreeRes extends TreeDataNode {
  id: string;
  createTime: number;
  nodeName: string;
  // disabled: number;
  courseKnowledgeId: string;
  pid: string;
  schoolId: string;
  children?: KnowledgeTreeRes[];
}

export interface SetQuestionChapterReq {
  id: string;
  chapterId?: string;
  levelId?: string;
}
export interface SetQuestionKnowledgeReq {
  id: string;
  knowledgeIds: string[];
}
/* 层级列表 */
export interface LevelListRes {
  id: string;
  levelName: string;
  schoolId: string;
}

export interface ChapterTreeReq {
  courseId: string;
  ids: string[];
  textbookId?: string;
}
interface ChapterTree extends TreeDataNode {
  id: string;
  schoolId: string;
  textbookId: string;
  chapterName: string;
  createBy: string;
  pid: string;
  orderValue: number;
  // disabled: number;
  children: ChapterTree[];
}
export interface ChapterTreeRes extends Omit<TextBookVos, "textbookName" | "courseId"> {
  chapters: ChapterTree[];
}

// 指标
export interface TargetTreeRes extends TreeDataNode {
  id: string;
  version: string;
  valid: number;
  updateTime: number;
  createTime: number;
  content: string;
  pid: string;
  repositoryId: string;
  level: string;
  type: string;
  enabled: boolean;
  children: TargetTreeRes[];
}
export interface SetTargetReq {
  id: string;
  schoolIndexs: { id: string }[];
}

/* 手动录题 */
export interface AddQuestionReq {
  courseId: string;
  gradeId: string;
  chapterId: string;

  questionContent: string;
  questionAnalysis?: string;
  baseType: string;
  sourceType: string; // 类型名字

  origin: string; // 来源定死
  choiceNumber: number; // 选项数量
  answerList: { answer: string; type: string }[];
}
/* 试题篮 */
export interface QuestionType {
  type: string;
  globalType: string;
  orderValue: number;
  questionList: BasketQuestionInfo[];
  globalIndex: number;
  typeSumScore: string;
  studentSumScore: string;

  // 自定义字段
  defaultScore?: number;
  knowledgeId?: string;
  levelId?: string;
  metrics: TargetTreeRes[];
}
export interface IUpdatePaperInfo {
  paperId: string;
  updateQuestion: {
    questionId: string;
    score?: string | number;
    sort?: number;
  }[];
}
export interface IUpdatePaperScore {
  paperId: string;
  listQuestion: {
    id: string;
    questionScoreList: {
      questionIndex: number;
      score: string;
    }[];
  }[];
}
export interface IUpdatePaperName {
  paperName: string;
  id: string;
}

export interface GlobalTypeList {
  typeName: string;
  questionType: QuestionType[];
}
interface QuestionScoreList {
  id: string;
  version: string;
  valid: number;
  updateTime: number;
  createTime: number;
  paperId: string;
  questionId: string;
  questionIndex: number;
  score: number;
}
export interface BasketQuestionInfo extends QuestionPageRes {
  globalIndex: number;
  indexContinue: number;
  score: number;
  paperIndexs: string[];
  questionScoreList: QuestionScoreList[];

  // 自定义字段
  defaultScore: number;
}
export interface QuestionBasketInfo {
  paperId: string;
  isDisabled: number;
  paperName: string;
  globalTypeList: GlobalTypeList[];
  removedList: BasketQuestionInfo[];
  questionIds: string[];
  sumScore: null;
  studentSumScore: null;
  editable: number;
  isSchoolPaper: number;
}
export interface QuestionToBasket {
  paperId: string;
  questionId: string;
}
export interface QuestionsFromBasket {
  paperId: string;
  questionIds: string[];
}
export interface IAddQuestion {
  paperId: string;
  questionContent: string;
  questionAnalysis: string;
  questionAnswer: {
    answer: string;
    type: string;
  }[];
  choiceNumber: number;
  baseType: string;
  hardType: string;
}

export interface IQuestionContinuous {
  paperId: string;
  questionId: string;
  indexContinue: number; // 0:不连续; 1:连续
}
/* 题目操作 */
export interface EditQuestionReq {
  id: string;
  questionAnswer?: { answer: string }[];
  questionContent?: string;
  questionAnalysis?: string;
  baseType?: string;
  hardType?: string;
  answerNumber?: number;
  choiceNumber?: number;
  knowledgeId?: string;
  chapterId?: string;
}
