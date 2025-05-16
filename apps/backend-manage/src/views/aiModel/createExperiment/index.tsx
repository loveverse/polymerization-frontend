import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import {
  Button,
  Form,
  Input,
  Space,
  Steps,
  StepsProps,
  Table,
  TableColumnsType,
  Tag,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddStepModal, { AddStepModalRef } from "./AddStepModal";
import { useLocation, useNavigate } from "react-router-dom";
import ComEditor from "@/components/ComEditor";
import QuestionModal, { QuestionModalRef } from "./QuestionModal";
import {
  reqAddExperimentContent,
  reqAddExperimentReport,
  reqAddExperimentStep,
  reqViewExperiment,
} from "@/api/aiModel";
import {
  AddExperimentContentReq,
  AddExperimentReportReq,
  AddExperimentStepReq,
} from "@/api/aiModel/types";
import { useAppContext } from "@/context";

const CreateExperiment = () => {
  const { state = {} } = useLocation();
  const { dicts } = useAppContext();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const steps: StepsProps["items"] = [
    {
      title: "实验内容",
      subTitle: "考题基本信息",
    },
    {
      title: "实验步骤",
      subTitle: "评分步骤与要求",
    },
    {
      title: "实验报告",
      subTitle: "考题内容与评分",
    },
  ];

  // 实验内容
  const [contentForm] = Form.useForm<AddExperimentContentReq>();
  const addExperimentContent = async (values: AddExperimentContentReq) => {
    const res = await reqAddExperimentContent({
      ...values,
      aiId: state.aiId,
      subjectId: state.courseId,
    });
    if (res.code === 200) {
      message.success(values.id ? "编辑实验内容成功！" : "创建实验内容成功！");
      sessionStorage.setItem("contentId", res.data);
      contentForm.setFieldValue("id", res.data);
      setStepIndex(stepIndex + 1);
    } else {
      message.error(res.message);
    }
  };

  // 实验步骤
  const [stepList, setStepList] = useState<AddExperimentStepReq["list"]>([]);
  const stepColumns: TableColumnsType<AddExperimentStepReq["list"][0]> = [
    { title: "步骤", dataIndex: "sn", render: (value) => value + 1 },
    {
      title: "操作要求",
      dataIndex: "requirements",
    },
    {
      title: "评分标准",
      dataIndex: "evaluates",
      render(value, record) {
        return (
          <Space direction="vertical">{record.evaluates.map((item) => item.evaluateContent)}</Space>
        );
      },
    },
    {
      title: "模型标签",
      dataIndex: "evaluates",
      render(value, record) {
        return (
          <Space direction="vertical">
            {record.evaluates.map((item) => {
              const tagNames: string[] = [];
              state?.modelTags.forEach((k: any) => {
                if (item.tags.includes(k.id)) {
                  tagNames.push(k.name);
                }
              });
              return (
                <Space key={item.sn}>
                  {tagNames.map((n) => {
                    return (
                      <Tag key={n} color="processing">
                        {n}
                      </Tag>
                    );
                  })}
                </Space>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: "操作",
      render(value, record, index) {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => {
                editStepRef.current?.stepForm.setFieldsValue(record);
                editStepRef.current?.setShow(true);
              }}>
              编辑
            </Button>
            <Button
              type="link"
              danger
              onClick={() => {
                const cloneData = stepList.slice();
                cloneData.splice(record.sn, 1);
                cloneData.forEach((item, index) => {
                  item.sn = index;
                });
                setStepList(cloneData);
              }}>
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
  const addStepRef = useRef<AddStepModalRef>(null);
  const addStep = (values: AddExperimentStepReq["list"][0]) => {
    const cloneData = stepList.slice();
    cloneData.push({ ...values, sn: cloneData.length });
    setStepList(cloneData);
    addStepRef.current?.stepForm.resetFields();
    addStepRef.current?.setShow(false);
  };
  const editStepRef = useRef<AddStepModalRef>(null);
  const editStep = (values: AddExperimentStepReq["list"][0]) => {
    const cloneData = stepList.slice();
    cloneData.splice(values.sn, 1, values);
    setStepList(cloneData);
    editStepRef.current?.setShow(false);
  };
  const addExperimentStep = async () => {
    const contentId = contentForm.getFieldValue("id");
    const res = await reqAddExperimentStep({
      contentId: contentId,
      list: stepList,
    });
    if (res.code === 200) {
      message.success(state.id ? "编辑实验步骤成功！" : "创建实验步骤成功！");
      setStepIndex(stepIndex + 1);
    } else {
      message.error(res.message);
    }
  };

  // 实验报告
  const handleQuestion = (value: string) => {
    addQuestionRef.current?.questionForm.setFieldValue("questionType", value);
    addQuestionRef.current?.setShow(true);
  };
  const [questionList, setQuestionList] = useState<AddExperimentReportReq["list"]>([]);
  const questionColumns: TableColumnsType<AddExperimentReportReq["list"][0]> = [
    {
      title: "题号",
      render: (value, record, index) => index + 1,
      align: "center",
      width: 120,
    },
    {
      title: "题目",
      dataIndex: "question",
      render(value) {
        return <div dangerouslySetInnerHTML={{ __html: value }}></div>;
      },
    },
    {
      title: "题型",
      dataIndex: "questionType",
      align: "center",
      render(value) {
        return dicts.getLabel("experiment_question_type", value);
      },
    },
    {
      title: "操作",
      width: 200,
      align: "center",
      render(value, record: any) {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => {
                if (record.questionType === "microscope") {
                  const cloneData = record.expandsJson.slice();
                  if (cloneData[0].photo) {
                    cloneData[0].photo = [{ url: cloneData[0].photo }];
                  } else {
                    cloneData[0].photo = [];
                  }
                  editQuestionRef.current?.questionForm.setFieldsValue({
                    ...record,
                    expandsJson: cloneData,
                  });
                } else {
                  editQuestionRef.current?.questionForm.setFieldsValue(record);
                }
                editQuestionRef.current?.setShow(true);
              }}>
              编辑
            </Button>
            <Button
              type="link"
              danger
              onClick={() => {
                const cloneData = questionList.slice();
                cloneData.splice(record.sn, 1);
                cloneData.forEach((item, index) => {
                  item.sn = index;
                });
                setQuestionList(cloneData);
              }}>
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
  const addQuestionRef = useRef<QuestionModalRef>(null);
  const addQuestion = (values: AddExperimentReportReq["list"][0]) => {
    const cloneData = questionList.slice();
    cloneData.push({ ...values, sn: cloneData.length });
    setQuestionList(cloneData);
    addQuestionRef.current?.setShow(false);
  };
  const editQuestionRef = useRef<QuestionModalRef>(null);
  const editQuestion = (values: AddExperimentReportReq["list"][0]) => {
    const cloneData = questionList.slice();
    cloneData.splice(values.sn, 1, values);
    setQuestionList(cloneData);
    editQuestionRef.current?.setShow(false);
  };
  const createExperiment = async () => {
    if (!questionList.length) {
      message.warning("请添加题目！");
      return;
    }
    const contentId = contentForm.getFieldValue("id");
    const questions = questionList.map((k) => {
      return { ...k, expandsJson: JSON.stringify(k.expandsJson) };
    });
    const res = await reqAddExperimentReport({
      contentId: contentId,
      list: questions,
    });

    if (res.code === 200) {
      navigate("/aiModel/default");
      sessionStorage.removeItem("contentId");
      message.success(state.id ? "编辑实验成功！" : "创建实验成功！");
    } else {
      message.error(res.message);
    }
  };
  const togglePrev = () => {
    setStepIndex(stepIndex - 1);
  };
  const toggleNext = () => {
    if (stepIndex === 0) {
      contentForm
        .validateFields()
        .then((values) => {
          if (!values || values.equipments === "<p><br></p>") {
            message.warning("请输入实验器材！");
            return;
          }
          addExperimentContent(values);
        })
        .catch((err) => console.error(err));
    } else if (stepIndex === 1) {
      addExperimentStep();
    }
  };

  const fetchExperimentContent = async (contentId: string) => {
    const res = await reqViewExperiment({
      aiContentId: contentId,
    });
    if (res.code === 200) {
      if (res.data.contentId) {
        contentForm.setFieldsValue({
          id: res.data.contentId,
          name: res.data.name,
          requirements: res.data.requirements,
          equipments: res.data.equipments,
        });
      }
      if (res.data.steps && res.data.steps.length) {
        res.data.steps.forEach((item) => {
          item.evaluates.forEach((n) => {
            n.tags = n.tags.map((k) => (typeof k === "string" ? k : k.key));
          });
        });
        setStepList(res.data.steps);
      }
      if (res.data.questions && res.data.questions.length) {
        res.data.questions.forEach((item) => {
          item.expandsJson = item.expands;
        });
        setQuestionList(res.data.questions);
      }
    } else {
      message.error(res.message);
    }
  };
  useEffect(() => {
    const contentId = state.id || sessionStorage.getItem("contentId");
    if (contentId) {
      fetchExperimentContent(contentId);
    }
    return () => {
      sessionStorage.removeItem("contentId");
    };
  }, []);

  return (
    <div className={styles["root"]}>
      <Steps items={steps} className="steps-header" labelPlacement="vertical" current={stepIndex} />
      <div className="step-content">
        {stepIndex === 0 && (
          <Form form={contentForm} autoComplete="off">
            <Form.Item name="id" hidden>
              <div></div>
            </Form.Item>
            <Form.Item label="考题名称" name="name" rules={[{ required: true }]}>
              <Input placeholder="请输入考题名称" />
            </Form.Item>
            <Form.Item label="实验要求" name="requirements" rules={[{ required: true }]}>
              <Input.TextArea rows={4} placeholder="请输入实验要求" />
            </Form.Item>
            <Form.Item label="实验器材" name="equipments" rules={[{ required: true }]}>
              <ComEditor />
            </Form.Item>
          </Form>
        )}
        {stepIndex === 1 && (
          <div>
            <Table
              columns={stepColumns}
              dataSource={stepList}
              pagination={false}
              rowKey={(record) => record.sn}
            />
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              block
              style={{ margin: "20px 0" }}
              onClick={() => {
                addStepRef.current?.setShow(true);
              }}>
              新建步骤
            </Button>
          </div>
        )}
        {stepIndex === 2 && (
          <div className="">
            <Table
              columns={questionColumns}
              dataSource={questionList}
              rowKey={(record) => record.sn}
              pagination={false}
            />
            <Space style={{ margin: "20px 0" }}>
              {dicts.getDict("experiment_question_type").map((item, index) => {
                return (
                  <Button
                    type="primary"
                    key={index}
                    ghost={index < 4}
                    onClick={() => handleQuestion(item.value as string)}>
                    {item.label}
                  </Button>
                );
              })}
            </Space>
          </div>
        )}
      </div>
      <Space size={15}>
        {stepIndex !== 0 && (
          <Button type="primary" ghost onClick={() => togglePrev()}>
            上一步
          </Button>
        )}
        <Button type="primary" ghost>
          暂存
        </Button>
        {stepIndex === 2 ? (
          <Button type="primary" onClick={createExperiment}>
            提交
          </Button>
        ) : (
          <Button type="primary" onClick={() => toggleNext()}>
            下一步
          </Button>
        )}
      </Space>
      <AddStepModal
        ref={addStepRef}
        title="新建步骤"
        modelTags={state?.modelTags}
        handleSubmit={addStep}
      />
      <AddStepModal
        ref={editStepRef}
        title="编辑步骤"
        modelTags={state?.modelTags}
        handleSubmit={editStep}
      />

      <QuestionModal ref={addQuestionRef} handleSubmit={addQuestion} />
      <QuestionModal ref={editQuestionRef} handleSubmit={editQuestion} />
    </div>
  );
};

export default CreateExperiment;
