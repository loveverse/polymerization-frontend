import http from "@/utils/http";
import {
  AddOrUpdateChapterNode,
  ChapterTreeRes,
  EditTextbookReq,
  TextBookListReq,
  TextBookListRes,
  UpdateTextbookStatusReq,
} from "./types";

export const reqTextBookPage = (params: TextBookListReq) =>
  http.post<PageRes<TextBookListRes>>(
    "/embodied-user-api/manager/course-book/v1/page_textbook",
    params
  );
export const reqEditTextbook = (params: EditTextbookReq) =>
  http.post("/embodied-user-api/manager/course-book/v1/saveOrUpdate_textbook", params);
export const reqUpdateTextbookStatus = (params: UpdateTextbookStatusReq) =>
  http.post("/embodied-user-api/manager/course-book/v1/change_book_disabled", params);
export const reqDelTextbook = (params: CommonId) =>
  http.post("/embodied-user-api/manager/course-book/v1/remove_book", params);

export const reqTextbookTree = (params: { textbookId: string }) =>
  http.post<ChapterTreeRes[]>("/embodied-user-api/manager/course-book/v1/chapter_tree", params);
export const reqUploadChapter = (params: FormData) =>
  http.post(
    "/embodied-user-api/manager/course-book/v1/save_chapter_to_textbook_from_file",
    params,
    "formData"
  );
export const reqAddOrUpdateChaterNode = (params: AddOrUpdateChapterNode) =>
  http.post("/embodied-user-api/manager/course-book/v1/saveOrUpdate_chapter", params);
export const reqDelChatperNode = (params: CommonId) =>
  http.post("/embodied-user-api/manager/course-book/v1/remove_chapter", params);
