import React, { useState, useEffect, useRef } from "react";
import {
  Select,
  Space,
  Button,
  Checkbox,
  List,
  DatePicker,
  message,
  Modal,
  Form,
  Popconfirm,
  Card,
  Dropdown,
  Upload,
  UploadProps,
} from "antd";
import {
  QuestionCircleTwoTone,
  LeftCircleOutlined,
  RightCircleOutlined,
  DownOutlined,
  DownloadOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import { useOutletContext } from "react-router-dom";
import dayjs from "dayjs";

import {
  reqDelQuestion,
  reqDelQuestions,
  reqEditQuestion,
  reqResourceQuestionPage,
  reqSaveQuestion,
  reqSetSomeChapter,
} from "@/api/resource/question";
import { downloadFile, generateLetter } from "@/utils/common";
import { useAppContext } from "@/context";

import { PAGE_CURRENT, PAGE_SIZE, RANGE_PRESETS } from "@/utils/constant";
import { AddQuestionReq, EditQuestionReq, QuestionPageRes } from "@/api/resource/question/types";
import { ComEmpty, ComGradeTree } from "@/components";
import { EditQuestion, AddQuestionDrawer, QuestionSetting } from "./components";
import type {
  EditQuestionRef,
  AddQuestionForm,
  AddQuestionRef,
  QuestionSettingRef,
} from "./components";

import styles from "./index.module.scss";
import { Store, useIds } from "@/store";
import { reqDownloadExcel, reqUploadExcel } from "@/api/base";
import ImportQuestion from "./components/ImportQuestion";

const { RangePicker } = DatePicker;

export default function Question() {
  const { ids, setIds } = useIds();

  const { dicts } = useAppContext();
  //题目列表数据
  const [questionData, setQuestionData] = useState<PageRes<QuestionPageRes>>({
    page: PAGE_CURRENT,
    size: PAGE_SIZE,
    data: [],
    total: 0,
  });
  // 选中的questionId
  const selecteds = questionData.data.filter((k) => k.selected).map((v) => v.id);
  const [nodeInfo, setNodeInfo] = useState<Store["ids"]["node"] | null>(null);
  const [loading, setLoading] = useState(false);
  //获取题目列表
  const getQuestionPage = async (page = PAGE_CURRENT, size = PAGE_SIZE) => {
    if (!nodeInfo || !nodeInfo.nodeId) {
      setQuestionData({
        page: PAGE_CURRENT,
        size: PAGE_SIZE,
        data: [],
        total: 0,
      });
      return;
    }
    setLoading(true);
    const values = filterForm.getFieldsValue();
    if (Array.isArray(values.dateRange)) {
      values.dateRange = values.dateRange.map((k: any) => k.valueOf());
    }
    const res = await reqResourceQuestionPage({
      current: page,
      size,
      data: {
        courseId: ids.course.courseId,
        gradeId: ids.textbook.gradeId,
        chapterId: nodeInfo.chapterId,
        ...values,
      },
    });
    if (res.code === 200) {
      const { current, data, ...rest } = res.data;
      const parser = new DOMParser();
      const arr = data.map((item) => {
        const doc = parser.parseFromString(item.questionContent, "text/html");
        const sElement = doc.body.innerText.trimStart()[0];
        item.questionContentTemp = item.questionContent.replace(
          sElement,
          `${item.num}. ${sElement}`
        );
        return { ...item, show: false, selected: false };
      });
      setQuestionData({ ...rest, page: current as number, data: arr });
    } else {
      message.error(res.message);
    }
    setLoading(false);
  };

  const [filterForm] = Form.useForm();
  const editQuestionRef = useRef<EditQuestionRef>(null);

  const handleEditQuestion = async (values: EditQuestionReq) => {
    const res = await reqEditQuestion(values);
    if (res.code === 200) {
      message.success("编辑题目成功");
      editQuestionRef.current?.setShow(false);
      getQuestionPage(questionData.page, questionData.size);
    } else {
      message.error(res.message);
    }
  };
  const handleDelSchoolQuestion = async (id: string) => {
    const res = await reqDelQuestion({ schoolQuestionId: id });
    if (res.code === 200) {
      message.success("删除题目成功");
      getQuestionPage(questionData.page, questionData.size);
    } else {
      message.error(res.message);
    }
  };
  // 删除一些题目
  const handleDelSomeQuestion = async () => {
    Modal.confirm({
      title: "提示",
      content: "删除后无法恢复，是否确认删除？",
      onOk: async () => {
        const res = await reqDelQuestions(selecteds);
        if (res.code === 200) {
          message.success("删除题目成功");
          getQuestionPage(questionData.page, questionData.size);
        } else {
          message.error(res.message);
        }
      },
    });
  };

  // 录题
  const addQuestionRef = useRef<AddQuestionRef>(null);
  const saveQuestion = async (values: AddQuestionForm, answerList: any, callback: () => void) => {
    addQuestionRef.current?.setConfirmLoading(true);
    const { questions, answer, ...rest } = values;
    const params: AddQuestionReq = {
      courseId: ids.course.courseId,
      gradeId: ids.textbook.gradeId,
      chapterId: ids.node.chapterId,
      ...rest,
      origin: "4", // 手动录题
      sourceType: dicts.getLabel("question_type", values.baseType),
      answerList: answerList.map((item: any) => {
        if (Array.isArray(item)) {
          const list: string[] = [];
          item.forEach((k: any) => {
            k.active && list.push(k.answer);
          });
          return {
            answer: list.join(""),
            type: item[0].type,
          };
        } else {
          return {
            answer: item.answer,
            type: item.type,
          };
        }
      }),
    };
    const res = await reqSaveQuestion(params);
    if (res.code === 200) {
      message.success("录入题目成功");
      addQuestionRef.current?.setShow(false);
      callback();
      addQuestionRef.current?.form.resetFields();
      getQuestionPage(questionData.page, questionData.size);
    } else {
      message.error(res.message);
    }
    addQuestionRef.current?.setConfirmLoading(false);
  };

  const questionHeaderRef = useRef<QuestionSettingRef>(null);
  const importQuestionRef = useRef<ChildRef>(null);

  useEffect(() => {
    filterForm.resetFields();
    getQuestionPage();
  }, [nodeInfo?.nodeId]);
  return (
    <div className={styles.root}>
      <ComGradeTree countType="1" callPage={setNodeInfo} />
      <div className="question-list">
        <Form
          form={filterForm}
          layout="inline"
          className="category-container"
          initialValues={{
            dateRange: [],
          }}
          onValuesChange={() => {
            getQuestionPage();
          }}>
          <Form.Item name="baseType" label="题型">
            <Select
              allowClear
              options={dicts.getDict("question_type")}
              style={{ width: 100 }}
              placeholder="全部题型"></Select>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="添加时间"
            normalize={(val) => {
              if (val && val.length === 2) {
                const [start, end] = val;
                return [start.startOf("day"), end.startOf("day")];
              }
              return val;
            }}>
            <RangePicker presets={RANGE_PRESETS} />
          </Form.Item>
        </Form>

        <div className="middle">
          <Space>
            <Button
              onClick={() => {
                const flag = questionData.data.some((n: QuestionPageRes) => !n.selected);
                const cloneList = questionData.data.slice();
                cloneList.forEach((n: QuestionPageRes) => {
                  n.selected = flag;
                });
                setQuestionData({
                  ...questionData,
                  data: cloneList,
                });
              }}
              disabled={!questionData.data.length}
              className="button"
              type="primary"
              ghost>
              {!questionData.data.some((n: QuestionPageRes) => !n.selected) &&
              questionData.data.length
                ? "取消全选"
                : "全选"}
            </Button>
            <Button
              type="primary"
              danger
              disabled={!questionData.data.filter((k) => k.selected).length}
              onClick={() => {
                handleDelSomeQuestion();
              }}>
              批量删除
            </Button>
          </Space>
          <Space>
            <Button
              type="primary"
              onClick={() => {
                if (!nodeInfo?.nodeId) {
                  message.warning("请选择节点章节！");
                  return;
                }
                addQuestionRef.current?.setShow(true);
              }}>
              手动录题
            </Button>

            <Button
              type="primary"
              onClick={() => {
                importQuestionRef.current?.setShow(true);
              }}>
              一键导入题目
            </Button>
          </Space>
        </div>

        <List
          itemLayout="vertical"
          dataSource={questionData.data}
          loading={loading}
          split={false}
          className="resource-list-container"
          locale={{ emptyText: <ComEmpty description="暂无试题可用" /> }}
          pagination={{
            simple: true,
            showSizeChanger: false,
            hideOnSinglePage: !questionData.total,
            showTotal: () => {
              return (
                <span>
                  共 <b className="num">{questionData.total}</b> 道题目
                </span>
              );
            },
            itemRender: (_, type) => {
              if (type === "prev") {
                return <LeftCircleOutlined />;
              }
              if (type === "next") {
                return <RightCircleOutlined />;
              }
            },
            current: questionData.page,
            pageSize: questionData.size,
            total: questionData.total,
            onChange: (page, pageSize) => {
              getQuestionPage(page, pageSize);
            },
          }}
          renderItem={(item, index) => (
            <List.Item>
              <Card className="resource-card" hoverable>
                <QuestionSetting
                  ref={questionHeaderRef}
                  isEditable={true}
                  questionInfo={item}
                  refreshFn={() => getQuestionPage(questionData.page, questionData.size)}
                />
                <div
                  className="question-box"
                  onClick={() => {
                    const cloneQuestionData = questionData.data.slice();
                    cloneQuestionData[index].show = !item.show;
                    setQuestionData({
                      ...questionData,
                      data: cloneQuestionData,
                    });
                  }}>
                  <Checkbox
                    className="selected"
                    disabled={item.resourceEditable}
                    checked={item.selected}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => {
                      const cloneQuestionData = questionData.data.slice();
                      cloneQuestionData[index].selected = !item.selected;
                      setQuestionData({
                        ...questionData,
                        data: cloneQuestionData,
                      });
                    }}></Checkbox>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<div class='MathJyeTM'>${`<div>${item.questionContentTemp}</div>`}</div>`,
                    }}></div>
                </div>

                <div className="list-item-footer">
                  <div className="left">
                    <Space size={20} className="question-info">
                      <span className="detail">
                        题型：
                        <b>{dicts.getLabel("question_type", item.baseType)}</b>
                      </span>
                      <span className="detail test-paper">
                        更新时间：<b>{dayjs(item.updateTime).format("YYYY/MM/DD HH:mm")}</b>
                      </span>
                    </Space>
                  </div>
                  <div className="right">
                    <Button
                      type="link"
                      onClick={() => {
                        editQuestionRef.current?.setShow(true);
                        editQuestionRef.current?.questionForm.setFieldsValue({
                          id: item.id,
                          difficulty: item.hardType,
                          type: item.baseType,
                          answer: item.questionAnswer.map((k: any) => {
                            return {
                              type: k.type,
                              answer: k.answer,
                              options: generateLetter(item.choiceNumber, k.type),
                            };
                          }),

                          content: item.questionContent,
                          analysis: item.questionAnalysis,
                          num: item.choiceNumber || 1,
                        });
                      }}>
                      编辑
                    </Button>

                    <Popconfirm
                      title="删除题目"
                      description="确认删除该题目吗?"
                      onConfirm={() => handleDelSchoolQuestion(item.id)}
                      icon={<QuestionCircleTwoTone twoToneColor="#f00" />}>
                      <Button type="text" danger>
                        删除
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
                {item.show ? (
                  <div className="analytical-answer">
                    <div className="analytical">
                      <span className="mark">【答案】</span>
                      <div className="answer">
                        {item.answerList.map((k: any, ki: number) => {
                          return (
                            <div key={ki}>
                              {`(${ki + 1})`}
                              <b>
                                &nbsp;
                                {k.type === "pd" ? (k.answer === "A" ? "√" : "×") : k.answer}
                              </b>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="analytical">
                      <span className="mark">【解析】</span>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.questionAnalysis,
                        }}></div>
                    </div>
                  </div>
                ) : null}
              </Card>
            </List.Item>
          )}
        />
      </div>
      <AddQuestionDrawer ref={addQuestionRef} handleSubmit={saveQuestion} />
      <EditQuestion ref={editQuestionRef} handleSubmit={handleEditQuestion} />
      <ImportQuestion ref={importQuestionRef} callback={getQuestionPage} />
    </div>
  );
}
