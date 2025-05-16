import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, memo } from "react";
import { Popover, Tree, message, Button } from "antd";
import type { TreeProps, TreeNodeProps } from "antd";
import { MinusOutlined, PlusOutlined, SwapOutlined } from "@ant-design/icons";
import { useUpdateEffect } from "ahooks";

import { reqChapterTree, reqBaseCourseData, reqExperimentChapterTree } from "@/api/base";
import { ChapterTreeRes } from "@/api/base/types";
import { expandedKeysLoop } from "@/utils/common";
import { SpinLoading } from "@/components";

import { useAppContext } from "@/context";
import styles from "./index.module.scss";
import { Store, useIds } from "@/store";

interface ChildTreeProps {
  countType: string; // [1: 题库, 2: 卷库, 3: 多媒体]
  isExperimentalCurriculum?: boolean;
  callPage?: (node: Store["ids"]["node"]) => void;
}
export interface ChildTreeRef {
  bookIds: Store["ids"];
  innerTreeData: () => ChapterTreeRes[];
}

interface Options {
  bookVersions: BookVersionVos[];
  textbooks: TextBookVos[];
}
type ResetType = "period" | "course" | "version" | "textbook";

const ComGradeTree = forwardRef<ChildTreeRef, ChildTreeProps>(function Child(props, ref) {
  const [treeData, setTreeData] = useState<ChapterTreeRes[]>([]);
  useImperativeHandle(
    ref,
    () => {
      return {
        bookIds: tempIds,
        innerTreeData,
      };
    },
    [treeData]
  );
  const { isExperimentalCurriculum = false, countType, callPage } = props;

  const { dicts } = useAppContext();
  const { ids, setIds } = useIds();
  const tempIds = useRef<Store["ids"]>(ids).current;
  const knowledgeInfo = useRef<PeriodVos[]>([]);

  const getBaseData = async () => {
    const res = await reqBaseCourseData(isExperimentalCurriculum ? { courseClassify: "sy" } : {});
    if (res.code === 200) {
      knowledgeInfo.current = res.data.periods || []; // 防止返回null
      filterPeriod();
    } else {
      message.error(res.message);
    }
  };
  // 教材
  const [options, setOptions] = useState<Options>({
    bookVersions: [],
    textbooks: [],
  });
  const [courseVisiable, setCourseVisiable] = useState(false);
  const [textbookVisiable, setTextbookVisiable] = useState(false);
  /**
   *
   * @param type course:清空所有；version:清空版本；textbook:清空教材
   */
  const resetTempIds = (type: ResetType) => {
    if (type === "period") {
      tempIds.course.periodId = "";
      tempIds.course.periodName = "";
    }
    if (type === "course" || type === "period") {
      tempIds.course.courseId = "";
      tempIds.course.courseName = "";
    }
    if (type === "version" || type === "course" || type === "period") {
      tempIds.bookVersion.versionId = "";
      tempIds.bookVersion.versionName = "";
    }
    tempIds.textbook.gradeId = "";
    tempIds.textbook.gradeName = "";
    tempIds.textbook.textbookId = "";
    tempIds.textbook.textbookName = "";
    tempIds.node.nodeId = "";
    setTreeData([]);
  };

  // 过滤学段
  const filterPeriod = () => {
    const periods = knowledgeInfo.current;
    // 不存在学段
    if (!periods.length) {
      resetTempIds("period");
      return;
    }
    // 不管第一次还是已经选中过，直接进来找
    const findInfo = periods.find((k) => k.periodId === tempIds.course.periodId);
    const periodInfo = findInfo || periods[0];
    const findIndex = periodInfo.courseVos.findIndex((k) => k.courseId === tempIds.course.courseId);
    const courseIndex = findIndex !== -1 ? findIndex : 0;
    filterCourse(periodInfo, courseIndex);
  };
  const filterCourse = (periodInfo: PeriodVos, courseIndex: number) => {
    // 学段中不存在课程
    if (!periodInfo.courseVos.length) {
      resetTempIds("course");
      setOptions({ bookVersions: [], textbooks: [] });
      return;
    }
    // 找不到或者第一次进来，默认第一个
    tempIds.course.periodId = periodInfo.periodId;
    tempIds.course.periodName = periodInfo.periodName;
    const courseInfo = periodInfo.courseVos[courseIndex]; // 课程信息
    tempIds.course.courseId = courseInfo.courseId; // 设置默认课程id
    tempIds.course.courseName = courseInfo.courseName;
    setOptions({ ...options, bookVersions: courseInfo.bookVersionVos });
    filterBookVersion(courseInfo.bookVersionVos);
  };
  // 过滤版本
  const filterBookVersion = (bookVersions: BookVersionVos[]) => {
    // 课程中不存在版本
    if (!bookVersions.length) {
      // 清空版本id和教材id
      resetTempIds("version");
      setOptions({ bookVersions: [], textbooks: [] });
      return;
    }
    // 通过版本id获取其他版本信息
    const findInfo = bookVersions.find((k) => k.versionId === tempIds.bookVersion.versionId);

    const versionInfo = findInfo || bookVersions[0];
    tempIds.bookVersion.versionId = versionInfo.versionId;
    tempIds.bookVersion.versionName = versionInfo.versionName;
    setOptions(() => ({ bookVersions, textbooks: versionInfo.textBookVos }));
    filterTextbook(versionInfo.textBookVos);
  };
  // 过滤版本对应的教材
  const filterTextbook = (textbooks: TextBookVos[]) => {
    if (!textbooks.length) {
      // 清空教材id
      resetTempIds("textbook");
      setOptions({ ...options, textbooks: [] });
      return;
    }
    const findInfo = textbooks.find((k) => k.textbookId === tempIds.textbook.textbookId);
    if (!findInfo) {
      tempIds.node.nodeId = "";
    }
    const textbookInfo = findInfo || textbooks[0];
    tempIds.textbook.textbookId = textbookInfo.textbookId;
    tempIds.textbook.textbookName = textbookInfo.textbookName;
    tempIds.textbook.gradeId = textbookInfo.gradeId;
    tempIds.textbook.gradeName = textbookInfo.gradeName;
    getAllChapterList();
  };

  // 获取树节点
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [defaultSelect, setDefaultSelect] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const getAllChapterList = async () => {
    setLoading(true);
    // 处理不存在知识点和章节切换
    const callFn: any = isExperimentalCurriculum ? reqExperimentChapterTree : reqChapterTree;
    const res = await callFn({
      offset: 1,
      size: 1000,
      courseId: tempIds.course.courseId,
      gradeId: tempIds.textbook.gradeId,
      textbookId: tempIds.textbook.textbookId,
      periodId: tempIds.course.periodId,
      subjectId: tempIds.course.courseId,
      countType,
      type: "company",
    });
    if (res.code === 200) {
      setTreeData(res.data);
      if (res.data.length) {
        // 默认展开第一条数据
        const keys = expandedKeysLoop(res.data);
        setExpandedKeys(keys);
        if (!tempIds.node.nodeId) {
          tempIds.node.nodeId = res.data[0].nodeId;
          tempIds.node.chapterId = res.data[0].chapterId;
          tempIds.node.nodeName = res.data[0].nodeName;
        }
        setDefaultSelect([tempIds.node.nodeId]);
      }
    } else {
      message.error(res.message);
    }
    setIds(tempIds);
    callPage?.({ ...tempIds.node });
    setLoading(false);
  };
  
  const onSelect: TreeProps<ChapterTreeRes>["onSelect"] = (_, { node }) => {
    setDefaultSelect([node.nodeId]);
    setIds({
      ...ids,
      node: {
        chapterId: node.chapterId,
        nodeId: node.nodeId,
        nodeName: node.nodeName,
      },
    });
    callPage?.(node);
  };
  // 向外暴露的API
  const innerTreeData = () => {
    return treeData;
  };

  useUpdateEffect(() => {
    getAllChapterList();
  }, []);

  useEffect(() => {
    getBaseData();
  }, []);

  return (
    <div className={styles.root}>
      <div className="filter-header">
        <Popover
          placement="bottomRight"
          arrow={false}
          trigger="hover"
          rootClassName={styles["subject-popover"]}
          open={courseVisiable}
          onOpenChange={(value) => setCourseVisiable(value)}
          content={knowledgeInfo.current.map((item, index) => {
            return (
              <div key={index} className="period-box">
                <div className="school-title">{item.periodName}</div>
                <ul className="school-list">
                  {item.courseVos.map((k, ki) => (
                    <li
                      key={k.courseId}
                      className={
                        k.courseId === tempIds.course.courseId &&
                        item.periodId === tempIds.course.periodId
                          ? "active"
                          : ""
                      }
                      onClick={() => {
                        filterCourse(item, ki);
                        setCourseVisiable(false);
                      }}>
                      {k.courseName}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}>
          <div className="title">
            <div className="decorate"></div>
            <h3 className="course-name ">
              {tempIds.course.periodName}
              {tempIds.course.courseName}
            </h3>
            <div className="decorate"></div>
          </div>
        </Popover>
        <div className="textbook">
          <span className="book-name">
            {tempIds.bookVersion.versionName}/{/* {tempIds.textbook.gradeName} */}
            {tempIds.textbook.textbookName}
          </span>
          <div>
            <Popover
              placement="bottom"
              trigger="click"
              open={textbookVisiable}
              rootClassName={styles["grade-popover"]}
              onOpenChange={(value) => setTextbookVisiable(value)}
              content={
                <div>
                  <div className="book-version-box">
                    <p className="text-name">教材版本</p>
                    <ul>
                      {options.bookVersions.map((item, index) => {
                        return (
                          <li
                            key={index}
                            className={
                              item.versionId === tempIds.bookVersion.versionId ? "active" : ""
                            }
                            onClick={() => {
                              tempIds.bookVersion.versionId = item.versionId;
                              tempIds.bookVersion.versionName = item.versionName;
                              filterTextbook(item.textBookVos);
                            }}>
                            {item.versionName}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="textbook-box">
                    <p className="text-name">年级册</p>
                    <ul>
                      {options.textbooks.map((item) => {
                        return (
                          <li
                            key={item.textbookId}
                            className={
                              item.textbookId === tempIds.textbook.textbookId ? "active" : ""
                            }
                            onClick={() => {
                              tempIds.textbook.textbookId = item.textbookId;
                              tempIds.textbook.textbookName = item.textbookName;
                              tempIds.textbook.gradeId = item.gradeId;
                              tempIds.textbook.gradeName = item.gradeName;
                              setTextbookVisiable(false);
                              getAllChapterList();
                            }}>
                            {item.gradeName}
                            {dicts.getLabel("textbook_volume", item.volumeType)}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              }>
              <Button icon={<SwapOutlined />} type="link" title="切换教材"></Button>
            </Popover>
          </div>
        </div>
      </div>
      <div className="chapter-list">
        <SpinLoading spinning={loading} hasData={treeData.length}>
          <Tree
            showLine
            showIcon={false}
            treeData={treeData}
            fieldNames={{
              title: "nodeName",
              key: "nodeId",
              children: "children",
            }}
            switcherIcon={(props: TreeNodeProps) => {
              return props.expanded ? <MinusOutlined /> : <PlusOutlined />;
            }}
            expandAction="doubleClick"
            expandedKeys={expandedKeys}
            selectedKeys={defaultSelect}
            onSelect={onSelect}
            onExpand={(expandedKeys) => setExpandedKeys(expandedKeys)}
            titleRender={(node) => `${node.nodeName}(${node.number})`}
          />
        </SpinLoading>
      </div>
    </div>
  );
});

export default memo(ComGradeTree);
