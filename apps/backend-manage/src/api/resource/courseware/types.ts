export interface MultimediaPageReq extends PageReq {
  data: {
    chapterId?: string;
    knowledgeId?: string;
    courseId?: string;
    gradeId?: string;
    containerChildren?: boolean;
    multimediaType?: string;
    resourceStatus?: string;
    yearValue?: string;
    isSchoolResource?: number; // 0:个人，1:校本  // 备课不传
    selectPrepareLesson?: boolean;
  };
}

export interface FileParams {
  fileName: string;
  fileSize: string;
  fileUrl: string;
}
export interface UploadResourceReq extends FileParams {
  chapterId: string;
  gradeId: string;
  courseId: string;

  isSyncPersonal: string;
  multimediaName: string;
  multimediaType: string;
}
export type EditResourceReq = Omit<UploadResourceReq, "courseId" | "gradeId"> & CommonId;

export interface MultimediaPageRes {
  auditStatus: string;
  multimediaName: string;
  multimediaType: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: string;
  isDisabled: number;
  isSchoolResource: number;
  useNumber: number;
  downloadNumber: number;
  courseId: string;
  gradeId: string;
  chapterId: string;
  createBy: string;
  createByName: string;
  schoolId: string;
  id: string;
  updateTime: number;
  chapterName: string;
  isSyncPersonal: number;
  isReference: number;
  shareTime: number;
  shareCreateByName: string;
  resourcePrepareLessonId: string;
}
export interface QuoteResourceReq extends CommonId {
  resourceType: string;
}
export interface SyncToPersonalReq extends QuoteResourceReq {
  isSyncPersonal: number; // 1：是, 0：否
}
