import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  TableColumnsType,
  Tag,
  message,
} from "antd";

import {
  reqAddCourse,
  reqCoursePage,
  reqDelCourse,
  reqEditCourse,
  reqUpdateCourseStatus,
} from "@/api/course/course";
import { PAGE_CURRENT, PAGE_SIZE } from "@/utils/constant";
import {
  AddCourseReq,
  CoursePageRes,
  EditCourseReq,
  UpdateCourseStatusReq,
} from "@/api/course/course/types";
import { reqCourseTypeList, reqSubjectList } from "@/api/course/subject";
import { useAppContext } from "@/context";
import CourseModal, { CourseChildProps, CourseChildRef } from "./CourseModal";
import { reqPeriodList } from "@/api/base";
import styles from "./index.module.scss";
import { PlusCircleTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CourseManage: React.FC = () => {
  const { dicts } = useAppContext();
  const navigate = useNavigate();

  const [filterForm] = Form.useForm();
  const [filterOptions, setFilterOptions] = useState<CourseChildProps["options"]>({
    subject: [],
    courseType: [],
    period: [],
  });
  const getOptionsData = async () => {
    const [res1, res2, res3] = await Promise.all([
      reqSubjectList(),
      reqCourseTypeList(),
      reqPeriodList(),
    ]);
    if ([res1, res2, res3].every((n) => n.code === 200)) {
      setFilterOptions({
        subject: res1.data,
        courseType: res2.data,
        period: res3.data,
      });
    } else {
      message.error("系统繁忙，请刷新后重试");
    }
  };

  const courseColumns: TableColumnsType<CoursePageRes> = [
    {
      title: "序号",
      align: "center",
      render(value, record, index) {
        return (courseData.page - 1) * courseData.size + index + 1;
      },
    },

    {
      title: "课程名称",
      dataIndex: "subjectName",
      align: "center",
    },
    {
      title: "所属学科",
      dataIndex: "newSubjectName",
      align: "center",
    },
    {
      title: "课程类型",
      dataIndex: "courseTypeName",
      align: "center",
    },
    {
      title: "应用学段",
      dataIndex: "periods",
      align: "center",
      render(value, record) {
        return (
          <Space>
            {record.periods.map((item) => {
              return <Tag key={item.periodId}>{item.periodName}</Tag>;
            })}
          </Space>
        );
      },
    },
    {
      title: "课程分类",
      dataIndex: "courseClassify",
      align: "center",
      render(value) {
        return dicts.getLabel("course_classify", value);
      },
    },
    {
      title: "课程教材",
      align: "center",
      render(value, record) {
        return (
          <Button
            icon={<PlusCircleTwoTone />}
            type="link"
            onClick={() => {
              navigate("/course/courseManage/textbook", {
                state: {
                  courseId: record.id,
                  periodIds: record.periods.map((k) => k.periodId),
                },
              });
            }}>
            教材详情
          </Button>
        );
      },
    },
    {
      title: "课程状态",
      dataIndex: "disabled",
      align: "center",
      width: 120,
      render(value, record) {
        return (
          <Switch
            checkedChildren="正常"
            unCheckedChildren="停用"
            value={!value}
            onChange={(val) => {
              updateCourseStatus({
                id: record.id,
                disabled: Number(!val),
              });
            }}
          />
        );
      },
    },
    {
      title: "操作",
      align: "center",
      width: 160,
      render: (value, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              editCourseRef.current?.courseForm.setFieldsValue({
                id: record.id,
                subjectName: record.subjectName,
                subjectId: record.subjectId,
                courseTypeId: record.courseTypeId,
                courseClassify: record.courseClassify,
                periodIds: record.periods.map((k) => k.periodId),
              });
              editCourseRef.current?.setShow(true);
            }}>
            编辑
          </Button>
          <Button
            type="text"
            danger
            onClick={() => delCourse({ id: record.id }, record.subjectName)}>
            删除
          </Button>
        </>
      ),
    },
  ];
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState<PageRes<CoursePageRes>>({
    page: PAGE_CURRENT,
    size: PAGE_SIZE,
    data: [],
    total: 0,
  });
  const getCoursePage = async (page = PAGE_CURRENT, size = PAGE_SIZE) => {
    const values = filterForm.getFieldsValue();
    setLoading(true);
    const res = await reqCoursePage({
      current: page,
      size,
      data: values,
    });
    if (res.code === 200) {
      const { current, ...rest } = res.data;
      setCourseData({ ...rest, page: current as number });
    } else {
      message.error(res.message);
    }
    setLoading(false);
  };

  const addCourseRef = useRef<CourseChildRef>(null);
  const addCourse = async (values: AddCourseReq) => {
    addCourseRef.current?.setConfirmLoading(true);
    const res = await reqAddCourse(values);
    if (res.code === 200) {
      addCourseRef.current?.setShow(false);
      addCourseRef.current?.courseForm.resetFields();
      getCoursePage();
      message.success("新增课程成功");
    } else {
      message.error(res.message);
    }
    addCourseRef.current?.setConfirmLoading(false);
  };
  const editCourseRef = useRef<CourseChildRef>(null);
  const editCourse = async (values: EditCourseReq) => {
    editCourseRef.current?.setConfirmLoading(true);
    const res = await reqEditCourse(values);
    if (res.code === 200) {
      editCourseRef.current?.setShow(false);
      getCoursePage(courseData.page, courseData.size);
      message.success("编辑课程成功");
    } else {
      message.error(res.message);
    }
    editCourseRef.current?.setConfirmLoading(false);
  };

  const delCourse = async (values: CommonId, text: string) => {
    Modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${text}】吗？`,
      onOk: async (close) => {
        const res = await reqDelCourse(values);
        if (res.code === 200) {
          close();
          getCoursePage(courseData.page, courseData.size);
          message.success("删除课程成功");
        } else {
          message.error(res.message);
        }
      },
    });
  };
  const updateCourseStatus = async (values: UpdateCourseStatusReq) => {
    const res = await reqUpdateCourseStatus(values);
    if (res.code === 200) {
      getCoursePage(courseData.page, courseData.size);
      message.success("修改课程状态成功");
    } else {
      message.error(res.message);
    }
  };
  useEffect(() => {
    getOptionsData();
    getCoursePage();
  }, []);

  return (
    <div className={styles["root"]}>
      <div className="filter-box">
        <Form
          form={filterForm}
          layout="inline"
          autoComplete="off"
          onValuesChange={(values) => {
            console.log(values);

            getCoursePage();
          }}>
          <Form.Item name="subjectName">
            <Input placeholder="请输入课程名称" maxLength={255} />
          </Form.Item>
          <Form.Item label="所属学科" name="subjectId">
            <Select
              options={filterOptions.subject}
              allowClear
              fieldNames={{
                value: "id",
                label: "subjectName",
              }}
              placeholder="全部"
              style={{ width: 120 }}></Select>
          </Form.Item>
          <Form.Item label="课程类型" name="courseTypeId">
            <Select
              options={filterOptions.courseType}
              allowClear
              fieldNames={{
                value: "id",
                label: "courseTypeName",
              }}
              style={{ width: 120 }}
              placeholder="全部"></Select>
          </Form.Item>
          <Form.Item label="课程状态" name="disabled">
            <Select options={dicts.getDict("lock_status")} allowClear placeholder="全部"></Select>
          </Form.Item>
        </Form>
      </div>

      <div className="course-list-box">
        <div className="btn-group">
          <Button
            type="primary"
            onClick={() => {
              addCourseRef.current?.setShow(true);
            }}>
            新增课程
          </Button>
        </div>

        <Table
          loading={loading}
          dataSource={courseData.data}
          columns={courseColumns}
          rowKey={(record) => record.id}
          pagination={{
            current: courseData.page,
            pageSize: courseData.size,
            total: courseData.total,
            showSizeChanger: true,
            showTotal: (total) => `共${total}条数据`,
            onChange: (page, size) => {
              getCoursePage(page, size);
            },
          }}
        />
      </div>
      <CourseModal
        ref={addCourseRef}
        title="新增课程"
        options={filterOptions}
        handleSubmit={addCourse}
      />
      <CourseModal
        ref={editCourseRef}
        title="编辑课程"
        options={filterOptions}
        handleSubmit={editCourse}
      />
    </div>
  );
};

export default CourseManage;
