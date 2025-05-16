import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  message,
} from "antd";
import type { FormInstance, ModalProps, TableColumnsType } from "antd";
import {
  DeleteTwoTone,
  EditTwoTone,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  reqAddDict,
  reqDelDict,
  reqDictList,
  reqDictDetail,
  reqAddDictDetail,
  reqUpdateDictDetail,
  reqDelDictDetail,
  reqUpdateDict,
} from "@/api/system";
import type {
  IAddDict,
  IAddDictDetail,
  IDelDict,
  IDelDictDetail,
  IUpdateDict,
  IUpdateDictDetail,
} from "@/api/system/types";
import { SpinLoading } from "@/components";
import styles from "./index.module.scss";

interface IDictTypeList {
  key: React.Key;
  label: string;
  value: string;
  dictSort: number;
  dictId: string;
  detailId: string;
}
interface IDict {
  dict: IUpdateDict[];
  label: IDictTypeList[];
}

const SystemDict: React.FC = () => {
  // 字典列表
  const [dictListLoading, setDictListLoading] = useState(false);
  const [dicts, setDicts] = useState<IDict>({
    dict: [],
    label: [],
  });
  const [selectId, setSelectId] = useState("");
  // 字典详情
  const [filterDictDetail, setFilterDictDetail] = useState<IDictTypeList[]>([]);
  const columns: TableColumnsType<IDictTypeList> = [
    {
      title: "序号",
      align: "center",
      width: 80,
      render: (val, _, index) => index + 1,
    },
    { title: "展示值(label)", dataIndex: "label" },
    {
      title: "字典值(value)",
      dataIndex: "value",
    },
    {
      title: "排序",
      dataIndex: "dictSort",
      align: "center",
    },
    {
      title: "操作",
      align: "center",
      width: 200,
      render: (value, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              updateDictDetailRef.current?.dictForm.setFieldsValue({
                detailId: record.detailId,
                value: record.value,
                label: record.label,
                dictSort: record.dictSort,
              });
              updateDictDetailRef.current?.setShow(true);
            }}>
            编辑
          </Button>
          <Button
            type="text"
            danger
            onClick={() => {
              delDictDetail({ detailId: record.detailId }, record.label);
            }}>
            删除
          </Button>
        </>
      ),
    },
  ];
  const getDictList = async () => {
    setDictListLoading(true);
    const res = await reqDictList();
    if (res.code === 200) {
      getDictDetailList(res.data);
    } else {
      message.error(res.message);
    }
    setDictListLoading(false);
  };
  const getDictDetailList = async (value: IUpdateDict[] = dicts.dict) => {
    const res = await reqDictDetail();
    if (res.code === 200) {
      setDicts({
        dict: value,
        label: res.data,
      });
      if (value.length) {
        const dictId = selectId || value[0].dictId;
        // 首次进入时默认设置
        if (!selectId) {
          setSelectId(dictId);
        }
        const filterDictDetail = res.data.filter((item: IDictTypeList) => item.dictId === dictId);
        if (filterDictDetail.length) {
          setFilterDictDetail(filterDictDetail);
        }
      }
    } else {
      message.error(res.message);
    }
  };

  // 字典增删改查
  const addDictRef = useRef<IChildRef<IUpdateDict>>(null);
  const updateDictRef = useRef<IChildRef<IUpdateDict>>(null);
  const addDict = async (values: IAddDict) => {
    addDictRef.current?.setConfirmLoading(true);
    const res = await reqAddDict(values);
    if (res.code === 200) {
      addDictRef.current?.setShow(false);
      getDictList();
      message.success("添加字典成功");
    } else {
      message.error(res.message);
    }
    addDictRef.current?.setConfirmLoading(false);
  };
  const updateDict = async (values: IUpdateDict) => {
    updateDictRef.current?.setConfirmLoading(true);
    const res = await reqUpdateDict(values);
    if (res.code === 200) {
      updateDictRef.current?.setShow(false);
      getDictList();
      message.success("修改字典信息成功");
    } else {
      message.error(res.message);
    }
    updateDictRef.current?.setConfirmLoading(false);
  };
  const delDict = async (values: IDelDict) => {
    const res = await reqDelDict(values);
    if (res.code === 200) {
      getDictList();
      message.success("删除字典成功");
    } else {
      message.error(res.message);
    }
  };

  // 字典详情增删改查
  const addDictDetailRef = useRef<IChildRef<IAddDictDetail>>(null);

  const addDictDetail = async (values: IDictDetail) => {
    addDictDetailRef.current?.setConfirmLoading(true);
    const res = await reqAddDictDetail({
      dictId: selectId,
      ...values,
    } as IAddDictDetail);
    if (res.code === 200) {
      addDictDetailRef.current?.setShow(false);
      getDictDetailList();
      message.success("添加字典详情成功");
    } else {
      message.error(res.message);
    }
    addDictDetailRef.current?.setConfirmLoading(false);
  };
  const updateDictDetailRef = useRef<IChildRef<IUpdateDictDetail>>(null);
  const updateDictDetail = async (values: IDictDetail) => {
    updateDictDetailRef.current?.setConfirmLoading(true);
    const res = await reqUpdateDictDetail(values as IUpdateDictDetail);
    if (res.code === 200) {
      updateDictDetailRef.current?.setShow(false);
      getDictDetailList();
      message.success("修改字典信息成功");
    } else {
      message.error(res.message);
    }
    updateDictDetailRef.current?.setConfirmLoading(false);
  };
  const delDictDetail = async (values: IDelDictDetail, text: string) => {
    Modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${text}】吗？`,
      onOk: async (close) => {
        const res = await reqDelDictDetail(values);
        if (res.code === 200) {
          getDictDetailList();
          close();
          message.success("删除字典详情成功");
        } else {
          message.error(res.message);
        }
      },
    });
  };
  const [searchValue, setSearchValue] = useState<string>("");
  const tempSetValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const dictList = useMemo(() => {
    return dicts.dict.filter(
      (k) => k.name.includes(searchValue) || k.description.includes(searchValue)
    );
  }, [searchValue, dicts]);

  useEffect(() => {
    getDictList();
  }, []);
  return (
    <div className={styles.root}>
      <div className="dict-list-wrapper">
        <div className="dict-list-content">
          <h4 className="title">字典列表</h4>
          <Button
            type="primary"
            onClick={() => {
              addDictRef.current?.setShow(true);
            }}>
            新增
          </Button>
        </div>
        <div>
          <Input
            prefix={<SearchOutlined />}
            placeholder="请输入英文/中文名"
            value={searchValue}
            allowClear
            maxLength={100}
            onChange={tempSetValue}
          />
        </div>
        <div className="dict-list">
          <SpinLoading spinning={dictListLoading} hasData={dicts.dict.length}>
            <ul>
              {dictList.map((item: IUpdateDict, index: number) => {
                return (
                  <li
                    key={index}
                    className={selectId === item.dictId ? "selected" : ""}
                    onClick={() => {
                      setSelectId(item.dictId);
                      const filterDetail = dicts.label.filter((k) => k.dictId === item.dictId);
                      setFilterDictDetail(filterDetail);
                    }}>
                    <div className="text text-ellipsis" title={item.name}>
                      {item.description}
                    </div>
                    <Space>
                      <EditTwoTone
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDictRef.current?.setShow(true);
                          updateDictRef.current?.dictForm.setFieldsValue({
                            dictId: item.dictId,
                            name: item.name,
                            description: item.description,
                          });
                        }}
                      />
                      <Popconfirm
                        title="提示"
                        placement="right"
                        description="确定要删除吗？"
                        onCancel={(e) => {
                          e?.stopPropagation();
                        }}
                        onConfirm={() => {
                          delDict({ dictId: item.dictId });
                        }}>
                        <DeleteTwoTone
                          twoToneColor="red"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />
                      </Popconfirm>
                    </Space>
                  </li>
                );
              })}
            </ul>
          </SpinLoading>
        </div>
      </div>
      <div className="dict-detail">
        <Button
          type="primary"
          className="add-dict-detail"
          onClick={() => {
            addDictDetailRef.current?.setShow(true);
          }}>
          新增字典详情
        </Button>
        <Table
          pagination={false}
          dataSource={filterDictDetail}
          loading={dictListLoading}
          columns={columns}
          rowKey={(record) => record.detailId}
        />
      </div>
      <DictModal title="新增字典" handleSubmit={addDict} ref={addDictRef} />
      <DictModal title="修改字典" handleSubmit={updateDict} ref={updateDictRef} />
      <DictDetailModal
        title="新增字典详情"
        handleSubmit={addDictDetail}
        ref={addDictDetailRef as any}
      />
      <DictDetailModal
        title="修改字典详情"
        handleSubmit={updateDictDetail}
        ref={updateDictDetailRef as any}
      />
    </div>
  );
};

interface IOtherProps<T> {
  handleSubmit: (params: T) => void;
}
interface IChildRef<T> {
  setShow: Dispatch<SetStateAction<boolean>>;
  dictForm: FormInstance<T>;
  setConfirmLoading: Dispatch<SetStateAction<boolean>>;
}
const DictModal = forwardRef<IChildRef<IUpdateDict>, ModalProps & IOtherProps<IUpdateDict>>(
  function Child(props, ref) {
    useImperativeHandle(
      ref,
      () => {
        return {
          setShow,
          dictForm,
          setConfirmLoading,
        };
      },
      []
    );
    const [dictForm] = Form.useForm<IUpdateDict>();
    const [show, setShow] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    return (
      <Modal
        {...props}
        open={show}
        confirmLoading={confirmLoading}
        onOk={() => {
          dictForm
            .validateFields()
            .then((values) => {
              props.handleSubmit(values);
            })
            .catch((err) => {
              console.error(err);
            });
        }}
        onCancel={() => {
          dictForm.resetFields();
          setShow(false);
        }}>
        <Form form={dictForm} autoComplete="off">
          <Form.Item hidden name="dictId">
            <div></div>
          </Form.Item>
          <Form.Item label="字典名(英文)" name="name" rules={[{ required: true, max: 255 }]}>
            <Input placeholder="请输入字典名" />
          </Form.Item>
          <Form.Item label="字典名(中文)" name="description" rules={[{ required: true, max: 255 }]}>
            <Input placeholder="请输入字典名" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);

type IDictDetail = IAddDictDetail | IUpdateDictDetail;
const DictDetailModal = forwardRef<IChildRef<IDictDetail>, ModalProps & IOtherProps<IDictDetail>>(
  function Child(props, ref) {
    useImperativeHandle(
      ref,
      () => {
        return {
          setShow,
          dictForm,
          setConfirmLoading,
        };
      },
      []
    );
    const [dictForm] = Form.useForm<IDictDetail>();
    const [show, setShow] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    return (
      <Modal
        {...props}
        open={show}
        onOk={() => {
          dictForm
            .validateFields()
            .then((values) => {
              props.handleSubmit(values);
            })
            .catch((err) => {
              console.error(err);
            });
        }}
        onCancel={() => setShow(false)}
        confirmLoading={confirmLoading}>
        <Form form={dictForm} autoComplete="off" labelCol={{ span: 6 }}>
          <Form.Item hidden name="detailId">
            <div></div>
          </Form.Item>
          <Form.Item label="展示值(label)" name="label" rules={[{ required: true, max: 255 }]}>
            <Input placeholder="请输入展示值(label)" />
          </Form.Item>
          <Form.Item label="字典值(value)" name="value" rules={[{ required: true, max: 255 }]}>
            <Input placeholder="请输入字典值(value)" />
          </Form.Item>

          <Form.Item label="排序值" name="dictSort" rules={[{ required: true, type: "number" }]}>
            <InputNumber
              placeholder="请输入排序值"
              style={{ width: "100%" }}
              addonBefore={
                <Tooltip className="cur-pointer" placement="bottom" title="数字越小，排序越靠前">
                  <ExclamationCircleOutlined />
                </Tooltip>
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);

export default SystemDict;
