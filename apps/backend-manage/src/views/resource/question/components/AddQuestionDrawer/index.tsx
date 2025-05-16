import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Drawer, Space, Button, Form, Row, Col, DrawerProps, Select, Input } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { ComTitle, ComEditor } from "@/components";
import { generateArray } from "@/utils/common";
import { useAppContext } from "@/context";
import { FormInstance } from "antd/lib";

const { TextArea } = Input;
const excludeList = ["sxz", "mxz", "pd"];

export interface AddQuestionForm {
  baseType: string;
  choiceNumber: number;
  questionContent: string;
  questionAnalysis?: string;
  questions: number;
  answer: string[];
}
interface AddQuestionChildProps {
  handleSubmit: (values: AddQuestionForm, answerList: any, callback: () => void) => void;
}
export interface AddQuestionRef extends ChildRef {
  form: FormInstance<AddQuestionForm>;
}
const AddQuestionDrawer = forwardRef<AddQuestionRef, DrawerProps & AddQuestionChildProps>(
  function Child(props, ref) {
    useImperativeHandle(
      ref,
      () => {
        return {
          setShow,
          setConfirmLoading,
          form,
        };
      },
      []
    );
    const { dicts } = useAppContext();
    const [show, setShow] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm<AddQuestionForm>();
    const typeValue = Form.useWatch("baseType", form);
    const num = Form.useWatch("choiceNumber", form);

    // flag true: 直接是答案，1，空字符串
    const newArr = (type: string, num: number) => {
      if (!num) {
        num = 4;
      }
      num = type === "pd" ? 2 : num;
      if (excludeList.includes(type) || type === "hh") {
        return Array.from(new Array(num), (k, i) => {
          return {
            answer: String.fromCharCode(65 + i),
            active: false,
            type: type === "hh" ? "sxz" : type,
          };
        });
      } else {
        return {
          answer: "",
          active: true,
          type,
        };
      }
    };

    const [answerList, setAnswerList] = useState<any>([]);
    const QuestionType = (type: string): React.ReactNode => {

      const Sxz = (item: any, index: number) => {
        return (
          <Button.Group>
            {item.map((v: any, vi: number) => (
              <Button
                key={vi}
                type={v.active ? "primary" : "default"}
                onClick={() => {
                  const arr = answerList.slice();
                  arr[index].forEach((n: { active: boolean }) => {
                    n.active = false;
                  });
                  arr[index][vi].active = !v.active;
                  setAnswerList(arr);
                }}>
                {v.answer}
              </Button>
            ))}
          </Button.Group>
        );
      };
      const Mxz = (item: any, index: number) => {
        return (
          <Button.Group>
            {item.map((v: any, vi: number) => (
              <Button
                key={vi}
                type={v.active ? "primary" : "default"}
                onClick={() => {
                  const arr = answerList.slice();
                  arr[index][vi].active = !v.active;
                  setAnswerList(arr);
                }}>
                {v.answer}
              </Button>
            ))}
          </Button.Group>
        );
      };
      const Pd = (item: any, index: number) => {
        return (
          <Button.Group>
            {item.map((v: any, vi: number) => (
              <Button
                key={vi}
                type={v.active ? "primary" : "default"}
                onClick={() => {
                  const arr = answerList.slice();
                  arr[index].forEach((k: { active: boolean }) => {
                    k.active = false;
                  });
                  arr[index][vi].active = !v.active;
                  setAnswerList(arr);
                }}>
                {v.answer === "A" ? "√" : "×"}
              </Button>
            ))}
          </Button.Group>
        );
      };
      const Hh = (item: any, index: number) => {
        const type = item.type || item[0].type;
        let Question: React.ReactNode;
        switch (type) {
          case "sxz":
            Question = Sxz(item, index);
            break;
          case "mxz":
            Question = Mxz(item, index);
            break;
          case "pd":
            Question = Pd(item, index);
            break;
          case "hh":
            Question = Hh(item, index);
            break;
          default:
            Question = Other(item, index);
            break;
        }

        return (
          <div>
            <Select
              value={type}
              options={dicts.getDict("question_type").slice(0, -1)}
              style={{ width: "200px" }}
              onChange={(value) => {
                const cloneArr = answerList.slice();
                cloneArr[index] = newArr(value, 4);
                setAnswerList(cloneArr);
              }}></Select>
            {Question}
          </div>
        );
      };
      const Other = (item: any, index: number) => {
        return (
          <TextArea
            key={index}
            value={item.answer}
            style={{ width: "100%" }}
            rows={3}
            maxLength={1000}
            placeholder="请输入答案"
            onChange={(e) => {
              const arr = answerList.slice();
              arr[index].answer = e.target.value;
              setAnswerList(arr);
            }}
          />
        );
      };
      return (
        <Space direction="vertical" style={{ width: excludeList.includes(type) ? "" : "100%" }}>
          {answerList.map((item: any, index: number) => {
            let Question: React.ReactNode;
            switch (type) {
              case "sxz":
                Question = Sxz(item, index);
                break;
              case "mxz":
                Question = Mxz(item, index);
                break;

              case "pd":
                Question = Pd(item, index);
                break;
              case "hh":
                Question = Hh(item, index);
                break;
              default:
                Question = Other(item, index);
                break;
            }
            return (
              <Space key={index} size={3}>
                <span>{index + 1 + "、"}</span>
                {Question}
              </Space>
            );
          })}
          <Space>
            <Button
              type="dashed"
              size="middle"
              disabled={answerList.length > 19}
              onClick={() => {
                const arr = answerList.slice();
                const list = newArr(typeValue, num);
                arr.push(list);
                form.setFieldValue("questions", arr.length);
                setAnswerList(arr);
              }}
              icon={<PlusOutlined />}>
              添加小题
            </Button>

            <Button
              type="dashed"
              size="middle"
              disabled={answerList.length < 2}
              onClick={() => {
                const arr = answerList.slice();
                arr.pop();
                form.setFieldValue("questions", arr.length);
                setAnswerList(arr);
              }}
              icon={<MinusOutlined />}>
              删除小题
            </Button>
          </Space>
        </Space>
      );
    };

    useEffect(() => {
      const arr = newArr("sxz", 4);
      setAnswerList([arr]);
    }, []);

    return (
      <Drawer
        {...props}
        open={show}
        title="题目录入"
        placement="right"
        width={800}
        extra={
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                const arr = newArr("sxz", 4);
                setAnswerList([arr]);
              }}>
              重置
            </Button>
            <Button
              type="primary"
              loading={confirmLoading}
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {

                    props.handleSubmit(values, answerList, () => {
                      const arr = newArr("sxz", 4);
                      setAnswerList([arr]);
                    });
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }}>
              录入
            </Button>
          </Space>
        }
        onClose={() => {
          setShow(false);
        }}>
        <Form
          form={form}
          size="middle"
          initialValues={{
            baseType: "sxz",
            choiceNumber: 4,
            questions: 1,
          }}>
          <ComTitle title="试题设置" />
          <Row>
            <Col span={12}>
              <Form.Item label="题目类型" name="baseType" required>
                <Select
                  style={{ width: 200 }}
                  options={dicts.getDict("question_type")}
                  onChange={(value) => {
                    const arr = newArr(value, 4);
                    setAnswerList([arr]);
                    const pdNum = value === "pd" ? 2 : 4;
                    const num = excludeList.includes(value) || value === "hh" ? pdNum : 1;
                    form.setFieldsValue({
                      questions: 1,
                      choiceNumber: num,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="小题数量" name="questions" required>
                <Select
                  options={generateArray(1, 20)}
                  style={{ width: 200 }}
                  onSelect={(value) => {
                    const sum = value - answerList.length;
                    if (sum === 0) {
                      return;
                    }
                    if (sum > 0) {
                      const cloneArr = answerList.slice();
                      for (let i = 0; i < sum; i++) {
                        const list = newArr(typeValue, num);
                        cloneArr.push(list);
                      }
                      setAnswerList(cloneArr);
                    }
                    if (sum < 0) {
                      const cloneArr = answerList.slice(0, value);
                      setAnswerList(cloneArr);
                    }
                  }}></Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="选项数量" name="choiceNumber" required>
                <Select
                  style={{ width: 200 }}
                  disabled={typeValue !== "mxz" && typeValue !== "sxz" && typeValue !== "hh"}
                  options={generateArray(2, 7)}
                  onSelect={(value) => {
                    const arr = answerList.slice();
                    for (let i = 0; i < arr.length; i++) {
                      arr[i] = newArr(typeValue, value);
                    }
                    setAnswerList(arr);
                  }}></Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="答案"
            name="answer"
            rules={[
              {
                required: true,
                validator() {
                  if (typeValue === "sxz" || typeValue === "mxz" || typeValue === "pd") {
                    const list = [];
                    for (let i = 0; i < answerList.length; i++) {
                      list.push(answerList[i].some((k: { active: boolean }) => k.active));
                    }
                    const isSuccess = list.every((k) => k);
                    if (isSuccess) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject("请选择一项正确答案！");
                    }
                  } else if (typeValue === "hh") {
                    return Promise.resolve();
                  } else {
                    const isSuccess = answerList.some((k: { answer: string }) => k.answer);
                    if (isSuccess) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject("请输入正确答案！");
                    }
                  }
                },
              },
            ]}>
            <div>{QuestionType(typeValue)}</div>
          </Form.Item>

          <ComTitle title="题目内容" />
          <Form.Item name="questionContent" rules={[{ required: true, message: "请输入题目内容" }]}>
            <ComEditor />
          </Form.Item>
          <ComTitle title="题目解析" />
          <Form.Item name="questionAnalysis">
            <ComEditor />
          </Form.Item>
        </Form>
      </Drawer>
    );
  }
);

export default AddQuestionDrawer;
