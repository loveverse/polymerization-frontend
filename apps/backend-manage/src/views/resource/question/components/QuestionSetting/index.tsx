import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Tag, message } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { reqSetSomeChapter } from "@/api/resource/question";
import { QuestionPageRes } from "@/api/resource/question/types";
import SetChapter, { ChapterChildRef, QuestionId } from "../SetChapter";

import styles from "./index.module.scss";

interface QuestionSettingProps {
  isEditable: boolean; // true: 可编辑 false: 不可编辑。权限控制
  questionInfo: QuestionPageRes;
  refreshFn(): void;
}

export interface QuestionSettingRef {
  openChapter(questionIds: string[]): void;
}

const QuestionSetting = forwardRef<QuestionSettingRef, QuestionSettingProps>(function Child(
  props,
  ref
) {
  useImperativeHandle(
    ref,
    () => {
      return {
        openChapter,
      };
    },
    []
  );
  const { isEditable, questionInfo, refreshFn } = props;
  // 设置章节
  const chapterRef = useRef<ChapterChildRef>(null);
  const setQuestionChapter = async (chapterId: string, questionId: QuestionId) => {
    chapterRef.current?.setConfirmLoading(true);
    const questionIds = Array.isArray(questionId) ? questionId : [questionId];
    const params = questionIds.map((item) => {
      return {
        id: item,
        chapterId,
      };
    });
    const res = await reqSetSomeChapter(params);
    if (res.code === 200) {
      message.success("设置章节成功");
      chapterRef.current?.setShow(false);
      refreshFn();
    } else {
      message.error(res.message);
    }
    chapterRef.current?.setConfirmLoading(false);
  };

  /* 向外暴露API:批量操作 */
  const openChapter = (questionIds: string[]) => {
    chapterRef.current?.setShow(true);
    chapterRef.current?.getChapterTree(questionIds);
  };

  return (
    <div className={styles.root}>
      <div className="question-set-header">
        <div className="chapter-and-knowledge">
          <div className="chapter-box">
            {questionInfo.chapterName ? (
              <Tag
                className="add-tag"
                icon={isEditable ? <EditOutlined /> : null}
                onClick={() => {
                  if (!isEditable) return;
                  chapterRef.current?.setShow(true);
                  chapterRef.current?.setChapterIds([
                    questionInfo.chapterId || questionInfo.knowledgeId,
                  ]);
                  chapterRef.current?.getChapterTree(questionInfo.id);
                }}>
                {questionInfo.chapterName}
              </Tag>
            ) : isEditable ? (
              <Tag
                className="add-tag"
                icon={<PlusOutlined />}
                onClick={() => {
                  chapterRef.current?.setShow(true);
                  chapterRef.current?.setChapterIds([
                    questionInfo.chapterId || questionInfo.knowledgeId,
                  ]);
                  chapterRef.current?.getChapterTree(questionInfo.id);
                }}>
                设置章节
              </Tag>
            ) : (
              <Tag className="add-tag">未设置章节</Tag>
            )}
          </div>
        </div>

        <div className="target-box"></div>
      </div>
      <SetChapter ref={chapterRef} handleSubmit={setQuestionChapter}></SetChapter>
    </div>
  );
});

export default QuestionSetting;
