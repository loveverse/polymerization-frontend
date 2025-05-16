import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Select, Space, Switch, Table, message } from "antd";
import type { TableColumnsType } from "antd";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { useAppContext } from "@/context";
import { PAGE_CURRENT, PAGE_SIZE } from "@/utils/constant";
import {
  reqDelTextbook,
  reqUpdateTextbookStatus,
  reqTextBookPage,
} from "@/api/course/course/textbook";
import { TextBookListRes, UpdateTextbookStatusReq } from "@/api/course/course/textbook/types";
import { reqGradeList } from "@/api/base";
import { GradeListRes } from "@/api/base/types";
import CatalogueTreeDrawer from "./CatalogueDrawer";
import TextbookModal, { TextbookChildRef } from "./TextbookModal";
import styles from "./index.module.scss";

const Textbook: React.FC = () => {
  const { dicts } = useAppContext();
  const { state = {} } = useLocation();
  const [filterForm] = Form.useForm();
  const [seriesId, setSeriesId] = useState("");
  const columns: TableColumnsType<TextBookListRes> = [
    {
      title: "序号",
      align: "center",
      width: 80,
      render: (value, _, index) => index + 1,
    },
    { title: "教材名称", dataIndex: "textbookName" },
    { title: "教材版本", dataIndex: "versionName" },
    {
      title: "册级",
      dataIndex: "textbookList",
      filterMultiple: false,

      render(value, record) {
        return dicts.getLabel("textbook_volume", record.volumeType);
      },
    },
    {
      title: "应用年级",
      dataIndex: "gradeName",
      align: "center",
    },
    {
      title: "教材状态",
      dataIndex: "disabled",
      align: "center",
      render(value, record) {
        return (
          <Switch
            checkedChildren="正常"
            unCheckedChildren="停用"
            value={!value}
            onChange={(val) => {
              updateTextbookStatus({
                id: record.id,
                disabled: Number(!val),
              });
            }}
          />
        );
      },
    },
    {
      title: "最近更新时间",
      dataIndex: "updateTime",
      align: "center",
      render(value) {
        return dayjs(value).format("YYYY/MM/DD HH:mm");
      },
    },
    {
      title: "操作",
      align: "center",
      width: 300,
      render: (value, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              catalogueDetailRef.current?.setShow(true);
              setSeriesId(record.id);
            }}>
            目录编辑
          </Button>
          <Button
            type="link"
            onClick={() => {
              updateTextbookRef.current?.textbookForm.setFieldsValue({
                id: record.id,
                textbookName: record.textbookName,
                volumeType: record.volumeType,
                versionId: record.versionId,
                gradeId: record.gradeId,
                img: record.img ? [{ url: record.img }] : [],
              });
              updateTextbookRef.current?.setShow(true);
            }}>
            编辑
          </Button>
          <Button
            type="text"
            danger
            onClick={() => {
              delTextbook(record);
            }}>
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const [loading, setLoading] = useState(false);
  const [textbookData, setTextbookData] = useState<PageRes<TextBookListRes>>({
    page: PAGE_CURRENT,
    size: PAGE_SIZE,
    data: [],
    total: 0,
  });
  const fetchTextbookPage = async (page = PAGE_CURRENT, size = PAGE_SIZE) => {
    setLoading(true);
    const values = filterForm.getFieldsValue();
    const res = await reqTextBookPage({
      current: page,
      size,
      data: { courseId: state.courseId, ...values },
    });
    if (res.code === 200) {
      const { current, ...rest } = res.data;
      setTextbookData({ ...rest, page: current! });
    } else {
      message.error(res.message);
    }
    setLoading(false);
  };
  const [gradeList, setGradeList] = useState<GradeListRes[]>([]);
  const fetchGradeList = async () => {
    const res = await reqGradeList({ periodIds: state.periodIds });
    if (res.code === 200) {
      setGradeList(res.data);
    } else {
      message.error(res.message);
    }
  };
  const addTextbookRef = useRef<TextbookChildRef>(null);
  const updateTextbookRef = useRef<TextbookChildRef>(null);
  const delTextbook = async (values: TextBookListRes) => {
    Modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${values.textbookName}】吗？`,
      onOk: async (close) => {
        const res = await reqDelTextbook({ id: values.id });
        if (res.code === 200) {
          close();
          message.success("删除教材成功");
          fetchTextbookPage(textbookData.page, textbookData.size);
        } else {
          message.error(res.message);
        }
      },
    });
  };
  const updateTextbookStatus = async (values: UpdateTextbookStatusReq) => {
    const res = await reqUpdateTextbookStatus(values);
    if (res.code === 200) {
      fetchTextbookPage();
      message.success("修改教材状态成功");
    } else {
      message.error(res.message);
    }
  };
  const catalogueDetailRef = useRef<ChildRef>(null);

  useEffect(() => {
    fetchGradeList();
    fetchTextbookPage();
  }, []);

  return (
    <div className={styles.root}>
      <div className="filter-header">
        <Form
          layout="inline"
          autoComplete="off"
          form={filterForm}
          onValuesChange={() => {
            fetchTextbookPage();
          }}>
          <Form.Item label="应用年级" name="gradeId">
            <Select
              options={gradeList}
              fieldNames={{ value: "id", label: "gradeName" }}
              allowClear
              placeholder="全部"
              style={{ width: 120 }}></Select>
          </Form.Item>
          <Form.Item label="教材状态" name="disabled">
            <Select
              options={dicts.getDict("lock_status")}
              allowClear
              placeholder="全部"
              style={{ width: 120 }}></Select>
          </Form.Item>
        </Form>
      </div>
      <div className="textbook-container">
        <div className="operation-header">
          <Button
            type="primary"
            onClick={() => {
              addTextbookRef.current?.setShow(true);
            }}>
            新增教材
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={textbookData.data}
          loading={loading}
          rowKey={(record) => record.id}
          pagination={{
            current: textbookData.page,
            pageSize: textbookData.size,
            total: textbookData.total,
            showSizeChanger: true,
            showTotal: (total) => `共${total}条数据`,
            onChange(page, pageSize) {
              fetchTextbookPage(page, pageSize);
            },
          }}
        />
      </div>
      <TextbookModal
        title="新增教材"
        ref={addTextbookRef}
        gradeOptions={gradeList}
        courseId={state?.courseId}
        callback={fetchTextbookPage}
      />
      <TextbookModal
        title="修改教材"
        ref={updateTextbookRef}
        gradeOptions={gradeList}
        courseId={state?.courseId}
        callback={() => fetchTextbookPage(textbookData.page, textbookData.size)}
      />
      <CatalogueTreeDrawer ref={catalogueDetailRef} title="目录编辑" textbookId={seriesId} />
    </div>
  );
};

export default Textbook;
