import { useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  Modal,
  Popover,
  Space,
  Switch,
  Table,
  TableColumnsType,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import DimensionalityModal, { DimensionalityModalRef } from "./DimensionalityModal";
import {
  reqDelDimensionality,
  reqDelScheme,
  reqDimensionalityList,
  reqEditSchemeStatus,
  reqSchemeList,
} from "@/api/system";
import { DimensionalityListRes, EditSchemeStatusReq, SchemeListRes } from "@/api/system/types";
import SchemeDrawer, { SchemeDrawerRef } from "./SchemeDrawer";

const Appraisal = () => {
  const dimensionalityColums: TableColumnsType<DimensionalityListRes> = [
    { title: "序号", align: "center", render: (value, record, index) => index + 1 },
    { title: "测评维度", align: "center", dataIndex: "dimensionName" },
    {
      title: "操作",
      align: "center",
      render: (value, record) => {
        return (
          <Space size={15}>
            <Typography.Link
              onClick={() => {
                editDimensionalityRef.current?.dimensionalityForm.setFieldsValue({
                  id: record.id,
                  dimensionName: record.dimensionName,
                });
                editDimensionalityRef.current?.setShow(true);
              }}>
              编辑
            </Typography.Link>
            <Typography.Text
              type="danger"
              className="cur-pointer"
              onClick={() => {
                delDimensionality(record);
              }}>
              删除
            </Typography.Text>
          </Space>
        );
      },
    },
  ];
  const addDimensionalityRef = useRef<DimensionalityModalRef>(null);
  const editDimensionalityRef = useRef<DimensionalityModalRef>(null);
  const [dimensionalityList, setDimensionalityList] = useState<DimensionalityListRes[]>([]);
  const getDimensionalityList = async () => {
    const res = await reqDimensionalityList();
    if (res.code === 200) {
      setDimensionalityList(res.data);
    } else {
      message.error(res.message);
    }
  };

  const delDimensionality = async (values: DimensionalityListRes) => {
    Modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${values.dimensionName}】吗？`,
      onOk: async (close) => {
        const res = await reqDelDimensionality({ id: values.id });
        if (res.code === 200) {
          close();
          getDimensionalityList();
          message.success("删除测评维度成功");
        } else {
          message.error(res.message);
        }
      },
    });
  };

  const schemeColums: TableColumnsType<SchemeListRes> = [
    { title: "序号", align: "center", render: (value, record, index) => index + 1 },
    { title: "测评方案名称", align: "center", dataIndex: "planName" },
    { title: "应用课程", align: "center", dataIndex: "courseName" },
    {
      title: "适用学段",
      align: "center",
      dataIndex: "periods",
      render: (value, record) => {
        return (
          <Space>
            {record.periods.map((item) => (
              <Tag key={item.id}>{item.periodName}</Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "测评详情",
      align: "center",
      dataIndex: "planDimensions",
      render: (value, record) => {
        const element = record.planDimensions[0];
        return (
          <Popover
            placement="topLeft"
            content={
              <Space direction="vertical">
                {record.planDimensions.map((item) => {
                  return (
                    <div key={item.id}>
                      <Typography.Link>{item.dimensionName}</Typography.Link>
                      <Typography.Text>
                        : {item.leftNum}-{item.rightNum}%
                      </Typography.Text>
                    </div>
                  );
                })}
              </Space>
            }>
            <Typography.Link>
              {element.dimensionName}: {element.leftNum}-{element.rightNum}%...
            </Typography.Link>
          </Popover>
        );
      },
    },
    {
      title: "规则状态",
      align: "center",
      dataIndex: "isEnabled",
      render: (value, record) => {
        return (
          <Switch
            value={value}
            checkedChildren="正常"
            unCheckedChildren="停用"
            onChange={(val) => {
              editSchemeStatus({ id: record.id, isEnabled: val });
            }}
          />
        );
      },
    },
    {
      title: "操作",
      align: "center",
      render: (value, record) => {
        return (
          <Space size={15}>
            <Typography.Link
              onClick={() => {
                editSchemeRef.current?.schemeForm.setFieldsValue({
                  id: record.id,
                  planName: record.planName,
                  courseId: record.courseId,
                  periodIds: record.periodIds,
                  isEnabled: record.isEnabled,
                  planDimensions: record.planDimensions,
                });
                editSchemeRef.current?.setShow(true);
              }}>
              编辑
            </Typography.Link>
            <Typography.Text
              type="danger"
              className="cur-pointer"
              onClick={() => {
                delScheme(record);
              }}>
              删除
            </Typography.Text>
          </Space>
        );
      },
    },
  ];
  const addSchemeRef = useRef<SchemeDrawerRef>(null);
  const editSchemeRef = useRef<SchemeDrawerRef>(null);
  const [schemeList, setSchemeList] = useState<SchemeListRes[]>([]);
  const getSchemeList = async () => {
    const res = await reqSchemeList();
    if (res.code === 200) {
      setSchemeList(res.data);
    } else {
      message.error(res.message);
    }
  };
  const editSchemeStatus = async (values: EditSchemeStatusReq) => {
    const res = await reqEditSchemeStatus(values);
    if (res.code === 200) {
      message.success("修改测评方案规则状态成功");
      getSchemeList();
    } else {
      message.error(res.message);
    }
  };

  const delScheme = async (values: SchemeListRes) => {
    Modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${values.planName}】吗？`,
      onOk: async (close) => {
        const res = await reqDelScheme({ id: values.id });
        if (res.code === 200) {
          close();
          getSchemeList();
          message.success("删除测评方案成功");
        } else {
          message.error(res.message);
        }
      },
    });
  };

  useEffect(() => {
    getDimensionalityList();
    getSchemeList();
  }, []);

  return (
    <div>
      <Tabs
        items={[
          {
            key: "dimensionality",
            label: "测评维度",
            children: (
              <div style={{ padding: 20 }}>
                <Flex justify="flex-end" style={{ marginBottom: 20 }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      addDimensionalityRef.current?.setShow(true);
                    }}>
                    新增测评维度
                  </Button>
                </Flex>
                <Table
                  columns={dimensionalityColums}
                  dataSource={dimensionalityList}
                  pagination={false}
                  rowKey={(record) => record.id}
                />
              </div>
            ),
          },
          {
            key: "scheme",
            label: "测评方案",
            children: (
              <div style={{ padding: 20 }}>
                <Flex justify="flex-end" style={{ marginBottom: 20 }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      addSchemeRef.current?.setShow(true);
                    }}>
                    新增测评方案
                  </Button>
                </Flex>
                <Table
                  columns={schemeColums}
                  dataSource={schemeList}
                  pagination={false}
                  rowKey={(record) => record.id}
                />
              </div>
            ),
          },
        ]}
        className="tabs-box"></Tabs>
      <DimensionalityModal
        ref={addDimensionalityRef}
        title="新增测评维度"
        callback={getDimensionalityList}
      />
      <DimensionalityModal
        ref={editDimensionalityRef}
        title="编辑测评维度"
        callback={getDimensionalityList}
      />
      <SchemeDrawer
        ref={addSchemeRef}
        title="新增测评方案"
        dimensionalityList={dimensionalityList}
        callback={getSchemeList}
      />
      <SchemeDrawer
        ref={editSchemeRef}
        title="编辑测评方案"
        dimensionalityList={dimensionalityList}
        callback={getSchemeList}
      />
    </div>
  );
};

export default Appraisal;
