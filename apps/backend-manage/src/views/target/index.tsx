import { reqCourseList } from "@/api/course/course";
import { CoursePageReq, CoursePageRes } from "@/api/course/course/types";
import { reqAddTargetLibrary, reqDelTargetLibrary, reqTargetLibraryList } from "@/api/target";
import { TargetLibraryListRes } from "@/api/target/types";
import { PAGE_CURRENT, PAGE_SIZE } from "@/utils/constant";
import {
  Typography,
  Button,
  Space,
  TableColumnsType,
  Table,
  Flex,
  Modal,
  Form,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Text, Link } = Typography;

const TargetDefault = () => {
  const navigate = useNavigate();
  const columns: TableColumnsType<TargetLibraryListRes> = [
    { title: "课程", align: "center", dataIndex: "subjectName" },
    {
      title: "更新时间",
      align: "center",
      dataIndex: "updateTime",
      render: (value) => dayjs(value).format("YYYY/MM/DD HH:mm"),
    },
    { title: "更新人", align: "center", dataIndex: "updateUserName" },
    {
      title: "操作",
      align: "center",
      render: (value, record) => {
        return (
          <Space size={20}>
            <Link
              onClick={() => {
                navigate("/target/detail", {
                  state: {
                    targetLibraryId: record.id,
                  },
                });
              }}>
              指标详情
            </Link>
            <Text
              type="danger"
              className="cur-pointer"
              onClick={() => {
                delTarget(record);
              }}>
              删除
            </Text>
          </Space>
        );
      },
    },
  ];
  const [targetLibraryList, setTargetLibraryList] = useState<TargetLibraryListRes[]>([]);
  const getTargetLibraryList = async () => {
    const res = await reqTargetLibraryList();
    if (res.code === 200) {
      setTargetLibraryList(res.data);
    } else {
      message.error(res.message);
    }
  };

  const addTarget = async (values: { subjectId: string }) => {
    const res = await reqAddTargetLibrary(values);
    if (res.code === 200) {
      setShow(false);
      targetForm.resetFields();
      message.success("新增指标成功");
      getTargetLibraryList();
    } else {
      message.error(res.message);
    }
  };
  const delTarget = async (values: TargetLibraryListRes) => {
    Modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${values.subjectName}】指标库吗？`,
      onOk: async (close) => {
        const res = await reqDelTargetLibrary({ id: values.id });
        if (res.code === 200) {
          close();
          getTargetLibraryList();
          message.success("删除指标成功");
        } else {
          message.error(res.message);
        }
      },
    });
  };

  const [targetForm] = Form.useForm();
  const [courseList, setCourseList] = useState<Omit<CoursePageRes, "disabled">[]>([]);
  const getCourseList = async () => {
    const res = await reqCourseList({ courseClassify: "SJ" });
    if (res.code === 200) {
      const list = res.data;

      setCourseList(list);
    } else {
      message.error(res.message);
    }
  };
  const [show, setShow] = useState(false);

  useEffect(() => {
    getTargetLibraryList();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Flex justify="flex-end" style={{ marginBottom: 20 }}>
        <Button
          type="primary"
          onClick={() => {
            if (!courseList.length) {
              getCourseList();
            }
            setShow(true);
          }}>
          新增指标
        </Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={targetLibraryList}
        pagination={false}
        rowKey={(record) => record.id}
      />
      <Modal
        title="新增指标库"
        open={show}
        onCancel={() => setShow(false)}
        onOk={() => {
          targetForm
            .validateFields()
            .then((values) => {
              addTarget(values);
            })
            .catch((err) => {
              console.error(err);
            });
        }}>
        <Form form={targetForm}>
          <Form.Item label="课程" name="subjectId" rules={[{ required: true }]}>
            <Select
              options={courseList}
              fieldNames={{ value: "id", label: "subjectName" }}
              placeholder="点击选择课程"></Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TargetDefault;
