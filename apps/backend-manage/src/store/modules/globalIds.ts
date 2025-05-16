import { StateCreator } from "zustand";

interface CourseInfo {
  courseId: string;
  courseName: string;
  periodId: string;
  periodName: string;
}
interface BookVersionInfo {
  versionId: string;
  versionName: string;
}
interface TextbookInfo {
  textbookId: string;
  textbookName: string;
  gradeId: string;
  gradeName: string;
}

export interface ChapterNodeInfo {
  // node节点
  nodeId: string; // 树节点唯一id
  nodeName: string; // 树节点名称
  chapterId: string; // 章节id
  treeData?: any;
}
export interface IdsContext {
  ids: {
    course: CourseInfo;
    bookVersion: BookVersionInfo;
    textbook: TextbookInfo;
    node: ChapterNodeInfo;
    paperId?: string;
  };
  setIds(value: IdsContext["ids"]): void;
}

export const defaultIds: IdsContext["ids"] = {
  course: {
    courseId: "",
    courseName: "",
    periodId: "",
    periodName: "",
  },
  bookVersion: {
    versionId: "",
    versionName: "",
  },
  textbook: {
    textbookId: "",
    textbookName: "",
    gradeId: "",
    gradeName: "",
  },
  // node节点
  node: {
    nodeId: "", // 树节点唯一id
    nodeName: "",
    chapterId: "",
  },
  paperId: "",
};
export const createIds: StateCreator<IdsContext, [], [], IdsContext> = (set) => ({
  ids: defaultIds,
  setIds: (newVal) => set((state) => ({ ids: { ...state.ids, ...newVal } })),
});
