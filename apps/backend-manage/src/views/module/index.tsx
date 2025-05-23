import React, {useEffect, useState} from "react";
import {Button, Input, Table, message} from "antd";
import type {TableColumnsType} from "antd";
import {SearchOutlined} from "@ant-design/icons";

import {reqModuleList,} from "@/api/module";
import {ModuleDataRes,} from "@/api/module/types";
import AddOrEditModuleModal from "./AddOrEditModuleModal";
import styles from "./index.module.scss";
import {useModalControls} from "@/hooks";

const ModuleManage: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const columns: TableColumnsType<ModuleDataRes> = [
    {
      title: "序号",
      align: "center",
      width: 80,
      render: (_value, _record, index) => index + 1,
    },
    {title: "模块名称", dataIndex: "moduleName"},

    {
      title: "添加时间",
      dataIndex: "createTime",
      align: "center"
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
              editModuleActions.show(record)
            }}
          >
            编辑
          </Button>
          <Button type="text" danger disabled>
            删除
          </Button>
        </>
      ),
    },
  ];


  const [loading, setLoading] = useState(false);
  const [moduleList, setModuleList] = useState<ModuleDataRes[]>([]);
  const getModuleList = async () => {
    setLoading(true);
    const res = await reqModuleList();
    if (res.code === 200) {
      setModuleList(res.data);
    } else {
      message.error(res.msg);
    }
    setLoading(false);
  };

  const [addModuleProps, addModuleActions] = useModalControls()
  const [editModuleProps, editModuleActions] = useModalControls()


  useEffect(() => {
    getModuleList();
  }, []);

  return (
    <div className={styles.root}>
      <div className="operation-header">
        <Button
          type="primary"
          onClick={() => {
            addModuleActions.show()
          }}
        >
          新增模块
        </Button>

        <Input
          className="search"
          prefix={<SearchOutlined/>}
          value={searchValue}
          allowClear
          placeholder="请输入模块名称进行搜索"
          maxLength={100}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
      </div>
      <Table
        pagination={false}
        columns={columns}
        dataSource={moduleList}
        loading={loading}
        rowKey={(record) => record.id}
      />
      <AddOrEditModuleModal
        actions={addModuleActions}
        modalProps={{...addModuleProps, title: "新增模块"}}
      />
      <AddOrEditModuleModal
        actions={editModuleActions}
        modalProps={{...editModuleProps, title: "编辑模块"}}
      />
    </div>
  );
};

export default ModuleManage;
