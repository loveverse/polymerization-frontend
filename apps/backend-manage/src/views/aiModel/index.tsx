import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  TableColumnsType,
  Tabs,
  TabsProps,
  Tree,
  TreeNodeProps,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { PAGE_CURRENT } from "@/utils/constant";
import {
  reqAiModelList,
  reqDelAiModel,
  reqDelExperiment,
  reqDelModelTag,
  reqEditAiModel,
  reqExperimentList,
  reqModelTagList,
} from "@/api/aiModel";
import AddAiModelModal from "./AddAiModelModal";
import AddTagModal, { AddTagModalRef } from "./AddTagModal";

import { useNavigate } from "react-router-dom";
import {
  AiModelListRes,
  EditAiModelReq,
  ExperimentListRes,
  ModelTagListRes,
} from "@/api/aiModel/types";
import dayjs from "dayjs";
import { SpinLoading } from "@/components";
import styles from "./index.module.scss";

const { Link, Text } = Typography;

const ModelTagList = () => {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [aiTree, setAiTree] = useState<AiModelListRes[]>([]);
  const [modelInfo, setModelInfo] = useState<EditAiModelReq>({
    id: "",
    name: "",
    subjectId: "",
  });
  const [loading, setLoading] = useState(false);
  const fetchAiModelList = async () => {
    setLoading(true);
    const res = await reqAiModelList();
    if (res.code === 200) {
      const list = res.data.map((item) => {
        return {
          ...item,
          ...item.subjectDto,
          key: item.subjectDto.id,
          value: item.subjectDto.subjectName,
          disabled: true,
          children: item.aiModels.map((k) => ({ ...k, subjectId: item.subjectDto.id })),
        };
      });
      if (list.length && list[0].aiModels.length) {
        if (!selectedKeys.length) {
          const info = list[0].aiModels[0];
          setSelectedKeys([info.key]);
          setModelInfo({ ...modelInfo, subjectId: list[0].subjectDto.id });
          fetchModelTagList(info.key);
          fetchAiList(info.key, list[0].subjectDto.id);
        }
      }
      setAiTree(list);
    } else {
      message.error(res.message);
    }
    setLoading(false);
  };
  const subjectList = useMemo(() => {
    return aiTree.map((item) => item.subjectDto);
  }, [aiTree]);

  const addAiModelRef = useRef<ChildRef>(null);
  const editAiModel = async (node: AiModelListRes) => {
    if (node.value === modelInfo.name) {
      setModelInfo({ ...modelInfo, id: "" });
      return;
    }
    const res = await reqEditAiModel(modelInfo);
    if (res.code === 200) {
      message.success("修改模型名称成功！");
      setModelInfo({ ...modelInfo, id: "" });
      fetchAiModelList();
    } else {
      message.error(res.message);
    }
  };
  const delAiModel = async (id: string) => {
    const res = await reqDelAiModel({ id });
    if (res.code === 200) {
      message.success("删除Ai模型成功");
      fetchAiModelList();
    } else {
      message.error(res.message);
    }
  };

  // 模型标签
  const tagColumns: TableColumnsType<ModelTagListRes> = [
    {
      title: "序号",
      align: "center",
      render: (value, record, index) => index + 1,
    },
    { title: "模型标签", dataIndex: "name", align: "center" },
    { title: "标签值", dataIndex: "value", align: "center" },
    {
      title: "操作",
      align: "center",
      render(value, record) {
        return (
          <Space size={0}>
            <Button
              type="link"
              onClick={() => {
                editModelTagRef.current?.tagForm.setFieldsValue({
                  id: record.id,
                  name: record.name,
                  value: record.value,
                });
                editModelTagRef.current?.setShow(true);
              }}>
              编辑
            </Button>
            <Button type="link" danger onClick={() => delModelTag(record)}>
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
  const [modelTagList, setModelTagList] = useState<ModelTagListRes[]>([]);
  // 模型标签
  const fetchModelTagList = async (aiId?: string) => {
    const res = await reqModelTagList({ aiId: aiId || selectedKeys[0] });
    if (res.code === 200) {
      setModelTagList(res.data);
    } else {
      message.error(res.message);
    }
  };
  const addModelTagRef = useRef<AddTagModalRef>(null);
  const editModelTagRef = useRef<AddTagModalRef>(null);
  const delModelTag = async (values: ModelTagListRes) => {
    Modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${values.name}】吗？`,
      onOk: async (close) => {
        const res = await reqDelModelTag({ tagId: values.id });
        if (res.code === 200) {
          close();
          fetchModelTagList();
          message.success("删除模型标签成功");
        } else {
          message.error(res.message);
        }
      },
    });
  };

  // 考题
  const questionColumns: TableColumnsType<ExperimentListRes> = [
    {
      title: "序号",
      align: "center",
      render(value, record, index) {
        return (experimentData.page - 1) * experimentData.size + index + 1;
      },
    },
    { title: "考题名称", align: "center", dataIndex: "name" },
    { title: "状态", align: "center", dataIndex: "status" },
    { title: "创建人", align: "center", dataIndex: "createUserName" },
    {
      title: "创建时间",
      align: "center",
      dataIndex: "createTime",
      render(value) {
        return dayjs(value).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      title: "操作",
      align: "center",
      render(value, record, index) {
        return (
          <Space>
            <Link
              onClick={() => {
                navigate("/aiModel/seeExperiment", {
                  state: { id: record.id },
                });
              }}>
              查看
            </Link>
            <Link
              onClick={() => {
                navigate("/aiModel/createExperiment", {
                  state: {
                    id: record.id,
                    aiId: selectedKeys[0],
                    courseId: modelInfo.subjectId,
                    modelTags: modelTagList,
                  },
                });
              }}>
              编辑
            </Link>
            <Text type="danger" className="cur-pointer" onClick={() => delExperiment(record)}>
              删除
            </Text>
          </Space>
        );
      },
    },
  ];
  const [experimentData, setExperimentData] = useState<PageRes>({
    page: PAGE_CURRENT,
    size: 1000,
    data: [],
    total: 0,
  });
  const fetchAiList = async (aiId?: string, subjectId?: string) => {
    const res = await reqExperimentList({
      aiId: aiId || selectedKeys[0],
      page: PAGE_CURRENT,
      size: 1000,
      subjectId: modelInfo.subjectId,
    });
    if (res.code === 200) {
      const { current, ...rest } = res.data;
      setExperimentData({ ...rest, page: current! });
    } else {
      message.error(res.message);
    }
  };
  const delExperiment = async (values: ExperimentListRes) => {
    Modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${values.name}】吗？`,
      onOk: async (close) => {
        const res = await reqDelExperiment({ contentId: values.id });
        if (res.code === 200) {
          message.success("删除考题成功");
          close();
          fetchAiList();
        } else {
          message.error(res.message);
        }
      },
    });
  };

  const navbar: TabsProps["items"] = [
    {
      key: "tag",
      label: "标签",
      children: (
        <div>
          <Button
            type="primary"
            style={{ marginBottom: 20 }}
            disabled={!selectedKeys[0]}
            onClick={() => {
              addModelTagRef.current?.setShow(true);
            }}>
            新增标签
          </Button>
          <Table
            dataSource={modelTagList}
            columns={tagColumns}
            rowKey={(record) => record.id}
            pagination={false}
          />
        </div>
      ),
    },
    {
      key: "question",
      label: "考题",
      children: (
        <div>
          <Button
            type="primary"
            disabled={!selectedKeys[0]}
            style={{ marginBottom: 20 }}
            onClick={() => {
              if (!modelTagList.length) {
                message.warning("请先创建模型标签！");
                return;
              }
              navigate("/aiModel/createExperiment", {
                state: {
                  aiId: selectedKeys[0],
                  courseId: modelInfo.subjectId,
                  modelTags: modelTagList,
                },
              });
            }}>
            新增考题
          </Button>
          <Table
            dataSource={experimentData.data}
            columns={questionColumns}
            rowKey={(record) => record.id}
            pagination={false}
          />
        </div>
      ),
    },
  ];
  const [searchValue, setSearchValue] = useState<string>("");
  const tempSetValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const modelList: AiModelListRes[] = useMemo(() => {
    return aiTree.map((item) => {
      return {
        ...item,
        children: item.children?.filter((k: any) => k.value.includes(searchValue)),
      };
    });
  }, [searchValue, aiTree]);

  useEffect(() => {
    fetchAiModelList();
  }, []);

  return (
    <div className={styles["root"]}>
      <div className="model-box">
        <div className="model-header">
          <div className="model-text">
            AI模型列表
            <Button
              className="add-btn"
              type="link"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => {
                addAiModelRef.current?.setShow(true);
              }}></Button>
          </div>
          <div className="search-box">
            <Input
              value={searchValue}
              prefix={<SearchOutlined />}
              variant="filled"
              placeholder="名称检索"
              onChange={tempSetValue}
            />
          </div>
        </div>
        <div className="ai-model-tree">
          <SpinLoading hasData={aiTree.length} spinning={loading}>
            <Tree
              showLine
              showIcon={false}
              treeData={modelList}
              defaultExpandAll
              selectedKeys={selectedKeys}
              fieldNames={{ title: "value", key: "key", children: "children" }}
              switcherIcon={(props: TreeNodeProps) => {
                return props.expanded ? <MinusOutlined /> : <PlusOutlined />;
              }}
              titleRender={(node) => {
                if (node.key === modelInfo.id) {
                  return (
                    <Input
                      value={modelInfo.name}
                      autoFocus
                      onBlur={() => editAiModel(node)}
                      onPressEnter={() => editAiModel(node)}
                      onChange={({ target: { value } }) => {
                        setModelInfo({ ...modelInfo, name: value });
                      }}
                    />
                  );
                }
                return (
                  <div className="node-name">
                    <p className="title">
                      {node.value}
                      {node.id ? `(${node.num})` : ""}
                    </p>
                    {!node.id ? (
                      <Space size={0}>
                        <Button
                          type="link"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setModelInfo({
                              id: node.key as string,
                              name: node.value,
                              subjectId: node.subjectId,
                            });
                          }}></Button>
                        <Popconfirm
                          title="提示"
                          description="确定要删除该模型吗?"
                          placement="right"
                          onConfirm={() => delAiModel(node.key as string)}>
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}></Button>
                        </Popconfirm>
                      </Space>
                    ) : (
                      <div></div>
                    )}
                  </div>
                );
              }}
              onSelect={(selectedKeys, info) => {
                if (selectedKeys.length) {
                  setModelInfo({ ...modelInfo, subjectId: info.node.subjectId });
                  setSelectedKeys(selectedKeys as string[]);
                  fetchModelTagList(selectedKeys[0] as string);
                  fetchAiList(selectedKeys[0] as string, info.node.subjectId);
                }
              }}
            />
          </SpinLoading>
        </div>
      </div>
      <div className="right-box">
        <Tabs items={navbar} className="tabs-box" />
      </div>
      <AddAiModelModal
        ref={addAiModelRef}
        title="新增模型"
        subjects={subjectList}
        callback={fetchAiModelList}
      />
      <AddTagModal
        title="新增标签"
        count={modelTagList.length}
        ref={addModelTagRef}
        aiId={selectedKeys[0]}
        callback={fetchModelTagList}
      />
      <AddTagModal
        title="编辑标签"
        count={modelTagList.length}
        ref={editModelTagRef}
        aiId={selectedKeys[0]}
        callback={fetchModelTagList}
      />
    </div>
  );
};

export default ModelTagList;
