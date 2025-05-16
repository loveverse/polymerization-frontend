import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import {
  Drawer,
  Tree,
  message,
  DrawerProps,
  Spin,
  Button,
  Space,
  Select,
  TreeNodeProps,
} from "antd";
import { useAppContext } from "@/context";

import { reqChapterTree } from "@/api/resource/question";
import { ChapterTreeRes } from "@/api/resource/question/types";

import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

export interface ChapterChildRef extends ChildRef {
  setChapterIds: Dispatch<SetStateAction<string[]>>;
  getChapterTree: (value: QuestionId) => void;
}
interface ChapterChildProps {
  handleSubmit: (chapterId: string, questionId: QuestionId) => void;
}
export type QuestionId = string | string[];
const ComSetChapter = forwardRef<ChapterChildRef, DrawerProps & ChapterChildProps>(function Child(
  props,
  ref
) {
  useImperativeHandle(ref, () => {
    return {
      setShow,
      setConfirmLoading,
      setChapterIds,
      getChapterTree,
    };
  });

  const { dicts } = useAppContext();
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 设置知识点
  const [loading, setLoading] = useState(false);
  const [gradeIndex, setGradeIndex] = useState("0");
  const [chapterIds, setChapterIds] = useState<string[]>([]);
  const [questionId, setQuestionId] = useState<QuestionId>("");
  const [treeData, setTreeData] = useState<ChapterTreeRes[]>([]);
  const getChapterTree = async (value: QuestionId) => {
    setLoading(true);
    const questionIds = Array.isArray(value) ? value : [value];
    const res = await reqChapterTree(questionIds);
    if (res.code === 200) {
      setTreeData(res.data);
      setQuestionId(value);
      if (!res.data.length) {
        setGradeIndex("");
      }
    } else {
      message.error(res.message);
    }
    setLoading(false);
  };
  const chapterTree = useMemo(() => {
    return treeData.length ? treeData[+gradeIndex].chapters : [];
  }, [treeData, gradeIndex]);

  const handleClose = () => {
    setQuestionId("");
    setChapterIds([]);
    setShow(false);
  };
  const handleConfirm = () => {
    props.handleSubmit(chapterIds[0], questionId);
  };

  return (
    <Drawer
      {...props}
      placement="right"
      title="设置章节"
      open={show}
      width={450}
      onClose={handleClose}
      extra={
        <Space>
          <Button onClick={handleClose}>取消</Button>
          <Button type="primary" loading={confirmLoading} onClick={handleConfirm}>
            确定
          </Button>
        </Space>
      }>
      <Spin spinning={loading} tip="Loading..." style={{ height: "300px" }}>
        <Select
          value={gradeIndex}
          style={{ width: 130, marginBottom: 20 }}
          options={treeData.map((item, index) => {
            const volumeName = dicts.getLabel("textbook_volume", item.volumeType);
            return {
              value: index + "",
              label: item.gradeName + volumeName,
            };
          })}
          onChange={(value) => {
            // 切换时清空选中
            setChapterIds([]);
            setGradeIndex(value);
          }}></Select>

        {chapterTree.length ? (
          <Tree
            treeData={chapterTree}
            fieldNames={{
              title: "chapterName",
              key: "id",
              children: "children",
            }}
            switcherIcon={(props: TreeNodeProps) => {
              return props.expanded ? <MinusOutlined /> : <PlusOutlined />;
            }}
            defaultExpandAll
            showLine
            blockNode
            selectedKeys={chapterIds}
            onSelect={(selectedKeys) => {
              if (selectedKeys.length) {
                setChapterIds(selectedKeys as string[]);
              }
            }}
          />
        ) : null}
      </Spin>
    </Drawer>
  );
});
export default ComSetChapter;
