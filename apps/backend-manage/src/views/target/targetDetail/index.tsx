import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import type { GetRef, InputRef } from "antd";
import styles from "./index.module.scss";
import { Button, Form, Input, Upload, Table, Switch, message, Modal, Space } from "antd";

import { useLocation } from "react-router-dom";

import word from "@/assets/imgs/fileLogo/word.png";

import { getLibraryId, getUpdateLibrary } from "@/api/target";
import reEmpty from "@/assets/imgs/empty.png";
import { reqDownloadExcel } from "@/api/base";
import { downloadFile } from "@/utils/common";
type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key?: string;
  level: string;
  content: string;
  enabled: boolean;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}
const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing && !record.content) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  }, [editing, record?.content]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      handleSave({ ...record, ...values });
      setEditing(false); // 保存成功后手动更新编辑状态
    } catch (errInfo) {}
  };

  let childNode = children;

  if (editable) {
    childNode =
      editing || !record.content ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title}不能为空`,
            },
          ]}>
          <Input ref={inputRef} showCount maxLength={100} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
          {children}
        </div>
      );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key?: React.Key;
  level: string;
  content: string;
  enabled: boolean;
  children?: DataType[];
  id?: string;
  pid?: string;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const MoraAdded: React.FC = () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isModalClear, setIsModalClear] = useState(false);
  const [isKey, setIsKey] = useState("");
  const [isEdit, setisEdit] = useState(false);
  const [isText, setIsText] = useState("");
  const [count, setCount] = useState(1);
  const [filed, setfiled] = useState(null);
  const [numerical, setNumerical] = useState(Number);
  const [isNumber, setIsNumber] = useState(false);
  const [expandedRows, setExpandedRows] = useState<React.Key[]>([]);

  const handleExpand = (record: any, arr: any) => {
    const isExpanded = arr == "1" ? false : expandedRows.includes(record.key);
    const newExpandedRows = isExpanded
      ? expandedRows.filter((key) => key !== record.key)
      : [...expandedRows, record.key];
    setExpandedRows(newExpandedRows);
  };
  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: "指标等级",
      // align: 'center',
      dataIndex: "level",
      width: "15%",
      render: (level: string) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* <CaretDownFilled />  */}
          <div
            style={{
              width: "90px",
              height: "28px",
              borderRadius: 81,
              border: "1px solid #4187FF",
              color: "#4187FF",
              textAlign: "center",
              lineHeight: "28px",
              marginLeft: "8px",
              marginTop: "-2px",
            }}>
            {level}
          </div>
        </div>
      ),
    },
    {
      title: "指标内容",
      align: "center",
      dataIndex: "content",
      editable: true,
      width: "400px",
    },
    {
      title: "应用状态",
      align: "center",
      dataIndex: "enabled",
      render: (enabled: boolean, record: any) => (
        <Switch
          checkedChildren="开启"
          unCheckedChildren="关闭"
          checked={enabled}
          onChange={(checked) => {
            handleParentStatusChange(record as DataType, checked);
            // 其他逻辑处理
          }}
        />
      ),
    },
    {
      title: "操作",
      align: "center",
      dataIndex: "operation",
      render: (_, record: any) => (
        <>
          <Button
            type="link"
            onClick={() => {
              handleEdit(record.key, record.content);
            }}>
            编辑
          </Button>
          {record.level !== "三级指标" && (
            <Button
              type="link"
              onClick={() => {
                handleSubset(record.key, record.level, record.enabled, record);
              }}>
              添加子级
            </Button>
          )}
          <Button
            type="link"
            onClick={() => {
              handleSameLevel(record.key, record.level);
            }}>
            添加同级
          </Button>
          <Button
            type="link"
            danger
            onClick={() => {
              handleDeletes(record.key, record.level);
            }}>
            删除
          </Button>
        </>
      ),
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: generateUniqueKey(),
      level: `一级指标`,
      content: "",
      enabled: true,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };
  //
  const replaceObjectByKey = (dataSource: DataType[], node: DataType): DataType[] => {
    return dataSource.map((item) => {
      // 如果当前对象的 key 与新对象的 key 相同，则返回新对象，否则返回当前对象
      return item.key === node.key ? node : item;
    });
  };
  // 查找父级节点
  const findParentNodes = (data: DataType[], node: DataType): DataType | undefined => {
    for (const item of data) {
      if (item.children) {
        if (item.children.includes(node)) {
          return item;
        } else {
          const parent = findParentNodes(item.children, node);
          if (parent) {
            return parent;
          }
        }
      }
    }
    return undefined;
  };

  const handleParentStatusChange = (node: DataType, checked: boolean) => {
    if (checked) {
      const parentNode = findParentNodes(dataSource, node);
      if (!parentNode || parentNode.enabled) {
        // 开启当前节点
        node.enabled = checked;
        // 递归遍历子节点并更新状态
        const updateChildStatus = (children: DataType[] | undefined, parentChecked: boolean) => {
          if (children) {
            for (const child of children) {
              // 将子节点状态设置为与父节点一致
              child.enabled = parentChecked;
              // 递归调用更新子节点的子节点
              updateChildStatus(child.children, parentChecked);
            }
          }
        };
        updateChildStatus(node.children, checked);
        const newDataSource = replaceObjectByKey(dataSource, node);

        setDataSource(newDataSource);
      } else {
        // 如果不满足条件，则不允许开启当前节点
        // 这里可以添加相应的提示或者其他处理逻辑
        message.warning("不能开启当前指标，因为上级指标为关闭状态");
      }
    } else {
      node.enabled = checked;
      // 递归遍历子节点并更新状态
      const updateChildStatus = (children: DataType[] | undefined, parentChecked: boolean) => {
        if (children) {
          for (const child of children) {
            // 将子节点状态设置为与父节点一致
            child.enabled = parentChecked;
            // 递归调用更新子节点的子节点
            updateChildStatus(child.children, parentChecked);
          }
        }
      };
      // 调用更新子节点状态的函数
      updateChildStatus(node.children, checked);
      const newDataSource = replaceObjectByKey(dataSource, node);
      setDataSource(newDataSource);
    }
    // 更新当前节点状态
  };

  //
  const handleSubset = (key: string, level: string, enabled: boolean, record: any) => {
    if (enabled) {
      const newNode: DataType = {
        key: generateUniqueKey(),
        level: level === "一级指标" ? "二级指标" : "三级指标",
        content: "",
        enabled: true,
        // children: [], // 初始化子节点数组
      };
      const foundNode = findNodeByKey(dataSource, key);
      if (foundNode) {
        if (foundNode.children) {
          foundNode.children.push(newNode);
        } else {
          foundNode.children = [newNode];
        }
      }
      setDataSource([...dataSource]);
    } else {
      message.warning("请先开启当前指标状态");
    }
    handleExpand(record, 1);
  };

  const handleCancelClear = () => {
    setIsModalClear(false);
  };
  // 定义根据节点的 key 找到对应的节点的函数
  function findNodeByKey(nodes: DataType[], key: string): DataType | undefined {
    for (const node of nodes) {
      if (node.key === key) {
        return node;
      }
      if (node.children) {
        const foundNode = findNodeByKey(node.children, key);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return undefined;
  }
  // 添加同级
  const handleSameLevel = (key: string, level: string) => {
    const parent = findParentNode(dataSource, key);
    if (parent && parent.enabled) {
      // 找到了父节点
      // const newKey = count;
      const newNode: DataType = {
        key: generateUniqueKey(),
        level: level,
        content: "",
        enabled: true,
      };
      if (parent.children) {
        // 如果父节点有 children，则直接添加新节点到 children 数组中
        parent.children.push(newNode);
      } else {
        // 如果父节点没有 children，则创建 children 数组并添加新节点
        parent.children = [newNode];
      }
      // 更新数据源和计数器
      setDataSource([...dataSource]);
      setCount(count + 1);
    } else if (parent && !parent.enabled) {
      message.warning("请先开启上级指标的状态");
    } else {
      // 没有找到父节点，即当前节点是最顶级节点
      const newNode: DataType = {
        key: generateUniqueKey(),
        level: level,
        content: "",
        enabled: true,
      };
      // 添加新的顶级节点到数据源中
      setDataSource([...dataSource, newNode]);
      setCount(count + 1);
    }
  };
  function findParentNode(nodes: DataType[], key: string, parent?: DataType): DataType | undefined {
    for (const node of nodes) {
      if (node.key === key) {
        return parent; // 如果当前节点就是要找的节点，直接返回其父节点
      }
      if (node.children) {
        const foundParent = findParentNode(node.children, key, node);
        if (foundParent) {
          return foundParent; // 如果在子节点中找到了目标节点，返回其父节点
        }
      }
    }
    return undefined; // 如果没有找到目标节点，返回 undefined
  }
  // 删除
  function findNodeAndParent(
    nodes: DataType[],
    key: string,
    parent?: DataType
  ): { node: DataType | undefined; parentNode: DataType | undefined } {
    for (const node of nodes) {
      if (node.key === key) {
        return { node, parentNode: parent }; // 如果当前节点就是要找的节点，返回当前节点和其父节点
      }
      if (node.children) {
        const { node: foundNode, parentNode: foundParentNode } = findNodeAndParent(
          node.children,
          key,
          node
        );
        if (foundNode) {
          return { node: foundNode, parentNode: foundParentNode }; // 如果在子节点中找到了目标节点，返回目标节点和其父节点
        }
      }
    }
    return { node: undefined, parentNode: undefined }; // 如果没有找到目标节点，返回 undefined
  }
  const handleDeletes = (key: string, level: string) => {
    setIsModalClear(true);
    setIsKey(key);
    setIsText(level);
  };
  const handleDelete = (key: string) => {
    const { node: nodeToDelete, parentNode: parent } = findNodeAndParent(dataSource, key);
    if (nodeToDelete && parent) {
      // 找到了要删除的节点和其父节点
      parent.children = parent.children?.filter((node) => node.key !== key); // 使用可选链操作符
      setDataSource([...dataSource]); // 更新数据源
    } else if (nodeToDelete) {
      // 要删除的节点是顶级节点
      setDataSource(dataSource.filter((node) => node.key !== key)); // 从数据源中移除顶级节点
    }
    setIsModalClear(false);
  };
  const findAndReplaceChild = (data: DataType[], key: React.Key, row: DataType): DataType[] => {
    return data.map((item) => {
      if (item.key === key) {
        // 找到了要替换的子元素，直接返回替换后的子元素
        return row;
      } else if (item.children) {
        // 在子元素中递归查找并替换
        return { ...item, children: findAndReplaceChild(item.children, key, row) };
      } else {
        // 没有子元素或者未找到要替换的子元素，直接返回原始子元素
        return item;
      }
    });
  };

  const handleSave = (row: DataType) => {
    const newData = findAndReplaceChild([...dataSource], row.key!, row);
    setDataSource(newData);
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  const convertNextToChildren = (array: any[]) => {
    return array.map((item) => {
      const { next, ...rest } = item; // 取出对象中的 next 属性并保存剩余属性到 rest 变量
      if (next && next.length > 0) {
        rest.children = convertNextToChildren(next); // 递归调用函数将 next 转换为 children
      }
      rest.key = generateUniqueKey();
      return rest; // 返回剩余属性，如果没有 next 属性则不包含 children
    });
  };
  const addLevelField = (arr: any[], level = "一级指标"): any[] => {
    return arr.map((item) => {
      // 创建一个新的对象，以避免直接修改传入的对象
      const newItem = { ...item };

      // 如果level字段不存在，设置它
      if (!Object.prototype.hasOwnProperty.call(newItem, "level")) {
        newItem.level = level;
      }

      // 如果存在子节点，递归处理子节点
      if (newItem.next && Array.isArray(newItem.next)) {
        let nextLevel = "";
        switch (level) {
          case "一级指标":
            nextLevel = "二级指标";
            break;
          case "二级指标":
            nextLevel = "三级指标";
            break;
          case "三级指标":
            nextLevel = "四级指标"; // 如果需要更多层级，可以继续添加
            break;
          default:
            nextLevel = "一级指标"; // 默认回到一级
        }
        newItem.next = addLevelField(newItem.next, nextLevel);
      }

      return newItem;
    });
  };
  const convertNextToNext = (array: any[]) => {
    return array.map((item) => {
      // 取出需要去掉的属性，并保存剩余属性到 rest 变量
      const { children, pid, createTime, updateTime, key, ...rest } = item;

      // 如果存在 children 属性且长度大于0，则递归处理
      if (children && children.length > 0) {
        rest.next = convertNextToNext(children);
      }

      return rest; // 返回去掉不需要的属性后的对象
    });
  };
  // const convertNextToNext = (array: any[]) => {
  //   return array.map(item => {
  //     const { children, key, ...rest } = item; // 取出对象中的 next 属性并保存剩余属性到 rest 变量
  //     if (children && children.length > 0) {
  //       rest.next = convertNextToNext(children); // 递归调用函数将 children 转换为 next
  //     }
  //     return rest; // 返回剩余属性，如果没有 next 属性则不包含 children
  //   });
  // };
  const { state } = useLocation();

  function generateUniqueKey() {
    return Math.random().toString(36).substring(2); // 生成一个随机的字符串
  }
  // 指标详情
  const getIndexIds = async () => {
    const params = {
      id: state?.targetLibraryId,
      all: true,
    };
    const res = await getLibraryId(params);
    if (res.code == 200) {
      // setIndexData(res.data)
      if (res.data.length >= 1) {
        const newData = convertNextToChildren(res.data);
        const newDatas = addLevelField(newData);
        setDataSource(newDatas);
        // setNumerical(res.data.defaultMetricsScore)
      }
    } else {
      message.error(res.message);
    }
  };
  // 设置基础分
  const getNumber = () => {
    setNumerical(numerical);
    setIsNumber(true);
    // setNumerical(indexData?.defaultMetricsScore)
  };

  // 跟新指标详情
  const getIndexUpdata = async () => {
    const addMetricsInfosJson = convertNextToNext(dataSource);
    const formData = new FormData();
    formData.append("repositoryId", state?.targetLibraryId);
    formData.append("addMetricsInfosJson", JSON.stringify(addMetricsInfosJson));
    if (filed && Object.keys(filed).length > 0) {
      formData.append("file", filed);
    }

    const res = await getUpdateLibrary(formData);
    if (res.code === 200) {
      message.success("指标保存成功");
      getIndexIds();
    } else {
      message.error(res.message);
    }
  };
  const getIndexUpdatas = async (val: any) => {
    const addMetricsInfosJson = convertNextToNext(dataSource);
    const formData = new FormData();
    formData.append("repositoryId", state?.targetLibraryId);
    formData.append("addMetricsInfosJson", JSON.stringify(addMetricsInfosJson));
    if (val && Object.keys(val).length > 0) {
      formData.append("file", val);
    }

    const res = await getUpdateLibrary(formData);
    if (res.code === 200) {
      message.success("指标保存成功");
      getIndexIds();
    } else {
      message.error(res.message);
    }
  };
  const handleEdit = (value: string, value1: string) => {
    setisEdit(true);
    form.setFieldsValue({ key: value, content: value1 });
  };
  const onEdit = () => {
    form
      .validateFields()
      .then((values) => {
        onFinishadd(values);
      })
      .catch((errorInfo) => {});
  };
  function replaceContentById(array: DataType[], key: string, newContent: string): DataType[] {
    return array.map((item) => {
      if (item.key === key) {
        return { ...item, content: newContent };
      }
      if (item.children && Array.isArray(item.children)) {
        const updatedNext = replaceContentById(item.children, key, newContent);
        return { ...item, children: updatedNext };
      }
      return item;
    });
  }
  const onFinishadd = (value: any) => {
    const newArray: DataType[] = replaceContentById(dataSource, value.key, value.content);
    setDataSource(newArray);
    setisEdit(false);
  };
  const onUpdata = () => {
    forms.validateFields().then((values) => {
      const files = values.upload[0].originFileObj;
      if (files) {
        setfiled(null);
        setIsNumber(false);
        getIndexUpdatas(files);
        forms.resetFields();
      }
      // Clear form fields
      // setIsNumber(false);
    });
  };

  const onUploadChange = (info: any) => {
    const { file } = info;
    file.status = "done";
  };
  const handleAdds = async () => {
    const res: any = await reqDownloadExcel({ key: "zhibiao" });
    downloadFile(res, "指标模板.xlsx");
  };
  const [form] = Form.useForm();
  const [forms] = Form.useForm();
  useEffect(() => {
    getIndexIds();
  }, []);

  const content = useMemo(() => {
    return isText == "一级指标"
      ? "当前指标为【一】级指标，若是删除该指标，\n该指标下的二级、三级指标将同步删除,\n是否确认删除？"
      : isText === "二级指标"
      ? "当前指标为【二】级指标，若是删除该指标，\n该指标下的三级指标将同步删除, \n是否确认删除？"
      : "当前指标为【三】级指标，是否确认删除？";
  }, [isText]);
  return (
    <div className={styles.root}>
      <div className="operation-btns">
        <Space size={20}>
          <Button onClick={getNumber} type="primary" ghost>
            导入指标
          </Button>
          <Button onClick={getIndexUpdata} type="primary">
            保存
          </Button>
        </Space>
      </div>

      {dataSource.length > 0 ? (
        <Table
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }}
          rowClassName="editable-row"
          dataSource={dataSource.map((item) => ({ ...item, key: item.key }))} // 添加 key 属性
          columns={columns as ColumnTypes}
          pagination={false}
          expandable={{
            expandedRowKeys: expandedRows,
            onExpand: (_, record) => handleExpand(record, 2),
          }}
        />
      ) : (
        <div>
          <div className="headerTitle">
            <span style={{ width: "24%", marginLeft: 15 }}>指标等级</span>
            <span style={{ width: "19%" }}>指标内容</span>
            <span style={{ width: "30%" }}>应用状态</span>
            <span style={{ width: "25%" }}>操作</span>
          </div>
          <div className="emptyState">
            <img src={reEmpty} alt="" />
            <div>
              <span>暂无指标，点击</span>
              <Button
                onClick={handleAdd}
                className="rebtn"
                type="text"
                style={{ color: "#4187FF" }}>
                添加一级指标
              </Button>
              <span> 去创建~</span>
            </div>
          </div>
        </div>
      )}
      <Modal
        title="删除指标"
        open={isModalClear}
        onOk={() => handleDelete(isKey)}
        onCancel={handleCancelClear}>
        <div className={styles.root}>
          <div className="modelIcon">
            <div>
              {content &&
                content.split("\n").map((line, index) => (
                  <span className="modulSpan" key={index}>
                    {line}
                    <br />
                  </span>
                ))}
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="指标内容"
        open={isEdit}
        onOk={onEdit}
        onCancel={() => {
          form.resetFields();
          setisEdit(false);
        }}>
        <Form form={form} variant="filled" style={{ maxWidth: 600 }}>
          <Form.Item
            label="指标内容"
            name="content"
            rules={[{ required: true, message: "请输入指标内容!" }]}>
            <Input showCount maxLength={100} />
          </Form.Item>
          <Form.Item name="key" style={{ display: "none" }}>
            <Input />
          </Form.Item>
          <Form.Item name="id" style={{ display: "none" }}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="文件上传"
        open={isNumber}
        onOk={onUpdata}
        onCancel={() => {
          forms.resetFields();
          setIsNumber(false);
        }}
        width={650}>
        <Form form={forms} variant="filled" style={{ maxWidth: 650 }}>
          <div style={{ marginBottom: "8px" }}>
            <span>导入数据需按照模板表格填写信息，点击</span>
            <Button onClick={handleAdds} className="rebtn" type="text" style={{ color: "#4187FF" }}>
              下载表格模板
            </Button>
          </div>
          <Form.Item
            name="upload"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            rules={[{ required: true, message: "请上传文件!" }]}>
            <Upload.Dragger
              beforeUpload={() => false}
              fileList={[]}
              onChange={onUploadChange}
              maxCount={1}>
              <p className="ant-upload-drag-icon">
                <img src={word} alt="" />
              </p>
              <p className="ant-upload-text" style={{ color: "#4187FF", fontWeight: 500 }}>
                点击或将文件拖拽到这里上传
              </p>
              <p className="ant-upload-hint">仅支持格式为:xs、xlsx文件</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item name="id" style={{ display: "none" }}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MoraAdded;
