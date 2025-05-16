import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Form, List, message, Modal, Space } from "antd";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { convertorFileSize, downloadFile, findFileLogo } from "@/utils/common";
import { PAGE_CURRENT, PAGE_SIZE } from "@/utils/constant";
import {
  reqAddDownloadNumber,
  reqDelResource,
  reqEditResource,
  reqMultimediaPage,
  reqUploadResource,
} from "@/api/resource";
import {
  EditResourceReq,
  MultimediaPageReq,
  MultimediaPageRes,
  UploadResourceReq,
} from "@/api/resource/types";

import { useAppContext } from "@/context";
import { ComGradeTree, ComEmpty, ComRadio, PreviewFile, FileInfo } from "@/components";
import UploadResourceModal, { UploadResourceChildRef } from "./UploadResourceModal";
import styles from "./index.module.scss";
import { ChildTreeRef } from "@/components/ComGradeTree";
import { Store, useIds } from "@/store";

export const multimediaType: Record<string, string> = {
  kj: "#549BF8",
  ja: "#FF795E",
  wk: "#34D044",
  yp: "#08C4BD",
};
const option = {
  value: "",
  label: "不限",
};

const Courseware = () => {
  const { dicts } = useAppContext();
  const { ids } = useIds();
  const [multimediaData, setMultimediaData] = useState<PageRes<MultimediaPageRes>>({
    page: PAGE_CURRENT,
    size: PAGE_SIZE,
    data: [],
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [nodeInfo, setNodeInfo] = useState<Store["ids"]["node"] | null>(null);
  const [filterForm] = Form.useForm();
  const getMultimediaPage = async (page = PAGE_CURRENT, size = PAGE_SIZE) => {
    if (!nodeInfo || !nodeInfo.nodeId) {
      setMultimediaData({
        page: PAGE_CURRENT,
        size: PAGE_SIZE,
        data: [],
        total: 0,
      });
      return;
    }
    setLoading(true);
    const values = filterForm.getFieldsValue();
    const params: MultimediaPageReq = {
      current: page,
      size: size,
      data: {
        courseId: ids.course.courseId,
        gradeId: ids.textbook.gradeId,
        chapterId: nodeInfo.chapterId,
        ...values,
      },
    };
    const res = await reqMultimediaPage(params);
    if (res.code == 200) {
      const { current, ...rest } = res.data;
      setMultimediaData({ ...rest, page: current as number });
    } else {
      message.error(res.message);
    }
    setLoading(false);
  };

  // ---------------------------已选章节暂未回显
  const handleEditResource = (info: MultimediaPageRes) => {
    editResourceRef.current?.setShow(true);
    // if (chapterTreeRef.current?.innerTreeData) {
    //   editResourceRef.current?.setTreeData(chapterTreeRef.current?.innerTreeData());
    // }
    editResourceRef.current?.resourceForm.setFieldsValue({
      id: info.id,
      files: [{ url: info.fileUrl, name: info.fileName, size: info.fileSize, id: info.id }],
      multimediaName: info.multimediaName,
      multimediaType: info.multimediaType,
      chapterId: info.chapterId,
    });
  };
  const editResourceRef = useRef<UploadResourceChildRef>(null);
  const editResource = async (values: EditResourceReq) => {
    editResourceRef.current?.setConfirmLoading(true);
    const res = await reqEditResource(values);
    if (res.code === 200) {
      message.success("编辑资源成功");
      editResourceRef.current?.setShow(false);
      editResourceRef.current?.resourceForm.resetFields();
      getMultimediaPage(multimediaData.page, multimediaData.size);
    } else {
      message.error(res.message);
    }
    editResourceRef.current?.setConfirmLoading(false);
  };

  const uploadResourceRef = useRef<UploadResourceChildRef>(null);
  const uploadResource = async (values: UploadResourceReq) => {
    uploadResourceRef.current?.setConfirmLoading(true);
    const restParams = {
      gradeId: ids.textbook.gradeId,
      courseId: ids.course.courseId,
    };
    const params = Object.assign(values, restParams);
    const res = await reqUploadResource(params);
    if (res.code === 200) {
      message.success("上传资源成功");
      uploadResourceRef.current?.setShow(false);
      uploadResourceRef.current?.resourceForm.resetFields();
      getMultimediaPage();
    } else {
      message.error(res.message);
    }
    uploadResourceRef.current?.setConfirmLoading(false);
  };

  /**
   * 删除
   * @param id
   */
  const delResource = (values: MultimediaPageRes) => {
    Modal.confirm({
      title: "提示",
      content: `确定删除【${values.multimediaName}】吗？`,
      closable: true,
      onOk: async (close) => {
        const res = await reqDelResource({ id: values.id });
        if (res.code == 200) {
          message.success("删除成功");
          getMultimediaPage(multimediaData.page, multimediaData.size);
          close();
        } else {
          message.error(res.message);
        }
      },
    });
  };
  const chapterTreeRef = useRef<ChildTreeRef>(null);

  // 预览
  const [previewShow, setPreviewShow] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  useEffect(() => {
    getMultimediaPage();
  }, [nodeInfo?.chapterId, nodeInfo?.nodeId]);

  return (
    <div className={styles.root}>
      <ComGradeTree ref={chapterTreeRef} countType="3" callPage={setNodeInfo} />
      <div className="multimedia-right">
        <div className="filter-header">
          <Form
            form={filterForm}
            autoComplete="off"
            labelAlign="left"
            className="category-container"
            initialValues={{
              multimediaType: "",
              resourceStatus: "",
            }}
            onValuesChange={() => getMultimediaPage()}>
            <Form.Item label="类型" name="multimediaType">
              <ComRadio options={[option, ...dicts.getDict("multimedia_type")]} />
            </Form.Item>
          </Form>
          <Button
            type="primary"
            onClick={() => {
              uploadResourceRef.current?.setShow(true);
              if (chapterTreeRef.current?.innerTreeData) {
                uploadResourceRef.current?.setTreeData(chapterTreeRef.current?.innerTreeData());
              }
            }}>
            新增课件
          </Button>
        </div>
        <List
          itemLayout="vertical"
          dataSource={multimediaData.data}
          loading={loading}
          split={false}
          className="resource-list-container"
          locale={{ emptyText: <ComEmpty description="暂无资源" /> }}
          pagination={{
            simple: true,
            hideOnSinglePage: !multimediaData.total,
            showTotal: () => {
              return (
                <span>
                  共 <b className="num">{multimediaData.total}</b> 份资源
                </span>
              );
            },
            itemRender: (_, type) => {
              if (type === "prev") {
                return <LeftCircleOutlined />;
              }
              if (type === "next") {
                return <RightCircleOutlined />;
              }
            },
            current: multimediaData.page,
            pageSize: multimediaData.size,
            total: multimediaData.total,
            onChange: (page, pageSize) => {
              getMultimediaPage(page, pageSize);
            },
          }}
          renderItem={(item) => (
            <List.Item>
              <Card className="resource-card" hoverable>
                <div className="multimedia-content">
                  <div
                    className="top-tag"
                    style={{ borderLeftColor: multimediaType[item.multimediaType] + "33" }}>
                    <div
                      className="multimedia-type"
                      style={{ color: multimediaType[item.multimediaType] }}>
                      {dicts.getLabel("multimedia_type", item.multimediaType)}
                    </div>
                  </div>
                  <div className="multimedia-item-title">
                    <img src={findFileLogo(item.fileName)} alt="" />
                    <span>{item.multimediaName}</span>
                  </div>
                </div>
                <div className="list-item-footer">
                  <Space size={20} className="multimedia-info">
                    <span>
                      大小：<b>{convertorFileSize(item.fileSize)}</b>
                    </span>
                    <span>
                      引用：<b>{item.useNumber}</b>
                    </span>
                    <span>
                      下载：<b>{item.downloadNumber}</b>
                    </span>
                  </Space>

                  <div className="multimedia-operation">
                    <Button
                      type="link"
                      onClick={() => {
                        downloadFile(item.fileUrl, item.fileName);
                        reqAddDownloadNumber({ id: item.id }).then(() => {
                          getMultimediaPage(multimediaData.page, multimediaData.size);
                        });
                      }}>
                      下载
                    </Button>
                    <Button
                      type="link"
                      onClick={() => {
                        setPreviewShow(true);
                        setFileInfo({ fileUrl: item.fileUrl, fileName: item.fileName });
                      }}>
                      预览
                    </Button>

                    <Button
                      type="link"
                      onClick={() => {
                        handleEditResource(item);
                      }}>
                      编辑
                    </Button>
                    <Button type="link" danger onClick={() => delResource(item)}>
                      删除
                    </Button>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}></List>
      </div>
      <UploadResourceModal
        ref={uploadResourceRef}
        title="上传资源"
        handleSubmit={uploadResource}
        nodeInfo={nodeInfo as Store["ids"]["node"]}
      />
      <UploadResourceModal
        ref={editResourceRef}
        title="编辑资源"
        handleSubmit={editResource}
        nodeInfo={nodeInfo as Store["ids"]["node"]}
      />
      <PreviewFile open={previewShow} file={fileInfo} onCancel={() => setPreviewShow(false)} />
    </div>
  );
};
export default Courseware;
