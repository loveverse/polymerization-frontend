import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  ModalProps,
  Popover,
  Select,
  Upload,
  Typography,
  Space,
  UploadProps,
  message,
  Row,
  Col,
  Tree,
  TreeProps,
  FormInstance,
  TreeNodeProps,
  TreeSelect,
} from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

import { ChapterTreeRes } from "@/api/base/types";
import { reqChapterTree, reqUploadFile } from "@/api/base";

import { useAppContext } from "@/context";
import { findFileType, findTreeListById } from "@/utils/common";
import styles from "./index.module.scss";
import { Store, useIds } from "@/store";
import { reqKnowledgeOrChapterTreeNoLevel } from "@/api/resource/question";

const { Link } = Typography;

interface UploadReourceChildProps extends ChildProps, ModalProps {
  nodeInfo: Store["ids"]["node"];
}

export interface UploadResourceChildRef extends ChildRef {
  resourceForm: FormInstance;
  setTreeData: React.Dispatch<React.SetStateAction<ChapterTreeRes[]>>;
}

const UploadResourceModal = forwardRef<UploadResourceChildRef, UploadReourceChildProps>(
  function Child(props, ref) {
    useImperativeHandle(
      ref,
      () => {
        return {
          setShow,
          setConfirmLoading,
          resourceForm,
          setTreeData,
        };
      },
      []
    );

    const { handleSubmit, nodeInfo, ...modalProps } = props;
    const [show, setShow] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { dicts } = useAppContext();

    const [resourceForm] = Form.useForm();
    const fileList = Form.useWatch("files", resourceForm);
    const { ids } = useIds();
    const normFile = (e: any) => {
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList;
    };

    const uploadProps: UploadProps = {
      accept: "audio/*,video/*,image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx",
      maxCount: 1,
      onRemove: (file) => {
        const files = uploadProps.fileList?.filter((item) => item.uid !== file.uid);
        resourceForm.setFieldValue("files", files);
        setTypeDisabled(false);
      },
      beforeUpload: (file) => {
        const fileSize = file.size / 1024 / 1024;
        if (fileSize > 200) {
          message.warning("上传的文件大于200M，请重新上传！");
          return false;
        }

        // 还需要判断文件后缀类型,使用file-type检测防止修改后缀----------------------
        return true;
      },
      customRequest: (options) => {
        const formData = new FormData();
        formData.append("file", options.file);
        reqUploadFile(formData)
          .then((res) => {
            if (res.code === 200) {
              resourceForm.setFieldValue("multimediaName", res.data.name);
              const resourceType = findFileType(res.data.name);
              if (resourceType === "wk" || resourceType === "yp") {
                setTypeDisabled(true);
              } else {
                setTypeDisabled(false);
              }
              resourceForm.setFieldValue("multimediaType", resourceType);
              options.onSuccess?.(res.data);
              message.success("上传文件成功");
            } else {
              options.onError?.(new Error());
              message.error("上传文件失败");
            }
          })
          .catch((error) => {
            console.error(error);
            message.error("上传文件失败");
          });
      },
    };

    const [treeData, setTreeData] = useState<ChapterTreeRes[]>([]);
    const [defaultSelect, setDefaultSelect] = useState<string[]>([]);
    const [defaultExpanded, setDefaultExpanded] = useState<string[]>([]);
    const [typeDisabled, setTypeDisabled] = useState(false);
    // 暂未解决回显问题
    const handleToAdd = () => {
      if (nodeInfo) {
        setDefaultSelect([nodeInfo.nodeId]);
        resourceForm.setFieldValue("chapterId", nodeInfo.chapterId);
        const arr = findTreeListById(
          treeData,
          nodeInfo.nodeId as string,
          "nodeId",
          [],
          "nodePid",
          treeData
        );
        if (arr && arr.length != 0) {
          const label = arr.map((x: any) => x.nodeName).join("/");
          setDefaultExpanded(arr.map((x: any) => x.nodeId));
          resourceForm.setFieldValue("chapterName", label);
        }
      }
    };
    const onSelect: TreeProps<ChapterTreeRes>["onSelect"] = (_, { node }) => {
      if (nodeInfo) {
        const arr = findTreeListById(
          treeData,
          node.nodeId as string,
          "nodeId",
          [],
          "nodePid",
          treeData
        );
        if (arr && arr.length != 0) {
          const label = arr.map((x: any) => x.nodeName).join("/");
          resourceForm.setFieldValue("chapterName", label);
        }
      }
      resourceForm.setFieldValue("chapterId", node.chapterId);
      setDefaultSelect([node.nodeId]);
    };
    const [loading, setLoading] = useState(false);
    const getKnowledgeOrChapterTree = async () => {
      setLoading(true);
      const res = await reqChapterTree({
        courseId: ids.course.courseId,
        gradeId: ids.textbook.gradeId,
        textbookId: ids.textbook.textbookId,
        periodId: ids.course.periodId,
        countType: "2",
      });
      if (res.code === 200) {
        setTreeData(res.data);
      } else {
        message.error(res.message);
      }
      setLoading(false);
    };
    useEffect(() => {
      if (show) {
        getKnowledgeOrChapterTree();
        const resourceType = resourceForm.getFieldValue("multimediaType");
        if (resourceType === "wk" || resourceType === "yp") {
          setTypeDisabled(true);
        } else {
          setTypeDisabled(false);
        }
      }
    }, [show]);

    return (
      <Modal
        {...modalProps}
        open={show}
        width={560}
        rootClassName={styles["upload-resource-wrapper"]}
        confirmLoading={confirmLoading}
        onCancel={() => setShow(false)}
        onOk={() => {
          resourceForm.validateFields().then((values) => {
            const { files, ...rest } = values;
            const params: any = {
              fileSize: files[0].size,
              fileName: files[0].id ? files[0].name : files[0].response.name,
              fileUrl: files[0].id ? files[0].url : files[0].response.url,
              ...rest,
            };
            handleSubmit(params);
          });
        }}>
        {/* <Row className="upload-container"> */}
        {/* <Col span={15}> */}
        <Form
          form={resourceForm}
          labelCol={{ span: 6 }}
          labelAlign="left"
          autoComplete="off"
          initialValues={{ files: [] }}>
          <Form.Item hidden name="id">
            <div></div>
          </Form.Item>
          <Form.Item name="chapterId" hidden>
            <div></div>
          </Form.Item>
          <Form.Item
            name="chapterId"
            label="关联章节"
            rules={[{ required: true, message: "请选择关联章节" }]}>
            <TreeSelect
              loading={loading}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              placeholder="请选择章节"
              fieldNames={{
                label: "nodeName",
                value: "chapterId",
                children: "children",
              }}
              treeDefaultExpandAll
              treeData={treeData}
            />
          </Form.Item>
          <Form.Item label="上传文件" required>
            <Form.Item
              valuePropName="fileList"
              name="files"
              getValueFromEvent={normFile}
              noStyle
              rules={[
                { required: true, message: "", type: "array" },
                () => ({
                  validator(rule, value, callback) {
                    console.log(value);

                    if (!value.length || !value.every((item: any) => item.response || item.id)) {
                      return Promise.reject(new Error("请至少上传一个文件"));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}>
              <Upload {...uploadProps}>
                <Button type="primary">上传文件</Button>
              </Upload>
            </Form.Item>
            {!fileList || !fileList.length ? (
              <div className="file-tooltip">
                最多添加1个不超过200M的附件，支持常用
                <Popover
                  placement="bottomLeft"
                  rootClassName={styles["file-type-popover"]}
                  content={
                    <Space direction="vertical" className="file-type-list">
                      <span>
                        图片类：<em>jpg、png、gif等</em>
                      </span>
                      <span>
                        课件类：<em>pdf、doc、ppt、xls等</em>
                      </span>
                      <span>
                        教案类：<em>pdf、doc、ppt、xls等</em>
                      </span>
                      <span>
                        微课类：<em>mp4、mov、wmv 等</em>
                      </span>
                      <span>
                        音频类：<em>mp3、wav、aac 等</em>
                      </span>
                    </Space>
                  }>
                  <Link>&ensp;文件格式</Link>
                </Popover>
              </div>
            ) : null}
          </Form.Item>
          <Form.Item label="资源名称" name="multimediaName" rules={[{ required: true }]}>
            <Input placeholder="请输入资源名称" maxLength={255} disabled />
          </Form.Item>
          <Form.Item label="资源类型" name="multimediaType" rules={[{ required: true }]}>
            <Select
              disabled={typeDisabled}
              options={
                typeDisabled
                  ? dicts.getDict("multimedia_type")
                  : fileList && fileList.length
                  ? dicts.getDict("multimedia_type").slice(0, 2)
                  : dicts.getDict("multimedia_type")
              }
              placeholder="请选择资源类型"></Select>
          </Form.Item>
        </Form>
        {/* </Col> */}
        {/* <Col span={9} className="chapter-tree-box">
            {treeData.length ? (
              <Tree
                defaultExpandAll={false}
                defaultExpandedKeys={defaultExpanded}
                selectedKeys={defaultSelect}
                treeData={treeData}
                blockNode
                showLine
                switcherIcon={(props: TreeNodeProps) => {
                  return props.expanded ? <MinusOutlined /> : <PlusOutlined />;
                }}
                fieldNames={{
                  title: "nodeName",
                  key: "nodeId",
                  children: "children",
                }}
                onSelect={onSelect}
              />
            ) : null}
          </Col> */}
        {/* </Row> */}
      </Modal>
    );
  }
);

export default UploadResourceModal;
