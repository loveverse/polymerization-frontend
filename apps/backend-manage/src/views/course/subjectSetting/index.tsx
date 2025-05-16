import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Table, Tabs, message } from "antd";
import type { TableColumnsType, TabsProps } from "antd";
import {
  reqCourseTypeList,
  reqDelCourseType,
  reqDelSubject,
  reqDelTextbookVersion,
  reqSubjectList,
  reqTextbookVersionList,
} from "@/api/course/subject";
import type {
  CourseTypeListRes,
  SubjectListRes,
  TextbookVersionListRes,
} from "@/api/course/subject/types";
import SubjectModal, { SubjectModalRef } from "./SubjectModal";
import CourseTypeModal, { CourseTypeModalRef } from "./CourseTypeModal";
import styles from "./index.module.scss";
import TextbookVersionModal, { TextbookVersionModalRef } from "./TextbookVersionModal";

const SubjectManage: React.FC = () => {
  // 学科
  const subjectColumns: TableColumnsType<SubjectListRes> = [
    {
      title: "序号",
      align: "center",
      render: (_, record, index) => index + 1,
    },
    {
      title: "学科",
      align: "center",
      dataIndex: "subjectName",
    },
    {
      title: "操作",
      align: "center",
      render(_, record) {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                editSubjectRef.current?.subjectForm.setFieldsValue({
                  id: record.id,
                  subjectName: record.subjectName,
                });
                editSubjectRef.current?.setShow(true);
              }}>
              编辑
            </Button>
            <Button type="text" danger onClick={() => delSubject(record)}>
              删除
            </Button>
          </>
        );
      },
    },
  ];
  const [subjectLoading, setSubjectLoading] = useState(false);
  const [subjectList, setSubjectList] = useState<SubjectListRes[]>([]);
  const fetchSubjectList = async () => {
    setSubjectLoading(true);
    const res = await reqSubjectList();
    if (res.code === 200) {
      setSubjectList(res.data);
    } else {
      message.error(res.message);
    }
    setSubjectLoading(false);
  };
  const addSubjectRef = useRef<SubjectModalRef>(null);
  const editSubjectRef = useRef<SubjectModalRef>(null);
  const delSubject = async (values: SubjectListRes) => {
    Modal.confirm({
      title: "提示",
      content: `确定删除【${values.subjectName}】学科吗?`,
      onOk: async (close) => {
        const res = await reqDelSubject({ id: values.id });
        if (res.code === 200) {
          close();
          fetchSubjectList();
          message.success("删除学科成功");
        } else {
          message.error(res.message);
        }
      },
    });
  };

  // 课程类型
  const courseTypeColumns: TableColumnsType<CourseTypeListRes> = [
    {
      title: "序号",
      align: "center",
      render: (_, record, index) => index + 1,
    },
    {
      title: "课程类型",
      align: "center",
      dataIndex: "courseTypeName",
    },
    {
      title: "操作",
      align: "center",
      render(_, record) {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                editCourseTypeRef.current?.courseTypeForm.setFieldsValue({
                  id: record.id,
                  courseTypeName: record.courseTypeName,
                });
                editCourseTypeRef.current?.setShow(true);
              }}>
              编辑
            </Button>
            <Button type="text" danger onClick={() => delCourseType(record)}>
              删除
            </Button>
          </>
        );
      },
    },
  ];
  const [courseTypeLoading, setCourseTypeLoading] = useState(false);
  const [courseTypeList, setCourseTypeList] = useState<CourseTypeListRes[]>([]);
  const fetchCourseTypeList = async () => {
    setCourseTypeLoading(true);
    const res = await reqCourseTypeList();
    if (res.code === 200) {
      setCourseTypeList(res.data);
    } else {
      message.error(res.message);
    }
    setCourseTypeLoading(false);
  };
  const addCourseTypeRef = useRef<CourseTypeModalRef>(null);
  const editCourseTypeRef = useRef<CourseTypeModalRef>(null);
  const delCourseType = async (values: CourseTypeListRes) => {
    Modal.confirm({
      title: "提示",
      content: `确定删除【${values.courseTypeName}】课程类型吗?`,
      onOk: async (close) => {
        const res = await reqDelCourseType({ id: values.id });
        if (res.code === 200) {
          close();
          fetchCourseTypeList();
          message.success("删除课程类型成功");
        } else {
          message.error(res.message);
        }
      },
    });
  };

  // 教材版本
  const textbookColumns: TableColumnsType<TextbookVersionListRes> = [
    {
      title: "序号",
      align: "center",
      render: (_, record, index) => index + 1,
    },
    {
      title: "教材版本",
      align: "center",
      dataIndex: "versionName",
    },
    {
      title: "操作",
      align: "center",
      render(_, record) {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                editTextbookRef.current?.setShow(true);
                editTextbookRef.current?.textbookVersionForm.setFieldsValue({
                  id: record.id,
                  versionName: record.versionName,
                });
              }}>
              编辑
            </Button>
            <Button type="text" danger onClick={() => delTextbook(record)}>
              删除
            </Button>
          </>
        );
      },
    },
  ];
  const [textbookLoading, setTextbookLoading] = useState(false);
  const [textbookVersionList, setTextbookVersionList] = useState<TextbookVersionListRes[]>([]);
  const fetchTextbookList = async () => {
    setTextbookLoading(true);
    const res = await reqTextbookVersionList({ current: 1, size: 10000, data: {} });
    if (res.code === 200) {
      setTextbookVersionList(res.data.data);
    } else {
      message.error(res.message);
    }
    setTextbookLoading(false);
  };
  const addTextbookRef = useRef<TextbookVersionModalRef>(null);
  const editTextbookRef = useRef<TextbookVersionModalRef>(null);
  const delTextbook = async (values: TextbookVersionListRes) => {
    Modal.confirm({
      title: "提示",
      content: `确定删除【${values.versionName}】教材版本吗?`,
      onOk: async (close) => {
        const res = await reqDelTextbookVersion({ id: values.id });
        if (res.code === 200) {
          close();
          fetchTextbookList();
          message.success("删除教材版本成功");
        } else {
          message.error(res.message);
        }
      },
    });
  };

  const tabList: TabsProps["items"] = [
    {
      key: "subject",
      label: "学科设置",
      children: (
        <div className="table-list">
          <Button
            type="primary"
            style={{ marginBottom: 20 }}
            onClick={() => {
              addSubjectRef.current?.setShow(true);
            }}>
            新增学科
          </Button>
          <Table
            loading={subjectLoading}
            dataSource={subjectList}
            columns={subjectColumns}
            pagination={false}
            rowKey={(record) => record.id}
          />
        </div>
      ),
    },
    {
      key: "courseType",
      label: "课程类型设置",
      children: (
        <div className="table-list">
          <Button
            type="primary"
            style={{ marginBottom: 20 }}
            onClick={() => {
              addCourseTypeRef.current?.setShow(true);
            }}>
            新增课程类型
          </Button>
          <Table
            loading={courseTypeLoading}
            dataSource={courseTypeList}
            columns={courseTypeColumns}
            pagination={false}
            rowKey={(record) => record.id}
          />
        </div>
      ),
    },
    {
      key: "textbook",
      label: "教材版本",
      children: (
        <div className="table-list">
          <Button
            type="primary"
            style={{ marginBottom: 20 }}
            onClick={() => {
              addTextbookRef.current?.setShow(true);
            }}>
            新增教材版本
          </Button>
          <Table
            loading={textbookLoading}
            dataSource={textbookVersionList}
            columns={textbookColumns}
            pagination={false}
            rowKey={(record) => record.id}
          />
        </div>
      ),
    },
  ];
  useEffect(() => {
    fetchSubjectList();
    fetchCourseTypeList();
    fetchTextbookList();
  }, []);
  return (
    <div className={styles["root"]}>
      <Tabs items={tabList} className="tabs-box" />
      <SubjectModal ref={addSubjectRef} title="新增学科" callback={fetchSubjectList} />
      <SubjectModal ref={editSubjectRef} title="编辑学科" callback={fetchSubjectList} />
      <CourseTypeModal ref={addCourseTypeRef} title="新增课程类型" callback={fetchCourseTypeList} />
      <CourseTypeModal
        ref={editCourseTypeRef}
        title="编辑课程类型"
        callback={fetchCourseTypeList}
      />
      <TextbookVersionModal
        ref={addTextbookRef}
        title="新增教材版本"
        callback={fetchTextbookList}
      />
      <TextbookVersionModal
        ref={editTextbookRef}
        title="编辑教材版本"
        callback={fetchTextbookList}
      />
    </div>
  );
};

export default SubjectManage;
