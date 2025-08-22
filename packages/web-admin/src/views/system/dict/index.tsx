import React, {
  ChangeEvent, useEffect, useMemo, useState,
} from "react";
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Table,
  App,
} from "antd";
import type {TableColumnsType} from "antd";
import {
  DeleteTwoTone,
  EditTwoTone,
  SearchOutlined,
} from "@ant-design/icons";
import {
  reqDelDict, reqDelDictItem, reqDictItemList, reqDictList,
} from "@/api/system";
import type {
  DictDataRes,
  DictItemDataRes,
} from "@/api/system/types";
import {SpinLoading} from "@/components";
import styles from "./index.module.scss";
import AddOrEditDictModal from "@/views/system/dict/components/AddOrEditDictModal";
import {useModalControls} from "@/hooks";
import AddOrEditDictItemModal from "@/views/system/dict/components/AddOrEditDictItemModal";

interface Dictionaries {
  dict: DictDataRes[];
  dictItems: DictItemDataRes[];
}


const DictManage: React.FC = () => {
  const {message, modal} = App.useApp()

  const columns: TableColumnsType<DictItemDataRes> = [
    {
      title: "序号",
      align: "center",
      width: 80,
      render: (_value, _record, index) => index + 1,
    },
    {
      title: "字典值(value)",
      dataIndex: "dictItemValue",
    },
    {title: "展示值(label)", dataIndex: "dictItemLabel"},

    {
      title: "排序",
      dataIndex: "sortOrder",
      align: "center",
    },
    {
      title: "操作",
      align: "center",
      width: 200,
      render: (_value, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              editDictItemActions.show(record);
            }}>
            编辑
          </Button>
          <Button
            type="text"
            danger
            onClick={() => {
              delDictItem(record);
            }}>
            删除
          </Button>
        </>
      ),
    },
  ];
  const [dictionaries, setDictionaries] = useState<Dictionaries>({
    dict: [],
    dictItems: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectDictId, setSelectDictId] = useState("");
  const getDictList = async () => {
    setLoading(true);
    const res = await reqDictList();
    if (res.code === 200) {
      setDictionaries({...dictionaries, dict: res.data})
      if (res.data.length && !selectDictId) {
        const dictId = res.data[0].id
        setSelectDictId(dictId)
        void getDictItemList(dictId)
      }
    } else {
      message.error(res.msg);
    }
    setLoading(false);
  };
  const [addDictProps, addDictActions] = useModalControls()
  const [editDictProps, editDictActions] = useModalControls()
  const delDict = async (values: DictDataRes) => {
    const res = await reqDelDict({id: values.id});
    if (res.code === 200) {
      void getDictList();
      message.success("删除字典成功");
    } else {
      message.error(res.msg);
    }
  };

  // 字典详情增删改查
  const [addDictItemProps, addDictItemActions] = useModalControls()
  const [editDictItemProps, editDictItemActions] = useModalControls()
  const delDictItem = (values: DictItemDataRes) => {
    modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${values.dictItemLabel}】吗？`,
      onOk: async () => {
        const res = await reqDelDictItem(values);
        if (res.code === 200) {
          message.success("删除字典项成功");
          void getDictItemList(selectDictId);
        } else {
          message.error(res.msg);
        }
      },
    });
  };

  const [dictItemLoading, setDictItemLoading] = useState(false)
  const getDictItemList = async (dictId: string) => {
    setDictItemLoading(true)
    const res = await reqDictItemList({dictId});
    if (res.code === 200) {
      setDictionaries((prev) => ({
        ...prev,
        dictItems: res.data
      }))
    } else {
      message.error(res.msg);
    }
    setDictItemLoading(false)
  };


  const [searchValue, setSearchValue] = useState<string>("");
  const tempSetValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const dictList = useMemo(() => {
    return dictionaries.dict.filter(
      (k) => k.dictValue.includes(searchValue) || k.dictLabel.includes(searchValue)
    );
  }, [searchValue, dictionaries]);

  useEffect(() => {
    void getDictList();
  }, []);
  return (
    <div className={styles.root}>
      <div className="dict-list-wrapper">
        <div className="dict-list-content">
          <h4 className="title">字典列表</h4>
          <Button
            type="primary"
            onClick={() => {
              addDictActions.show()
            }}>
            新增
          </Button>
        </div>
        <div>
          <Input
            prefix={<SearchOutlined/>}
            placeholder="请输入英文/中文名"
            value={searchValue}
            allowClear
            maxLength={100}
            onChange={tempSetValue}
          />
        </div>
        <div className="dict-list">
          <SpinLoading spinning={loading} hasData={dictionaries.dict.length}>
            <ul>
              {dictList.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={selectDictId === item.id ? "selected" : ""}
                    onClick={() => {
                      setSelectDictId(item.id);
                      void getDictItemList(item.id)
                    }}>
                    <div className="text text-ellipsis" title={item.dictValue}>
                      {item.dictLabel}【{item.dictValue}】
                    </div>
                    <Space>
                      <EditTwoTone
                        onClick={(e) => {
                          e.stopPropagation();
                          editDictActions.show(item)
                        }}
                      />
                      <Popconfirm
                        title="提示"
                        placement="right"
                        description="确定要删除吗？"
                        onCancel={(e) => {
                          e?.stopPropagation();
                        }}
                        onConfirm={() => delDict(item)}>
                        <DeleteTwoTone
                          twoToneColor={["red", "transparent"]}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />
                      </Popconfirm>
                    </Space>
                  </li>
                );
              })}
            </ul>
          </SpinLoading>
        </div>
      </div>
      <div className="dict-detail">
        <Button
          type="primary"
          className="add-dict-detail"
          onClick={() => addDictItemActions.show({
            dictId: selectDictId,
          })}>
          新增字典项
        </Button>
        <Table
          pagination={false}
          dataSource={dictionaries.dictItems}
          loading={dictItemLoading}
          columns={columns}
          rowKey={(record) => record.id}
        />
      </div>
      <AddOrEditDictModal
        modalProps={{...addDictProps, title: "新增字典"}}
        modalActions={addDictActions}
        refresh={getDictList}/>
      <AddOrEditDictModal
        modalProps={{...editDictProps, title: "编辑字典"}}
        modalActions={editDictActions}
        refresh={getDictList}/>
      <AddOrEditDictItemModal
        modalActions={addDictItemActions}
        modalProps={{...addDictItemProps, title: "新增字典项"}}
        refresh={() => getDictItemList(selectDictId)
        }/>
      <AddOrEditDictItemModal
        modalActions={editDictItemActions}
        modalProps={{...editDictItemProps, title: "编辑字典项"}}
        refresh={() => getDictItemList(selectDictId)}/>
    </div>
  );
};


export default DictManage;
