import { useEffect, useRef, useState } from "react";
import { Button, Modal, Space, Switch, Table, TableColumnsType, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import ComGradeTree from "@/components/ComGradeTree";
import { PAGE_CURRENT, PAGE_SIZE } from "@/utils/constant";
import CreateExperimentModal, { AddOrEditExerpimentRef } from "./CreateExperimentModal";
import { reqDelExperimentContent, reqEditExperiment, reqExperimentPage } from "@/api/aiModel";

import styles from "./index.module.scss";
import { Store, useIds } from "@/store";

const { Link, Text } = Typography;

const Experiment = () => {
  const { ids } = useIds();
  const navigate = useNavigate();
  const columns: TableColumnsType = [
    {
      title: "序号",
      align: "center",
      render(value, record, index) {
        return (experimentData.page - 1) * experimentData.size + index + 1;
      },
    },
    { title: "实验名称", dataIndex: "name", align: "center" },
    {
      title: "是否AI评分",
      dataIndex: "enableAi",
      align: "center",
      render(value, record) {
        return (
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            value={value}
            onChange={async (val) => {
              const res = await reqEditExperiment({
                id: record.id,
                name: record.name,
                aiId: record.aiId,
                enableAi: val,
                subjectId: record.subjectId,
                chapterId: record.chapterId,
                gradeId: record.gradeId,
                type: "company",
              });
              if (res.code === 200) {
                message.success("编辑AI评分状态成功！");
                fetchExperimentPage(experimentData.page, experimentData.size);
              } else {
                message.error(res.message);
              }
            }}
          />
        );
      },
    },
    // { title: "创建人", align: "center", dataIndex: "createUserName" },
    {
      title: "创建时间",
      dataIndex: "createTime",
      align: "center",
      render(value) {
        return dayjs(value).format("YYYY/MM/DD HH:mm");
      },
    },
    {
      title: "操作",
      align: "center",
      render(value, record) {
        return (
          <Space size={20}>
            <Link
              onClick={() => {
                navigate("/experiment/content", {
                  state: { id: record.id },
                });
              }}>
              查看
            </Link>
            <Link
              onClick={() => {
                navigate("/experiment/setScore", {
                  state: { id: record.id, contentId: record.experimentContentId },
                });
              }}>
              设置分值
            </Link>
            <Link
              onClick={() => {
                editExerpimentRef.current?.experimentForm.setFieldsValue({
                  id: record.id,
                  name: record.name,
                  aiId: record.aiId,
                  enableAi: record.enableAi,
                });
                editExerpimentRef.current?.setShow(true);
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
  const [nodeInfo, setNodeInfo] = useState<Store["ids"]["node"] | null>(null);
  const [experimentData, setExperimentData] = useState<PageRes>({
    page: PAGE_CURRENT,
    size: PAGE_SIZE,
    data: [],
    total: 0,
  });
  const fetchExperimentPage = async (page = PAGE_CURRENT, size = PAGE_SIZE) => {
    if (!nodeInfo?.chapterId) {
      return;
    }
    const res = await reqExperimentPage({
      offset: page,
      size,
      chapterId: nodeInfo?.chapterId as string,
      subjectId: ids.course.courseId,
      gradeId: ids.textbook.gradeId,
      type: "company",
    });
    if (res.code === 200) {
      const { current, records, ...rest } = res.data;
      setExperimentData({ ...rest, data: records, page: Number(current) });
    } else {
      message.error(res.message);
    }
  };
  const createExerpimentRef = useRef<AddOrEditExerpimentRef>(null);
  const editExerpimentRef = useRef<AddOrEditExerpimentRef>(null);
  const delExperiment = async (values: any) => {
    Modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${values.name}】吗？请谨慎操作，一旦删除可能 无法恢复。`,
      onOk: async (close) => {
        const res = await reqDelExperimentContent({ id: values.id });
        if (res.code === 200) {
          fetchExperimentPage(experimentData.page, experimentData.size);
          close();
          message.success("删除实验成功");
        } else {
          message.error(res.message);
        }
      },
    });
  };
  useEffect(() => {
    fetchExperimentPage();
  }, [nodeInfo?.nodeId]);

  return (
    <div className={styles["root"]}>
      <ComGradeTree countType="1" isExperimentalCurriculum={true} callPage={setNodeInfo} />
      <div className="experiment-box">
        <Button
          type="primary"
          className="create-btn"
          onClick={() => {
            createExerpimentRef.current?.setShow(true);
          }}>
          创建实验
        </Button>
        <Table columns={columns} dataSource={experimentData.data} rowKey={(record) => record.id} />
      </div>
      <CreateExperimentModal
        ref={createExerpimentRef}
        title="创建实验"
        callback={fetchExperimentPage}
      />
      <CreateExperimentModal
        ref={editExerpimentRef}
        title="编辑实验"
        callback={() => fetchExperimentPage(experimentData.page, experimentData.size)}
      />
    </div>
  );
};

export default Experiment;
