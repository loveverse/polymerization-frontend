import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Button,
  Modal,
  ModalProps,
  Space,
  Steps,
  Table,
  TableProps,
  Upload,
  UploadProps,
  message,
  Tooltip,
  Form,
  GetRef,
  InputRef,
  Input,
} from "antd";
import styles from "./index.module.scss";
import { ComTitle } from "@/components";

import {
  reqCheckUploadExcel,
  reqDownloadExcel,
  reqSaveUploadExcel,
  reqUploadExcel,
} from "@/api/base";
import { downloadFile } from "@/utils/common";

import UploadSuccessImg from "@/assets/imgs/upload-success.png";
import { UploadExcelRes } from "@/api/base/types";

import { useIds } from "@/store";

export interface ImportUserProps extends ModalProps, ChildCallback {
  onConfirm?: () => void;
}

type ColumnTypes = Exclude<TableProps["columns"], undefined>;

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: any;
  record: any;
  handleSave: (record: any) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const ImportUserModal = forwardRef<ChildRef, ImportUserProps>(function Child(props, ref) {
  useImperativeHandle(
    ref,
    () => {
      return {
        setShow,
        setConfirmLoading,
      };
    },
    []
  );
  const { onConfirm, callback, ...modalProps } = props;
  const { ids } = useIds();
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const getTableTextColor = (value: any, _: any, index: number, val: string) => {
    if (importInfo.failColumns[index] && importInfo.failColumns[index][val]) {
      return (
        <Tooltip title={importInfo.failColumns[index][val]} color="red">
          <span className="color-red">{value}</span>
        </Tooltip>
      );
    }
    return value;
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex?: string })[] = [
    {
      title: "序号",
      align: "center",
      width: 60,
      render: (value, _, index) => index + 1,
    },
    {
      title: "题目内容",
      align: "center",
      dataIndex: "questionContent",
      fixed: "left",
      width: 100,
      editable: true,
      render: (value, _, index) => getTableTextColor(value, _, index, "questionContent"),
    },
    {
      title: "题目解析",
      align: "center",
      dataIndex: "questionAnalysis",
      fixed: "left",
      width: 100,
      editable: true,
      render: (value, _, index) => getTableTextColor(value, _, index, "questionAnalysis"),
    },
    {
      title: "题目类型",
      align: "center",
      dataIndex: "sourceType",
      fixed: "left",
      width: 100,
      editable: true,
      render: (value, _, index) => getTableTextColor(value, _, index, "sourceType"),
    },
    {
      title: "选项数量",
      align: "center",
      dataIndex: "choiceNumber",
      fixed: "left",
      width: 100,
      editable: true,
      render: (value, _, index) => getTableTextColor(value, _, index, "choiceNumber"),
    },
    {
      title: "小题数量",
      align: "center",
      dataIndex: "answerNumber",
      fixed: "left",
      width: 100,
      editable: true,
      render: (value, _, index) => getTableTextColor(value, _, index, "answerNumber"),
    },
    ...Array.from(new Array(20)).map((item, index): any => {
      return {
        title: "小题答案" + (index + 1),
        align: "center",
        dataIndex: "answer" + (index + 1),
        editable: true,
        render: (value: any, _: any, k: number) =>
          getTableTextColor(value, _, k, "answer" + (index + 1)),
      };
    }),
    // {
    //   title: "小题答案详情",
    //   align: "center",
    //   dataIndex: "className",
    //   editable: true,
    //   render: (value, _, index) => getTableTextColor(value, _, index, "className"),
    // },
  ];

  //表格编辑后保存
  const handleSave = (row: any) => {
    const newData = [...importInfo.failList];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setImportInfo({ ...importInfo, failList: newData });
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: stepIndex == 1 ? col.editable : false,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const uploadProps: UploadProps = {
    name: "file",
    accept: ".xls,.xlsx",
    fileList: [],
    customRequest: (val) => {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append("file", val.file);
      importQuestion(formData);
    },
  };
  const [importInfo, setImportInfo] = useState<UploadExcelRes>({
    failColumns: [],
    successList: [],
    failList: [],
  });
  const importQuestion = async (file: FormData) => {
    const res = await reqUploadExcel(file);
    setUploadLoading(false);
    if (res.code === 200) {
      setImportInfo(res.data);
      setStepIndex(stepIndex + 1);
    } else {
      message.error(res.message);
    }
  };

  const [stepIndex, setStepIndex] = useState(0);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const steps = [
    {
      title: "上传文件",
      content: (
        <ul className="import-file">
          <li>
            <label>题目导入模板：</label>
            <Button
              type="link"
              loading={downloadLoading}
              onClick={() => {
                setDownloadLoading(true);
                reqDownloadExcel({ key: "question" })
                  .then((res: any) => {
                    downloadFile(res, "题目导入模板.xlsx");
                  })
                  .finally(() => {
                    setDownloadLoading(false);
                  });
              }}>
              下载
            </Button>
          </li>
          <li>
            <label>上传编辑好对的题目数据：</label>
            <Upload {...uploadProps}>
              <Button type="primary" loading={uploadLoading}>
                上传文件
              </Button>
            </Upload>
          </li>
        </ul>
      ),
    },
    {
      title: "数据校验",
      content: (
        <div style={{ width: "100%" }}>
          <div className="verify-desc">
            正常数据{importInfo.successList?.length}条，异常数据{importInfo.failList?.length}条
          </div>
          {importInfo.failList && importInfo.failList.length > 0 && (
            <>
              <div style={{ display: "flex" }}>
                <ComTitle title="异常数据" />
              </div>

              <Table
                columns={columns as ColumnTypes}
                dataSource={importInfo.failList}
                scroll={{ x: "max-content" }}
                components={components}
              />
            </>
          )}
        </div>
      ),
    },
    {
      title: "确定上传",
      content: (
        <div>
          <div className="upload-success">
            <img src={UploadSuccessImg} alt="" />
            <span className="upload-title">上传成功</span>
            <span className="mg-top-10">你成功上传{importInfo.successList.length}条数据</span>
          </div>
        </div>
      ),
    },
  ];
  const [checkLoading, setCheckLoading] = useState(false);
  const [confirmUploadLoading, setConfirmUploadLoading] = useState(false);
  useEffect(() => {
    setStepIndex(0);
    setImportInfo({
      successList: [],
      failList: [],
      failColumns: [],
    });
  }, [show]);

  return (
    <Modal
      {...modalProps}
      title="批量导入题目"
      width={1500}
      open={show}
      onCancel={() => {
        setShow(false);
      }}
      className={styles["root"]}
      confirmLoading={confirmLoading}
      destroyOnClose={true}
      footer={
        <>
          {stepIndex == 1 && (
            <Space>
              <Button
                type="primary"
                ghost
                loading={checkLoading}
                onClick={() => {
                  setCheckLoading(true);
                  reqCheckUploadExcel([...importInfo.successList, ...importInfo.failList])
                    .then((res) => {
                      if (res.code == 200) {
                        setImportInfo(res.data);
                      } else {
                        message.error(res.message);
                      }
                    })
                    .finally(() => {
                      setCheckLoading(false);
                    });
                }}>
                重新校验
              </Button>
              <Button onClick={() => setShow(false)}>取消上传</Button>
              <Button
                type="primary"
                loading={confirmUploadLoading}
                onClick={() => {
                  setConfirmUploadLoading(true);
                  reqSaveUploadExcel({
                    chapterId: ids.node.chapterId,
                    courseId: ids.course.courseId,
                    gradeId: ids.textbook.gradeId,
                    questions: [...importInfo.successList],
                  })
                    .then((res) => {
                      if (res.code == 200) {
                        setImportInfo(res.data);
                        if (res.data.failList.length > 0) {
                          message.error(res.message);
                        } else {
                          setStepIndex(stepIndex + 1);
                          callback();
                        }
                      } else {
                        message.error(res.message);
                      }
                    })
                    .finally(() => {
                      setConfirmUploadLoading(false);
                    });
                }}>
                确定上传
              </Button>
            </Space>
          )}
          {stepIndex == 2 && (
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setShow(false);
                  onConfirm && onConfirm();
                }}>
                完成
              </Button>
            </Space>
          )}
        </>
      }>
      <Steps current={stepIndex} items={steps} labelPlacement="vertical" className="steps-header" />
      <div className="step-content">{steps[stepIndex].content}</div>
    </Modal>
  );
});

export default ImportUserModal;
