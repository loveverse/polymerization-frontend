import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Cascader,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  message,
} from "antd";
import type { SelectProps, TableColumnsType } from "antd";

import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { reqDelSchool, reqSchoolPage, reqUpdateSchoolStatus } from "@/api/school";
import { SchoolPageReq, SchoolPageRes, UpdateSchoolStatusReq } from "@/api/school/types";
import { reqAreaTree, reqPeriodList } from "@/api/base";
import { AreaTreeRes, PeriodListRes } from "@/api/base/types";
import { useAppContext } from "@/context";
import { PAGE_CURRENT, PAGE_SIZE } from "@/utils/constant";
import SchoolDrawer, { SchoolDrawerRef, FilterOptions } from "./SchoolDrawer";
import styles from "./index.module.scss";
import UpdateSchoolsValidModal from "./UpdateSchoolsValidModal";

const findNodePath = (nodeId: number, data: AreaTreeRes[]): number[] => {
  const path = [];
  const parentMap = new Map();
  let targetNode = null;
  function buildParentMapAndFindTarget(node: AreaTreeRes, parent: AreaTreeRes | null) {
    // 构建哈希表，存储每个节点的父节点
    parentMap.set(node.id, parent);
    if (node.id === nodeId) {
      targetNode = node;
    }
    if (node.children) {
      for (const child of node.children) {
        buildParentMapAndFindTarget(child, node);
      }
    }
  }
  // 初始化哈希表
  for (const node of data) {
    buildParentMapAndFindTarget(node, null);
  }

  if (!targetNode) {
    return []; // 如果没有找到目标节点，返回空字符串
  }
  while (targetNode) {
    path.push(targetNode.id);
    targetNode = parentMap.get(targetNode.id);
  }
  return path.reverse();
};

