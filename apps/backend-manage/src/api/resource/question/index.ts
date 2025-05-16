import http from "@/utils/http/index";
import {
  AddQuestionReq,
  ChapterTreeRes,
  EditQuestionReq,
  IAddQuestion,
  IQuestionContinuous,
  KnowledgeOrChapterTreeReq,
  KnowledgeOrChapterTreeRes,
  KnowledgeTreeRes,
  LevelListRes,
  NodeInfoReq,
  QuestionBasketInfo,
  QuestionToBasket,
  QuestionsFromBasket,
  QuestionPageRes,
  SchoolQuestionPageReq,
  SetQuestionKnowledgeReq,
  SetTargetReq,
  TargetTreeRes,
  IUpdatePaperInfo,
  IUpdatePaperScore,
  SetQuestionChapterReq,
  IUpdatePaperName,
} from "./types";

// 节点
export const reqNodeName = (params: NodeInfoReq) =>
  http.post("/embodied-user-api/knowledgeAndChapter/v1/query_name", params);
export const reqBaseCourseData = () =>
  http.post("/embodied-question-api/bs-chapter-knowledge/v2/list");
// 带层级
export const reqKnowledgeOrChapterTree = (params: KnowledgeOrChapterTreeReq) =>
  http.post<KnowledgeOrChapterTreeRes[]>(
    "/embodied-question-api/bs-chapter-knowledge/v2/tree",
    params
  );
// 获取tree不带层级
export const reqKnowledgeOrChapterTreeNoLevel = (params: KnowledgeOrChapterTreeReq) =>
  http.post<KnowledgeOrChapterTreeRes[]>(
    "/embodied-question-api/bs-chapter-knowledge/v3/tree",
    params
  );

//校本题库列表
export const reqResourceQuestionPage = (params: SchoolQuestionPageReq) =>
  http.post<PageRes<QuestionPageRes>>(
    "/embodied-question-api/manager/bs-question-school/v2/page",
    params
  );
// 获取知识点树
export const reqKnowledgeTree = (params: string[]) =>
  http.post<KnowledgeTreeRes[]>(
    "/embodied-course-api/bs-paper-question/v2/query_knowledge_question",
    params
  );

// 设置章节和层级
export const reqSetSomeChapter = (params: SetQuestionChapterReq[]) =>
  http.post(
    "/embodied-question-api/manager/bs-paper-question/v1/remove_question_to_new_chapter",
    params
  );
// 设置知识点
export const reqSetSomeKnowledge = (params: SetQuestionKnowledgeReq[]) =>
  http.post("/embodied-question-api/bs-paper-question/v2/remove_question_to_new_knowledge", params);
// 获取层级列表
export const reqLevelList = () =>
  http.post<LevelListRes[]>("/embodied-course-api/school-manager/v1/level_list_all");
// 查询课程下章节树
export const reqChapterTree = (params: string[]) =>
  http.post<ChapterTreeRes[]>(
    "/embodied-question-api/manager/bs-paper-question/v1/query_chapter_question",
    params
  );

// 题目查指标
export const reqTargetTree = (params: string[]) =>
  http.post<TargetTreeRes[]>(
    "/embodied-question-api/bs-paper-question/v2/query_index_for_question",
    params
  );
export const reqSetTarget = (params: SetTargetReq[]) =>
  http.post("/embodied-question-api/bs-paper-question/v2/set_index_batch", params);

// 手动录题
export const reqSaveQuestion = (params: AddQuestionReq) =>
  http.post("/embodied-question-api/manager/bs-question-school/v2/add", params);

/* 试题篮 */
// 初始化试题篮
export const reqQuestionBasketInfo = (params: { paperId: string }) =>
  http.post<QuestionBasketInfo>("/embodied-course-api/bs-paper-question/v2/get_basket", params);
// 加入试题篮
export const reqAddQuestionToBasket = (params: QuestionToBasket) =>
  http.post("/embodied-course-api/bs-paper-question/v1/insert_basket", params);
// 移除试题篮
export const reqRemoveQuestionFromBasket = (params: QuestionToBasket) =>
  http.post("/embodied-course-api/bs-paper-question/v1/remove_question_from_basket", params);
// 批量移出试题篮
export const reqRemoveQuestionsFromBasket = (params: QuestionsFromBasket) =>
  http.post("/embodied-course-api/bs-paper-question/v1/batch/remove_question_from_basket", params);
// 试题排序或修改分数
export const reqUpdatePaperInfo = (params: IUpdatePaperInfo) =>
  http.post("/embodied-course-api/bs-paper-question/v1/batch_update", params);
export const reqUpdatePaperScore = (params: IUpdatePaperScore) =>
  http.post("/embodied-course-api/bs-paper-question/v1/batch_update_score", params);
// 试卷重命名
export const reqUpdatePaperName = (params: IUpdatePaperName) =>
  http.post("/embodied-course-api/bs-paper/v1/update", params);

export const reqAddQuestion = (params: IAddQuestion) =>
  http.post("/embodied-question-api/bs-paper-question/v1/create_question_to_paper", params);

export const reqConfirmExamPaper = (params: { paperId: string; workId: string }) =>
  http.post("/embodied-question-api/bs-paper/v1/finish_paper", params);

export const reqShareToSchool = (params: { id: string; workId: string }) =>
  http.post("/embodied-question-api/bs-paper/v1/enable_paper", params);

// 设置试卷试题是否连续
export const reqQuestionContinuous = (params: IQuestionContinuous) =>
  http.post("/embodied-question-api/bs-paper-question/v1/set_paperIndex", params);

/* 题目操作 */
// 编辑题目
export const reqEditQuestion = (params: EditQuestionReq) =>
  http.post("/embodied-question-api/manager/bs-question-school/v2/update", params);
// 删除一些题目
export const reqDelQuestions = (params: string[]) =>
  http.post("/embodied-question-api/manager/bs-question-school/v2/batch_delete", params);
// 删除单个题目
export const reqDelQuestion = (params: { schoolQuestionId: string }) =>
  http.post("/embodied-question-api/manager/bs-question-school/v2/remove_from_school", params);
// 查询题目解析
export const getQuestionAnswerDetail = (params: { questionIds: string[] }) =>
  http.post("/embodied-question-api/v1/query_question_detail", params);
