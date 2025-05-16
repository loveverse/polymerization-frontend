import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  DrawerProps,
  message,
  Drawer,
  Tree,
  Space,
  Button,
  Upload,
  UploadProps,
  GetRef,
  Input,
  Switch,
  Dropdown,
} from "antd";
import {
  reqAddOrUpdateChaterNode,
  reqDelChatperNode,
  reqTextbookTree,
  reqUploadChapter,
} from "@/api/course/course/textbook";
import { AddOrUpdateChapterNode, ChapterTreeRes } from "@/api/course/course/textbook/types";
import { SpinLoading } from "@/components";
import styles from "./index.module.scss";
import { addItemAfterId, downloadFile } from "@/utils/common";
import { produce } from "immer";

import { DownOutlined, DownloadOutlined, ImportOutlined } from "@ant-design/icons";
import { reqDownloadExcel } from "@/api/base";

export interface CatalogueChildProps extends DrawerProps {
  textbookId: string;
}
type InputRef = GetRef<typeof Input>;

type UpdateChapterStatus = Pick<AddOrUpdateChapterNode, "id" | "disabled">;

const CatalogueTreeDrawer = forwardRef<ChildRef, CatalogueChildProps>(function Child(props, ref) {
  useImperativeHandle(
    ref,
    () => {
      return {
        setShow,
        setConfirmLoading,
      };
    },
    []
  );
  const { textbookId, ...modalProps } = props;

  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [textbookTree, setTextbookTree] = useState<ChapterTreeRes[]>([]);
  const [loading, setLoading] = useState(false);
  const getChapterTree = async () => {
    setLoading(true);
    const res = await reqTextbookTree({ textbookId });
    if (res.code === 200) {
      setTextbookTree(res.data);
    } else {
      message.error(res.message);
    }
    setLoading(false);
  };
  // 导入教材
  const uploadChapter = async (file: FormData) => {
    setLoading(true);
    const res = await reqUploadChapter(file);
    if (res.code === 200) {
      getChapterTree();
      message.success("上传章节成功");
    } else {
      message.error(res.message);
    }
    setLoading(false);
  };
  const uploadProps: UploadProps = {
    accept: ".xls,.xlsx",
    fileList: [],
    customRequest(options) {
      const formData = new FormData();
      formData.append("file", options.file);
      formData.append("textbookId", textbookId);
      uploadChapter(formData);
    },
  };
  // 下载导入模板
  const downloadExcel = async () => {
    const res: any = await reqDownloadExcel({ key: "chapter" });
    downloadFile(res, "章节导入模板.xlsx");
  };

  const nodeRef = useRef<InputRef>(null);
  const [nodeInfo, setNodeInfo] = useState<AddOrUpdateChapterNode>({
    pid: "",
    disabled: 0, // 默认开启
    orderValue: 0,
    chapterName: "",
    textbookId,
  });
  const handleClick = (clickedNode: ChapterTreeRes, type: string) => {
    const addSibling = addItemAfterId(textbookTree, clickedNode.id, type);
    setTextbookTree([...addSibling]);
  };
  const addChapterNode = async (values: AddOrUpdateChapterNode) => {
    const res = await reqAddOrUpdateChaterNode({ ...values, textbookId });
    if (res.code === 200) {
      getChapterTree();
    } else {
      message.error(res.message);
    }
  };
  const updateChapterNode = async (values: UpdateChapterStatus) => {
    const res = await reqAddOrUpdateChaterNode({ ...values, textbookId } as AddOrUpdateChapterNode);
    if (res.code === 200) {
      getChapterTree();
    } else {
      message.error(res.message);
    }
  };
  const delChapterNode = async (id: string) => {
    const res = await reqDelChatperNode({ id });
    if (res.code === 200) {
      getChapterTree();
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    if (show) {
      getChapterTree();
    } else {
      setTextbookTree([]);
    }
  }, [show]);

  return (
    <Drawer
      {...modalProps}
      open={show}
      width={700}
      onClose={() => setShow(false)}
      rootClassName={styles["add-chapter-drawer"]}>
      <Space style={{ marginBottom: 20 }}>
        <Button
          type="primary"
          onClick={() => {
            setNodeInfo({
              ...nodeInfo,
              chapterName: "",
              pid: "0",
              orderValue: textbookTree.length,
            });
            setTextbookTree(
              produce((prev) => {
                prev.push({
                  id: "",
                  flag: true,
                  children: [],
                } as any);
              })
            );
          }}>
          添加目录
        </Button>
        <Dropdown
          menu={{
            items: [
              {
                key: "download",
                label: (
                  <Space size={5}>
                    <DownloadOutlined />
                    下载导入模板
                  </Space>
                ),
                onClick: downloadExcel,
              },
              {
                key: "import",
                label: (
                  <Upload {...uploadProps}>
                    <Space size={5}>
                      <ImportOutlined />
                      批量导入目录
                    </Space>
                  </Upload>
                ),
              },
            ],
          }}>
          <Button type="primary">
            <Upload {...uploadProps}>
              <Space style={{ color: "#fff" }}>
                批量导入目录
                <DownOutlined />
              </Space>
            </Upload>
          </Button>
        </Dropdown>
      </Space>
      {loading ? (
        <SpinLoading spinning={loading} hasData={textbookTree.length} />
      ) : (
        <Tree
          treeData={textbookTree}
          defaultExpandAll
          fieldNames={{ key: "id", title: "chapterName" }}
          blockNode
          className="chapter-tree"
          titleRender={(nodeData) =>
            nodeData.flag ? (
              <Input
                value={nodeInfo.chapterName}
                placeholder="新建章节目录"
                ref={nodeRef}
                autoFocus
                onChange={({ target: { value } }) => {
                  setNodeInfo({
                    ...nodeInfo,
                    chapterName: value,
                  });
                }}
                onBlur={() => {
                  if (!nodeInfo.chapterName) {
                    return;
                  }
                  nodeInfo.id ? updateChapterNode(nodeInfo) : addChapterNode(nodeInfo);
                }}
                onKeyDown={({ code }) => {
                  if (!nodeInfo.chapterName) {
                    return;
                  }

                  if (code === "Enter") {
                    nodeInfo.id ? updateChapterNode(nodeInfo) : addChapterNode(nodeInfo);
                  }
                }}
              />
            ) : (
              <div className="role-box" title={nodeData.chapterName}>
                <span className="role-title text-ellipsis">{nodeData.chapterName}</span>
                <div className="btn-group">
                  <Button
                    type="link"
                    onClick={() => {
                      setNodeInfo({
                        ...nodeInfo,
                        chapterName: "",
                        pid: nodeData.pid,
                        orderValue: nodeData.orderValue + 1,
                      });
                      handleClick(nodeData, "same");
                      setTimeout(() => {
                        nodeRef.current?.focus();
                      }, 0);
                    }}>
                    添加同级目录
                  </Button>
                  <Button
                    type="link"
                    onClick={() => {
                      const len = nodeData.children ? nodeData.children.length - 1 : 0;
                      const num = nodeData.children ? nodeData.children[len].orderValue : 0;
                      setNodeInfo({
                        ...nodeInfo,
                        chapterName: "",
                        pid: nodeData.id,
                        orderValue: num,
                      });
                      handleClick(nodeData, "sub");
                      setTimeout(() => {
                        nodeRef.current?.focus();
                      }, 0);
                    }}>
                    添加子级目录
                  </Button>
                  <Button
                    type="link"
                    onClick={() => {
                      setNodeInfo({
                        ...nodeInfo,
                        chapterName: nodeData.chapterName,
                        pid: nodeData.pid,
                        orderValue: nodeData.orderValue,
                        id: nodeData.id,
                      });
                      handleClick(nodeData, "edit");
                      setTimeout(() => {
                        nodeRef.current?.focus();
                      }, 0);
                    }}>
                    编辑
                  </Button>
                  <Button
                    type="text"
                    danger
                    onClick={() => {
                      delChapterNode(nodeData.id);
                    }}>
                    删除
                  </Button>
                  <Switch
                    value={!nodeData.disabled}
                    unCheckedChildren="停用"
                    checkedChildren="开启"
                    size="small"
                    onChange={(value) => {
                      updateChapterNode({
                        id: nodeData.id,
                        disabled: Number(!value),
                      });
                    }}
                  />
                </div>
              </div>
            )
          }></Tree>
      )}
    </Drawer>
  );
});
export default CatalogueTreeDrawer;