const setColor = (timestamp: number) => {
  const date = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(date.getMonth() + 3);
  if (timestamp < date.getTime()) {
    return "error";
  }
  if (timestamp < threeMonthsAgo.getTime()) {
    return "warning";
  }
  return "default";
};
const monthOptions: SelectProps["options"] = [
  { label: "1个月", value: 1 },
  { label: "2个月", value: 2 },
  { label: "3个月", value: 3 },
];
const BaseSchool: React.FC = () => {
  const { dicts } = useAppContext();
  const columns: TableColumnsType<SchoolPageRes> = [
    {
      title: "学校账号",
      dataIndex: "schoolAdmin",
      align: "center",
    },

    {
      title: "学校名称",
      dataIndex: "schoolName",
      align: "center",
    },
    {
      title: "授课学段",
      dataIndex: "periods",
      align: "center",

      render: (value: SchoolPageRes["periods"]) => {
        return (
          <Space>
            {value.map((k, ki) => {
              return k ? (
                <Tag color="processing" key={ki}>
                  {k.periodName}
                </Tag>
              ) : null;
            })}
          </Space>
        );
      },
    },
    {
      title: "所属区域",
      dataIndex: "region",
      align: "center",
    },
    {
      title: "学校联系人",
      dataIndex: "contacts",
      align: "center",
    },
    {
      title: "联系方式",
      dataIndex: "contactsPhone",
      align: "center",
    },
    {
      title: "应用状态",
      dataIndex: "isDisabled",
      align: "center",
      render(value, record) {
        return (
          <Switch
            value={!value}
            disabled={setColor(record.validEndTime) === "error"}
            checkedChildren="启用"
            unCheckedChildren="禁用"
            onChange={(val) => {
              updateSchoolStatus({
                id: record.id,
                isDisabled: Number(!val),
              });
            }}
          />
        );
      },
    },
    {
      title: "启用有效期",
      align: "center",
      // onFilter: (value, record) => record.va.indexOf(value as string) === 0,
      sorter: true,
      render(value, record) {
        return (
          <Tag bordered={false} color={setColor(record.validEndTime)}>
            {dayjs(record.validStartTime).format("YYYY-MM-DD至") +
              dayjs(record.validEndTime).format("YYYY-MM-DD")}
          </Tag>
        );
      },
    },
    {
      title: "操作",
      align: "center",
      width: 180,
      render: (value, record) => (
        <>
          <Button
            type="link"
            disabled={setColor(record.validEndTime) === "error"}
            onClick={() => {
              const areaIds = findNodePath(+record.areaId, options.areas);
              updateSchoolRef.current?.schoolForm.setFieldsValue({
                id: record.id,
                schoolName: record.schoolName,
                contacts: record.contacts,
                contactsPhone: record.contactsPhone,
                isDisabled: record.isDisabled + "",
                periodIds: record.periodIds,
                areaId: areaIds,
                times: [dayjs(record.validStartTime), dayjs(record.validEndTime)],
              });
              updateSchoolRef.current?.setShow(true);
            }}>
            编辑
          </Button>
          <Button type="text" danger onClick={() => delSchool(record)}>
            删除
          </Button>
        </>
      ),
    },
  ];
  const [loading, setLoading] = useState(false);
  const [schoolData, setSchoolData] = useState<PageRes<SchoolPageRes>>({
    page: PAGE_CURRENT,
    size: PAGE_SIZE,
    data: [],
    total: 0,
  });
  const [filterForm] = Form.useForm<SchoolPageReq["data"]>();
  const fetchSchoolPage = async (page = PAGE_CURRENT, size = PAGE_SIZE) => {
    setLoading(true);
    const values = filterForm.getFieldsValue();

    if (Array.isArray(values.areaId)) {
      values.areaId = values.areaId[values.areaId.length - 1];
    }
    if (values.dateRange) {
      values.dateRange = [
        dayjs().add(-values.dateRange, "month").valueOf(),
        dayjs().add(1, "d").valueOf(),
      ];
    }
    const res = await reqSchoolPage({
      current: page,
      size,
      data: values,
    });
    if (res.code === 200) {
      const { current, ...rest } = res.data;
      setSchoolData({ ...rest, page: current as number });
    } else {
      message.error(res.message);
    }
    setLoading(false);
  };

  const [options, setOptions] = useState<FilterOptions>({
    periods: [],
    areas: [],
  });
  const fetchFilterOptions = async () => {
    const [res1, res2] = await Promise.all([reqPeriodList(), reqAreaTree({ maxLevel: 3 })]);
    if ([res1, res2].every((k) => k.code === 200)) {
      setOptions({
        periods: res1.data,
        areas: res2.data,
      });
    } else {
      message.error("系统繁忙，请刷新后重试！");
    }
  };

  const addSchoolRef = useRef<SchoolDrawerRef>(null);
  const updateSchoolRef = useRef<SchoolDrawerRef>(null);
  const delSchool = async (values: SchoolPageRes) => {
    Modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${values.schoolName}】吗？`,
      onOk: async (close) => {
        const res = await reqDelSchool(values);
        if (res.code === 200) {
          fetchSchoolPage(schoolData.page, schoolData.size);
          close();
          message.success("删除学校成功");
        } else {
          message.error(res.message);
        }
      },
    });
  };
  const updateSchoolStatus = async (values: UpdateSchoolStatusReq) => {
    const res = await reqUpdateSchoolStatus(values);
    if (res.code === 200) {
      message.success("修改学校状态成功");
      fetchSchoolPage(schoolData.page, schoolData.size);
    } else {
      message.error(res.message);
    }
  };

  const [selectKeys, setSelectKeys] = useState<React.Key[]>([]);
  const [schoolValidShow, setSchoolValidShow] = useState(false);

  useEffect(() => {
    fetchFilterOptions();
    fetchSchoolPage();
  }, []);

  return (
    <div className={styles.root}>
      <div className="filter-box">
        <Form
          form={filterForm}
          autoComplete="off"
          layout="inline"
          className="filter-form"
          onValuesChange={() => {
            fetchSchoolPage();
          }}>
          <Form.Item hidden name="validTimeSort">
            <div />
          </Form.Item>
          <Form.Item name="schoolName">
            <Input
              prefix={<SearchOutlined />}
              allowClear
              variant="filled"
              placeholder="请输入学校名称进行搜索"
              maxLength={100}
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item label="所属区域" name="areaId">
            <Cascader
              allowClear
              options={options.areas}
              style={{ width: 180 }}
              fieldNames={{ value: "id", label: "name" }}
              changeOnSelect
              placeholder="请选择省/市/县"
            />
          </Form.Item>
          <Form.Item label="授课学段" name="periodIds">
            <Select
              allowClear
              options={options.periods}
              style={{ width: 120 }}
              mode="multiple"
              showSearch={false}
              fieldNames={{ value: "id", label: "periodName" }}
              placeholder="全部"
              onChange={(val, option) => {
                const periodIds = (option as PeriodListRes[]).sort(
                  (a, b) => a.orderValue - b.orderValue
                );
                filterForm.setFieldValue(
                  "periodIds",
                  periodIds.map((k) => k.id)
                );
              }}></Select>
          </Form.Item>
          <Form.Item label="应用状态" name="isDisabled">
            <Select
              allowClear
              options={dicts.getDict("lock_status")}
              style={{ width: 100 }}
              placeholder="全部"></Select>
          </Form.Item>
          <Form.Item label="是否过期" name="isValidTime">
            <Select
              allowClear
              options={[
                { value: true, label: "过期" },
                { value: false, label: "没过期" },
              ]}
              style={{ width: 100 }}
              placeholder="全部"></Select>
          </Form.Item>
        </Form>
      </div>
      <div className="school-list-box">
        <div className="btn-group">
          <Space>
            <Button
              type="primary"
              ghost
              disabled={!selectKeys.length}
              onClick={() => {
                setSchoolValidShow(true);
              }}>
              批量修改有效期
            </Button>
            <Button
              type="primary"
              onClick={() => {
                addSchoolRef.current?.setShow(true);
              }}>
              新增学校
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={schoolData.data}
          loading={loading}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectKeys,
            onChange(selectedRowKeys) {
              setSelectKeys(selectedRowKeys);
            },
          }}
          className="teacher-list"
          rowKey={(record) => record.id}
          pagination={{
            current: schoolData.page,
            pageSize: schoolData.size,
            total: schoolData.total,
            showSizeChanger: true,
            showTotal: (total) => `共${total}条数据`,
            onChange: (page, size) => {
              fetchSchoolPage(page, size);
            },
          }}
          onChange={(selectedRowKeys, selectedRows, info: any) => {
            const sortStr = info.order === "ascend" ? "asc" : "desc";
            filterForm.setFieldValue("validTimeSort", sortStr);
            console.log(filterForm.getFieldsValue());

            fetchSchoolPage();
            console.log(selectedRowKeys, selectedRows, info);
          }}></Table>
      </div>
      <SchoolDrawer
        title="新增学校"
        ref={addSchoolRef}
        options={options}
        callback={fetchSchoolPage}
      />
      <SchoolDrawer
        title="修改学校"
        ref={updateSchoolRef}
        options={options}
        callback={() => fetchSchoolPage(schoolData.page, schoolData.size)}
      />
      <UpdateSchoolsValidModal
        open={schoolValidShow}
        selectKeys={selectKeys}
        callback={() => fetchSchoolPage(schoolData.page, schoolData.size)}
        closeOpen={() => setSchoolValidShow(false)}
      />
    </div>
  );
};

export default BaseSchool;
