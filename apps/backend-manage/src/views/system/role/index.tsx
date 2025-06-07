import React, {useEffect, useState} from "react";
import {Button, Space, Table, TableColumnsType, App, Switch} from "antd";
import {DeleteOutlined, EditOutlined, SettingOutlined} from "@ant-design/icons";
import {reqBatchDelRole, reqRolePage, reqUpdateRole} from "@/api/system";
import {RoleDataRes, UpdateRoleReq, UpdateRoleStatusReq} from "@/api/system/types";
import {PAGE_CURRENT, PAGE_SIZE} from "@/utils/constant";

import AddOrEditRoleModal from "./components/AddOrEditRoleModal";
import styles from "./index.module.scss";
import {useModalControls} from "@/hooks";
import SetRoleMenuDrawer from "@/views/system/role/components/SetRoleMenuDrawer";
import {useDrawerControls} from "@/hooks/useDrawerControls";

// 系统管理员不能操作
const isAdmin = 'ROLE_ADMIN'

const RoleManage: React.FC = () => {
  const {message, modal} = App.useApp();

  const columns: TableColumnsType<RoleDataRes> = [
    {
      title: "序号",
      align: "center",
      width: 80,
      render: (_value, _record, index) =>
        (roleData.page - 1) * roleData.size + index + 1,
    },
    {title: "角色名", dataIndex: "roleName"},
    {title: "角色标识", dataIndex: "roleKey"},
    {
      title: "角色状态", dataIndex: "status", render: (value, record) => {
        return <Switch value={value} checkedChildren="启用" unCheckedChildren="停用"
                       disabled={record.roleKey === isAdmin}
                       onChange={(val) => {
                         void updateRoleStatus({id: record.id, status: Number(val)});
                       }}/>
      }
    },
    {
      title: "操作",
      align: "center",
      width: 400,
      render: (_value, record) => (
        <>
          <Button
            type="link"
            icon={<SettingOutlined/>}
            disabled={record.roleKey === isAdmin}
            onClick={() => {
              setRoleId(record.id)
              setRoleMenuActions.show()
            }}
          >
            设置权限
          </Button>
          <Button
            type="link"
            icon={<EditOutlined/>}
            disabled={record.roleKey === isAdmin}
            onClick={() => {
              editRoleActions.show(record);
            }}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined/>}
            disabled={record.roleKey === isAdmin}
            onClick={() => {
              delRole(record);
            }}
          >
            删除
          </Button>
        </>
      ),
    },
  ];

  const [roleData, setRoleData] = useState<PageResult<RoleDataRes>>({
    page: PAGE_CURRENT,
    size: PAGE_SIZE,
    data: [],
    total: 0
  });
  const [loading, setLoading] = useState(false)
  const getRolePage = async (page = PAGE_CURRENT, size = PAGE_SIZE) => {
    setLoading(true)
    const res = await reqRolePage({page, size});
    if (res.code === 200) {
      res.data.data.forEach(item => {
        item.disabled = item.roleKey === isAdmin
      })
      setRoleData(res.data);
    } else {
      message.error(res.msg);
    }
    setLoading(false)
  };
  const [addRoleProps, addRoleActions] = useModalControls()
  const [editRoleProps, editRoleActions] = useModalControls()
  const delRole = (values: RoleDataRes) => {
    modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${values.roleName}】吗？`,
      onOk: async () => {
        const res = await reqBatchDelRole([values.id]);
        if (res.code === 200) {
          message.success("删除角色成功");
          await getRolePage(roleData.page, roleData.size);
        } else {
          message.error(res.msg);
        }
      },
    });
  };
  const updateRoleStatus = async (values: UpdateRoleStatusReq) => {
    const res = await reqUpdateRole(values as UpdateRoleReq);
    if (res.code === 200) {
      message.success("修改状态成功")
      await getRolePage(roleData.page, roleData.size);
    } else {
      message.error(res.msg);
    }
  }
  const [roleId, setRoleId] = useState("")
  const [setRoleMenuProps, setRoleMenuActions] = useDrawerControls()

  useEffect(() => {
    void getRolePage();
  }, []);
  return (
    <div className={styles.root}>
      <div className="operation-header">
        <Space>
          <Button
            type="primary"
            onClick={() => addRoleActions.show()}
          >
            新增角色
          </Button>
          <Button type="primary" onClick={() => {

          }}>
            导入
          </Button>
          <Button type="primary" danger={true} onClick={() => {
          }}>
            删除
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={roleData.data}
        loading={loading}
        rowSelection={{
          selections: true
        }}
        rowKey={(record) => record.id}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 位角色`,
          total: roleData.total,
          pageSize: roleData.size,
          current: roleData.page,
          onChange: getRolePage,
        }}
      />
      <AddOrEditRoleModal
        modalProps={{...addRoleProps, title: "新增角色"}}
        actions={addRoleActions}
        refresh={getRolePage}
      />
      <AddOrEditRoleModal
        modalProps={{...editRoleProps, title: "编辑角色"}}
        actions={editRoleActions}
        refresh={() => getRolePage(roleData.page, roleData.size)}/>
      <SetRoleMenuDrawer roleId={roleId} actions={setRoleMenuActions}
                         drawerProps={setRoleMenuProps}/>
    </div>
  );
};

export default RoleManage;
