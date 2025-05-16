import {
  Button,
  Checkbox,
  Col,
  Form,
  FormInstance,
  Input,
  InputRef,
  Modal,
  ModalProps,
  Row,
  Select,
  Space,
  Tag,
  Upload,
  UploadProps,
  message,
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ComEditor } from "@/components";
import styles from "./index.module.scss";
import { PlusOutlined } from "@ant-design/icons";
import { reqUploadFile } from "@/api/base";
import { useAppContext } from "@/context";
import { AddExperimentReportReq } from "@/api/aiModel/types";

interface QuestionModalProps extends ChildProps, ModalProps {}
export interface QuestionModalRef extends ChildRef {
  questionForm: FormInstance<AddExperimentReportReq["list"][0]>;
}
const QuestionModal = forwardRef<QuestionModalRef, QuestionModalProps>(function Child(props, ref) {
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
  const { handleSubmit, ...modalProps } = props;
  const { dicts } = useAppContext();
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [questionForm] = Form.useForm<AddExperimentReportReq["list"][0]>();
  const questionType = Form.useWatch("questionType", questionForm);
  // 问答题
  const expandsJson: any = Form.useWatch("expandsJson", questionForm);

  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const handleClose = (removedTag: string) => {
    const keywords = expandsJson[0].keyword;
    const newTags = keywords.filter((tag: string) => tag !== removedTag);
    questionForm.setFieldValue("expandsJson", [...expandsJson[0], { keyword: newTags }]);
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(value);
  };
  const handleInputConfirm = () => {
    const keywords = expandsJson[0].keyword;
    if (inputValue && !keywords.includes(inputValue)) {
      questionForm.setFieldValue("expandsJson", [
        { ...expandsJson[0], keyword: [...keywords, inputValue] },
      ]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  // 显微镜题
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const uploadProps: UploadProps = {
    maxCount: 1,
    listType: "picture-card",
    fileList: [],
    beforeUpload: (file) => {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 30) {
        message.warning("上传的文件大于30M，请重新上传！");
        return false;
      }
      return true;
    },
    customRequest(options) {
      const formData = new FormData();
      formData.append("file", options.file);
      reqUploadFile(formData)
        .then((res) => {
          if (res.code === 200) {
            // 自动 绑定到fileList中的response中
            options.onSuccess?.(res.data.url);
            message.success("上传文件成功");
          } else {
            options.onError?.(new Error());
            message.error("上传文件失败");
          }
        })
        .catch((error) => {
          console.error(error);
          message.error("上传文件失败");
        });
    },
    onChange(info) {},
  };

  const sortQuestionOptionSn = () => {
    const questions = questionForm.getFieldValue("expandsJson");
    questions.forEach((item: any, index: number) => {
      item.sn = index;
    });
    questionForm.setFieldValue("expandsJson", questions);
  };
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  return (
    <Modal
      {...modalProps}
      open={show}
      width={900}
      title={dicts.getLabel("experiment_question_type", questionType)}
      confirmLoading={confirmLoading}
      rootClassName={styles["root"]}
      onCancel={() => setShow(false)}
      onOk={() => {
        questionForm
          .validateFields()
          .then((values: any) => {
            if (questionType === "MICROSCOPE") {
              if (values.expandsJson[0].photo[0]) {
                values.expandsJson[0].photo = values.expandsJson[0].photo[0].response;
              } else {
                values.expandsJson[0].photo = "";
              }
            }
            questionForm.resetFields();
            handleSubmit(values);
          })
          .catch((err) => console.error(err));
      }}>
      <Form form={questionForm} autoComplete="off" className="step-form" layout="vertical">
        <Form.Item name="question" label="题目内容" rules={[{ required: true }]}>
          <ComEditor height={150} />
        </Form.Item>
        <Form.Item name="questionType" hidden>
          <div></div>
        </Form.Item>
        <Form.Item name="sn" hidden>
          <div></div>
        </Form.Item>
        {/* 选择题 */}
        {questionType === "CHOICE" && (
          <Form.List
            name="expandsJson"
            initialValue={[
              { sn: 0, answer: "" },
              { sn: 1, answer: "" },
            ]}
            rules={[
              {
                validator(rule, value, callback) {
                  // 至少设置一个正确答案
                  const isCorrect = value.some((item: any) => item.answer);
                  // 选项内容
                  const isContent = value.every((item: any) => item.content);
                  if (!isCorrect || !isContent) {
                    return Promise.reject(new Error("请输入选项并设置正确答案"));
                  }
                  return Promise.resolve();
                },
              },
            ]}>
            {(fields, { add, remove }, { errors }) => (
              <div className="question-list">
                <Button
                  type="primary"
                  className="create-question-btn"
                  onClick={() => add({ sn: fields.length, answer: "" })}>
                  新建选项
                </Button>
                <div className="question-list-header">
                  <Row gutter={40}>
                    <Col span={3}>序号</Col>
                    <Col span={14}>选项内容</Col>
                    <Col span={3}>正确选项</Col>
                    <Col span={4}></Col>
                  </Row>
                </div>
                {fields.map((field, index) => (
                  <div key={field.key} className="question-item">
                    <Row gutter={40}>
                      <Col span={3} className="num">
                        <Form.Item name={[field.name, "sn"]} noStyle>
                          {index + 1}
                        </Form.Item>
                      </Col>
                      <Col span={14}>
                        <Form.Item
                          name={[field.name, "content"]}
                          rules={[{ required: true }]}
                          noStyle>
                          <Input placeholder="请输入选项内容" />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item
                          name={[field.name, "answer"]}
                          validateTrigger={["onBlur", "onChange"]}
                          valuePropName="checked"
                          noStyle>
                          <Checkbox />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        {index > 1 ? (
                          <Button
                            type="link"
                            danger
                            onClick={() => {
                              remove(field.name);
                              sortQuestionOptionSn();
                            }}>
                            删除
                          </Button>
                        ) : null}
                      </Col>
                    </Row>
                  </div>
                ))}
                <Form.ErrorList errors={errors} className="error-color" />
              </div>
            )}
          </Form.List>
        )}

        {/* 填空题 */}
        {questionType === "FILL_BLANK" && (
          <Form.List
            name="expandsJson"
            initialValue={[{ sn: 0, answer: "" }]}
            rules={[
              {
                validator(rule, value, callback) {
                  // 全部设置正确答案
                  const isCorrect = value.every((item: any) => item.answer);
                  if (!isCorrect) {
                    return Promise.reject(new Error("请设置正确答案"));
                  }
                  return Promise.resolve();
                },
              },
            ]}>
            {(fields, { add, remove }, { errors }) => (
              <div className="question-list">
                <Button
                  type="primary"
                  className="create-question-btn"
                  onClick={() => add({ sn: fields.length, answer: "" })}>
                  新建选项
                </Button>
                <div className="question-list-header">
                  <Row gutter={40}>
                    <Col span={3}>序号</Col>
                    <Col span={9}>答案</Col>
                    <Col span={8}>误差范围(±)</Col>
                    <Col span={4}></Col>
                  </Row>
                </div>
                {fields.map((field, index) => (
                  <div key={field.key} className="question-item">
                    <Row gutter={40}>
                      <Col span={3} className="num">
                        <Form.Item name={[field.name, "sn"]} noStyle>
                          {index + 1}
                        </Form.Item>
                      </Col>
                      <Col span={9}>
                        <Form.Item
                          name={[field.name, "answer"]}
                          rules={[{ required: true }]}
                          noStyle>
                          <Input placeholder="请输入答案" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name={[field.name, "errorMargin"]} noStyle>
                          <Input placeholder="请输入误差范围" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        {index > 0 ? (
                          <Button
                            type="link"
                            danger
                            onClick={() => {
                              remove(field.name);
                              sortQuestionOptionSn();
                            }}>
                            删除
                          </Button>
                        ) : null}
                      </Col>
                    </Row>
                  </div>
                ))}
                <Form.ErrorList errors={errors} className="error-color" />
              </div>
            )}
          </Form.List>
        )}

        {/* 问答题 */}
        {questionType === "QA" && (
          <Form.List name="expandsJson" initialValue={[{ keyword: [], sn: 0, answer: "" }]}>
            {(fields, { add, remove }) => (
              <div className="question-list">
                {fields.map((field, index) => (
                  <div key={index}>
                    <Form.Item
                      label="答案"
                      name={[field.name, "answer"]}
                      rules={[{ required: true }]}>
                      <Input.TextArea rows={4} placeholder="请输入答案" />
                    </Form.Item>
                    <Form.Item name={[field.name, "keyword"]} hidden initialValue={[]}>
                      <div></div>
                    </Form.Item>
                    <Form.Item label="关键词" layout="horizontal">
                      <div className="question-list">
                        <div className="create-question-btn">
                          {inputVisible ? (
                            <Input
                              ref={inputRef}
                              type="text"
                              style={{ width: 124 }}
                              value={inputValue}
                              onChange={handleInputChange}
                              onBlur={handleInputConfirm}
                              onPressEnter={handleInputConfirm}
                            />
                          ) : (
                            <Button icon={<PlusOutlined />} type="primary" onClick={showInput}>
                              考核关键词
                            </Button>
                          )}
                        </div>
                        <Space wrap size={[0, 8]}>
                          {(expandsJson?.[0].keyword || []).map((item: any, index: number) => {
                            return (
                              <Tag
                                key={index}
                                closable
                                style={{ userSelect: "none" }}
                                onClose={(e) => {
                                  e.preventDefault();
                                  handleClose(item);
                                }}>
                                {item}
                              </Tag>
                            );
                          })}
                        </Space>
                      </div>
                    </Form.Item>
                  </div>
                ))}
              </div>
            )}
          </Form.List>
        )}

        {/* 下拉题 */}
        {questionType === "DROP_DOWN" && (
          <Form.List
            name="expandsJson"
            initialValue={[{ sn: 0, answer: "" }]}
            rules={[
              {
                validator(rule, value, callback) {
                  // 至少设置一个正确答案
                  const isCorrect = value.some((item: any) => item.answer);
                  // 内容选项不能为空
                  const isContent = value.every((item: any) => item.content);
                  // 组别不能为空
                  const isGroup = value.every((item: any) => item.number);
                  if (!isCorrect || !isContent || !isGroup) {
                    return Promise.reject(new Error("请设置正确答案并选择组别"));
                  }
                  return Promise.resolve();
                },
              },
            ]}>
            {(fields, { add, remove }, { errors }) => (
              <div className="question-list">
                <Button
                  type="primary"
                  className="create-question-btn"
                  onClick={() => add({ answer: "", sn: fields.length + 1 })}>
                  新建选项
                </Button>
                <div className="question-list-header">
                  <Row gutter={40}>
                    <Col span={3}>序号</Col>
                    <Col span={9}>选项内容</Col>
                    <Col span={5}>组别</Col>
                    <Col span={3}>正确选项</Col>
                    <Col span={4}></Col>
                  </Row>
                </div>
                {fields.map((field, index) => (
                  <div key={field.key} className="question-item">
                    <Row gutter={40}>
                      <Col span={3} className="num">
                        {index + 1}
                      </Col>
                      <Col span={9}>
                        <Form.Item
                          name={[field.name, "content"]}
                          rules={[{ required: true }]}
                          noStyle>
                          <Input placeholder="请输入选项内容" />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          name={[field.name, "number"]}
                          rules={[{ required: true }]}
                          noStyle>
                          <Select
                            options={Array.from(new Array(10)).map((item, index) => ({
                              label: index + 1,
                              value: index + 1,
                            }))}
                            placeholder="请选择组别"
                            style={{ width: 90 }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item name={[field.name, "answer"]} valuePropName="checked" noStyle>
                          <Checkbox />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        {index > 0 ? (
                          <Button
                            type="link"
                            danger
                            onClick={() => {
                              remove(field.name);
                              sortQuestionOptionSn();
                            }}>
                            删除
                          </Button>
                        ) : null}
                      </Col>
                    </Row>
                  </div>
                ))}
                <Form.ErrorList errors={errors} className="error-color" />
              </div>
            )}
          </Form.List>
        )}

        {/* AI分析题 */}
        {questionType === "AI_ANALYSE" && (
          <Form.List
            name="expandsJson"
            initialValue={[{ sn: 0, answer: "" }]}
            rules={[
              {
                validator(rule, value, callback) {
                  const isArithmetic = value.every((item: any) => item.algorithm);
                  const isStandard = value.every((item: any) => item.standard);
                  const isErrorRange = value.every((item: any) => item.errorMargin);
                  if (!isArithmetic || !isStandard || !isErrorRange) {
                    return Promise.reject(new Error("请设置正确答案"));
                  }
                  return Promise.resolve();
                },
              },
            ]}>
            {(fields, { add, remove }, { errors }) => (
              <div className="question-list">
                <Button
                  type="primary"
                  className="create-question-btn"
                  onClick={() =>
                    add({
                      sn: fields.length + 1,
                      answer: false,
                    })
                  }>
                  新增答案
                </Button>
                <div className="question-list-header">
                  <Row gutter={40}>
                    <Col span={3}>序号</Col>
                    <Col span={7}>AI算法</Col>
                    <Col span={5}>标准值</Col>
                    <Col span={5}>误差范围(±)</Col>
                    <Col span={4}></Col>
                  </Row>
                </div>
                {fields.map((field, index) => (
                  <div key={field.key} className="question-item">
                    <Row gutter={40}>
                      <Col span={3} className="num">
                        {index + 1}
                      </Col>
                      <Col span={7}>
                        <Form.Item
                          name={[field.name, "algorithm"]}
                          rules={[{ required: true }]}
                          noStyle>
                          <Select
                            options={dicts.getDict("ai_type")}
                            placeholder="请选择AI算法"
                            style={{ width: "80%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          name={[field.name, "standard"]}
                          rules={[{ required: true }]}
                          noStyle>
                          <Input placeholder="请输入标准值" />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          name={[field.name, "errorMargin"]}
                          rules={[{ required: true }]}
                          noStyle>
                          <Input placeholder="请输入误差范围" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        {index > 0 ? (
                          <Button
                            type="link"
                            danger
                            onClick={() => {
                              remove(field.name);
                              sortQuestionOptionSn();
                            }}>
                            删除
                          </Button>
                        ) : null}
                      </Col>
                    </Row>
                  </div>
                ))}
                <Form.ErrorList errors={errors} className="error-color" />
              </div>
            )}
          </Form.List>
        )}

        {/* 显微镜题 */}
        {questionType === "MICROSCOPE" && (
          <Form.List name="expandsJson" initialValue={[{ photo: [], sn: 0, answer: "" }]}>
            {(fileds, { add, remove }) => (
              <div className="question-list">
                {fileds.map((field, index) => (
                  <div key={field.key}>
                    <Row gutter={40}>
                      <Col span={12}>
                        <Form.Item
                          label="相似度阈值"
                          name={[field.name, "similarity"]}
                          rules={[{ required: true }]}
                          layout="horizontal">
                          <Input placeholder="请输入相似度阈值" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="清晰度阈值"
                          name={[field.name, "clarity"]}
                          rules={[{ required: true }]}
                          layout="horizontal">
                          <Input placeholder="请输入清晰度阈值" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      label="上传"
                      name={[field.name, "photo"]}
                      valuePropName="fileList"
                      layout="horizontal"
                      getValueFromEvent={normFile}>
                      <Upload {...uploadProps}>
                        <button style={{ border: 0, background: "none" }} type="button">
                          <PlusOutlined />
                        </button>
                      </Upload>
                    </Form.Item>
                  </div>
                ))}
              </div>
            )}
          </Form.List>
        )}

        {/* 传感器题 */}
        {questionType === "SENSOR" && (
          <Form.List name="expandsJson" initialValue={[{ sn: 0, answer: "" }]}>
            {(fields, { add, remove }, { errors }) => (
              <div className="question-list">
                <Button
                  type="primary"
                  className="create-question-btn"
                  onClick={() =>
                    add({
                      sn: fields.length + 1,
                      answer: "",
                    })
                  }>
                  新建答案
                </Button>
                <div className="question-list-header">
                  <Row gutter={30}>
                    <Col span={3}>序号</Col>
                    <Col span={4}>传感器型号</Col>
                    <Col span={4}>读值方式</Col>
                    <Col span={5}>标准值</Col>
                    <Col span={5}>误差范围(±)</Col>
                    <Col span={3}></Col>
                  </Row>
                </div>
                {fields.map((field, index) => (
                  <div key={field.key} className="question-item">
                    <Row gutter={30}>
                      <Col span={3} className="num">
                        {index + 1}
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          name={[field.name, "model"]}
                          rules={[{ required: true }]}
                          noStyle>
                          <Select
                            options={dicts.getDict("sensor_type")}
                            placeholder="请选择型号"
                            style={{ width: "100%" }}></Select>
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          name={[field.name, "readingMethod"]}
                          rules={[{ required: true }]}
                          noStyle>
                          <Select
                            options={dicts.getDict("way_type")}
                            placeholder="请选择读值方式"
                            style={{ width: "100%" }}></Select>
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          name={[field.name, "standard"]}
                          rules={[{ required: true }]}
                          noStyle>
                          <Input placeholder="请输入标准值" />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          name={[field.name, "errorMargin"]}
                          rules={[{ required: true }]}
                          noStyle>
                          <Input placeholder="请输入误差范围" />
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        {index > 0 ? (
                          <Button type="link" danger onClick={() => remove(field.name)}>
                            删除
                          </Button>
                        ) : null}
                      </Col>
                    </Row>
                  </div>
                ))}
                <Form.ErrorList errors={errors} />
              </div>
            )}
          </Form.List>
        )}

        <Form.Item name="parse" label="题目解析" rules={[{ required: true }]}>
          <Input.TextArea rows={4} placeholder="请输入题目解析" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default QuestionModal;
