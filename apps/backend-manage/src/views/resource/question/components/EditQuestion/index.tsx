import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Drawer,
  Form,
  Button,
  Select,
  Input,
  Radio,
  DrawerProps,
  FormInstance,
  Space,
  Row,
  Col,
} from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { generateArray, generateLetter } from "@/utils/common";
import ComEditor from "@/components/ComEditor";
import { useAppContext } from "@/context";
import styles from "./index.module.scss";

const { TextArea } = Input;

export interface EditQuestionRef extends ChildRef {
  questionForm: FormInstance;
}
interface PriceInputProps {
  value?: string;
  onChange?: (value: string) => void;
}
const excludeList = ["sxz", "mxz", "pd"];
const generateNumOptions = generateArray();
const EditQuestion = forwardRef<EditQuestionRef, DrawerProps & ChildProps>(function Child(
  props,
  ref
) {
  useImperativeHandle(
    ref,
    () => {
      return {
        setShow,
        setConfirmLoading,
        questionForm,
      };
    },
    []
  );
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [questionForm] = Form.useForm();

  const { dicts } = useAppContext();
  const questionType = Form.useWatch("type", questionForm);
  const questionNum = Form.useWatch("num", questionForm);
  const QuestionType = (index: number): React.ReactNode => {
    const answerList = questionForm.getFieldValue("answer");
    const info = answerList[index];
    const Sxz = () => {
      return (
        <Radio.Group buttonStyle="solid" defaultValue={info.answer}>
          {info.options.map((v: string, vi: number) => {
            return (
              <Radio.Button value={v} key={vi}>
                {v}
              </Radio.Button>
            );
          })}
        </Radio.Group>
      );
    };
    const Mxz = () => {
      const PriceInput = ({ value = "", onChange }: PriceInputProps) => {
        value = info.answer;
        return (
          <Button.Group>
            {info.options.map((v: string, vi: number) => {
              return (
                <Button
                  key={vi}
                  type={value.includes(v) ? "primary" : "default"}
                  onClick={() => {
                    if (value.includes(v)) {
                      v = value.replaceAll(v, "");
                    } else {
                      v += value;
                      v = v.split("").sort().join("");
                    }
                    answerList[index].answer = v;
                    questionForm.setFieldValue("answer", answerList);
                    // onChange?.(v);
                  }}>
                  {v}
                </Button>
              );
            })}
          </Button.Group>
        );
      };
      return <PriceInput />;
    };
    const Pd = () => {
      return (
        <Radio.Group buttonStyle="solid" defaultValue={info.answer}>
          {info.options.map((v: string, vi: number) => {
            return (
              <Radio.Button value={v} key={vi}>
                {v === "A" ? "√" : "×"}
              </Radio.Button>
            );
          })}
        </Radio.Group>
      );
    };
    const Hh = () => {
      let Question: React.ReactNode;
      switch (info.type) {
        case "sxz":
          Question = (
            <Radio.Group
              buttonStyle="solid"
              value={info.answer}
              onChange={({ target: { value } }) => {
                answerList[index].answer = value;
                questionForm.setFieldValue("answer", answerList);
              }}>
              {info.options.map((v: string, vi: number) => {
                return (
                  <Radio.Button value={v} key={vi}>
                    {v}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          );
          break;
        case "mxz":
          Question = (
            <Button.Group>
              {info.options.map((v: string, vi: number) => {
                return (
                  <Button
                    key={vi}
                    value={info.answer}
                    type={info.answer.includes(v) ? "primary" : "default"}
                    onClick={(e: any) => {
                      const value = e.currentTarget.value;
                      if (value.includes(v)) {
                        v = value.replaceAll(v, "");
                      } else {
                        v += value;
                        v = v.split("").sort().join("");
                      }
                      answerList[index].answer = v;
                      questionForm.setFieldValue("answer", answerList);
                    }}>
                    {v}
                  </Button>
                );
              })}
            </Button.Group>
          );
          break;
        case "pd":
          Question = (
            <Radio.Group
              buttonStyle="solid"
              onChange={({ target: { value } }) => {
                answerList[index].answer = value;
                questionForm.setFieldValue("answer", answerList);
              }}>
              {info.options.map((v: string, vi: number) => {
                return (
                  <Radio.Button value={v} key={vi}>
                    {v === "A" ? "√" : "×"}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          );
          break;
        default:
          Question = (
            <TextArea
              defaultValue={answerList[index].answer}
              placeholder="请输入答案"
              rows={3}
              maxLength={1000}
              onChange={({ target: { value } }) => {
                answerList[index].answer = value;
                questionForm.setFieldValue("answer", answerList);
              }}
            />
          );
          break;
      }

      return (
        <div>
          <Select
            value={info.type}
            options={dicts.getDict("question_type").slice(0, -1)}
            style={{ width: "200px" }}
            onChange={(value) => {
              answerList[index].type = value;
              answerList[index].answer = "A";
              answerList[index].options = generateLetter(4, value);
              questionForm.setFieldValue("answer", answerList);
            }}></Select>
          {Question}
        </div>
      );
    };

    const Other = () => {
      return (
        <TextArea
          placeholder="请输入答案"
          defaultValue={info.answer}
          rows={3}
          maxLength={1000}
          onChange={({ target: { value } }) => {
            answerList[index].answer = value;
            questionForm.setFieldValue("answer", answerList);
          }}
        />
      );
    };

    let Question: React.ReactNode;
    switch (questionType) {
      case "sxz":
        Question = Sxz();
        break;
      case "mxz":
        Question = Mxz();
        break;
      case "pd":
        Question = Pd();
        break;
      case "hh":
        Question = Hh();
        break;
      default:
        Question = Other();
        break;
    }
    return (
      <div className="answer-wrapper">
        <span className="num">{index + 1 + "、"}</span>
        {Question}
      </div>
    );
  };

  return (
    <Drawer
      {...props}
      width={800}
      open={show}
      title="编辑题目"
      className={styles["edit-question"]}
      destroyOnClose
      onClose={() => {
        // questionForm.resetFields();
        setShow(false);
      }}
      extra={
        <Space>
          <Button
            type="default"
            onClick={() => {
              // questionForm.resetFields();
              setShow(false);
            }}>
            取消
          </Button>

          <Button
            type="primary"
            loading={confirmLoading}
            onClick={() => {
              questionForm
                .validateFields()
                .then((values) => {
                  const obj = {
                    id: values.id,
                    baseType: values.type,
                    hardType: values.difficulty,
                    questionAnalysis: values.analysis,
                    questionContent: values.content,
                    questionAnswer: values.answer.map((k: any) => {
                      return {
                        answer: k.answer,
                        type: k.type,
                      };
                    }),
                    answerNumber: values.answer.length,
                    choiceNumber: values.num || 2,
                  };

                  props.handleSubmit(obj);
                })
                .catch((err) => {
                  console.error(err);
                });
            }}>
            保存
          </Button>
        </Space>
      }>
      <Form
        form={questionForm}
        autoComplete="off"
        initialValues={{
          id: "",
          difficulty: "1",
          type: "sxz",
          answer: [{}],
          content: "",
          analysis: "",
          num: 4,
        }}>
        <Form.Item noStyle hidden name="id">
          <div></div>
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item
              label="题目类型"
              name="type"
              rules={[{ required: true, message: "题目类型不能为空" }]}>
              <Select
                style={{ width: 200 }}
                options={dicts.getDict("question_type")}
                onChange={(value) => {
                  const answerList = questionForm.getFieldValue("answer");
                  const pdNum = value === "pd" ? 2 : 4;
                  const num = excludeList.includes(value) || value === "hh" ? pdNum : 1;
                  answerList.forEach((v: any) => {
                    v.answer = "A";
                    v.options = generateLetter(num, value);
                  });
                  questionForm.setFieldsValue({
                    answer: answerList,
                    num,
                  });
                }}
              />
            </Form.Item>
            {/* <Form.Item
              label="题目难度"
              name="difficulty"
              rules={[{ required: true, message: "题目难度不能为空" }]}
            >
              <Select
                style={{ width: 200 }}
                options={dicts.getDict("question_hard")}
              />
            </Form.Item> */}
          </Col>
          <Col span={12}>
            <Form.Item
              label="选项数量"
              name="num"
              rules={[{ required: true, message: "题目选项不能为空" }]}>
              <Select
                style={{ width: 200 }}
                options={generateNumOptions}
                disabled={questionType !== "sxz" && questionType !== "mxz" && questionType !== "hh"}
                onChange={(val) => {
                  const answerList = questionForm.getFieldValue("answer");
                  answerList.forEach((v: any) => {
                    v.answer = "A";
                    v.options = generateLetter(val, questionType);
                  });
                  questionForm.setFieldValue("answer", answerList);
                }}></Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.List name="answer">
          {(fidlds, { add, remove }) => (
            <>
              {(fidlds || [])?.map(({ key, name }) => {
                return (
                  <Form.Item
                    name={[name, "answer"]}
                    label="题目答案"
                    key={key}
                    rules={[{ required: true, message: "答案不能为空" }]}
                    className={key ? "general" : ""}>
                    {QuestionType(name)}
                  </Form.Item>
                );
              })}
              <Form.Item>
                <Space>
                  <Button
                    type="dashed"
                    disabled={fidlds.length > 19}
                    onClick={() => {
                      add({
                        answer: "",
                        options: generateLetter(questionNum, questionType),
                        type: questionType === "hh" ? "sxz" : questionType,
                      });
                    }}
                    icon={<PlusOutlined />}>
                    添加小题
                  </Button>
                  <Button
                    type="dashed"
                    icon={<MinusOutlined />}
                    disabled={fidlds[fidlds.length - 1].name === 0}
                    onClick={() => {
                      const lastIndex = fidlds[fidlds.length - 1].name;
                      remove(lastIndex);
                    }}>
                    删除小题
                  </Button>
                </Space>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item
          label="题目内容"
          name="content"
          rules={[{ required: true, message: "题目内容不能为空" }]}
          className="content">
          <ComEditor />
        </Form.Item>
        <Form.Item label="题目解析" name="analysis" className="analysis">
          <ComEditor />
        </Form.Item>
      </Form>
    </Drawer>
  );
});
export default EditQuestion;
