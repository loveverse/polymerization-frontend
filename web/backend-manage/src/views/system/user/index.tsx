import React, {useEffect, useState} from "react";
import {App, Button, Space, Switch, Table, TableColumnsType, Tag} from "antd";

import {reqDelBatchUser, reqUpdateUser, reqUserPage,} from "@/api/system";
import {ResetUserPasswordReq, UpdateUserStatusReq, UserDataRes} from "@/api/system/types";
import {PAGE_CURRENT, PAGE_SIZE} from "@/utils/constant";
import AddOrEditUserModal from "./components/AddOrEditUserModal";
import styles from "./index.module.scss";
import {useAppContext} from "@/context";
import {useModalControls} from "@/hooks";

const UserManage: React.FC = () => {
  const {message, modal} = App.useApp()
  const {dict} = useAppContext();

  const columns: TableColumnsType<UserDataRes> = [
    {
      title: "序号",
      align: "center",
      width: 80,
      render: (_value, _record, index) => (userData.page - 1) * userData.size + index + 1,
    },
    {title: "用户名", dataIndex: "username", align: "center"},
    {title: "昵称", dataIndex: "nickname", align: "center"},
    {
      title: "性别",
      dataIndex: "gender",
      align: "center",
      render: (value) => dict.getDictItemMap("gender_type", value),
    },
    {
      title: "用户角色",
      dataIndex: "roleList",
      align: "center",
      render(_value, record) {
        return (
          <Space>
            {record.roleList.map((k) => {
              return (
                <Tag color="processing" key={k.id}>
                  {k.roleName}
                </Tag>
              );
            })}
          </Space>
        );
      },
    },
    {title: "手机号", dataIndex: "phoneNumber", align: "center"},
    {title: "邮箱", dataIndex: "email", align: "center"},
    {
      title: "状态",
      dataIndex: "status",
      align: "center",
      render(value, record) {
        return (
          <Switch
            checkedChildren="启用"
            unCheckedChildren="停用"
            checked={value}
            onChange={(check) =>
              updateUserStatus({id: record.id, status: Number(check)})
            }
          />
        );
      },
    },
    {
      title: "操作",
      align: "center",
      width: 240,
      render(_value, record) {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                modal.confirm({
                  title: "提示",
                  closable: true,
                  content: `是否将【${record.username}】密码重置为123456 ?`,
                  onOk: () =>
                    resetUserPassword({id: record.id, password: "123456"})
                });
              }}>
              重置密码
            </Button>
            <Button
              type="link"
              onClick={() => {
                editUserActions.show({...record, roleIds: record.roleList.map(k => k.id)});
              }}>
              编辑
            </Button>
            <Button type="text" danger onClick={() => delUser(record)}>
              删除
            </Button>
          </>
        );
      },
    },
  ];
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<PageResult<UserDataRes>>({
    page: PAGE_CURRENT,
    size: PAGE_SIZE,
    data: [],
    total: 0,
  });
  const getUserPage = async (page = PAGE_CURRENT, size = PAGE_SIZE) => {
    setLoading(true);
    const res = await reqUserPage({page, size});
    if (res.code === 200) {
      setUserData(res.data);
    } else {
      message.error(res.msg);
    }
    setLoading(false);
  };

  const updateUserStatus = async (values: UpdateUserStatusReq) => {
    const res = await reqUpdateUser(values);
    if (res.code === 200) {
      message.success("修改状态成功");
      void getUserPage(userData.page, userData.size);
    } else {
      message.error(res.msg);
    }
  };
  const resetUserPassword = async (values: ResetUserPasswordReq) => {
    const res = await reqUpdateUser(values);
    if (res.code === 200) {
      message.success("重置密码成功");
      void getUserPage(userData.page, userData.size);
    } else {
      message.error(res.msg);
    }
  };
  const [addUserProps, addUserActions] = useModalControls()
  const [editUserProps, editUserActions] = useModalControls()
  const delUser = (values: UserDataRes) => {
    modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${values.username}】吗？`,
      onOk: async () => {
        const res = await reqDelBatchUser([values.id]);
        if (res.code === 200) {
          message.success("删除用户成功");
          void getUserPage();
        } else {
          message.error(res.msg);
        }
      },
    });
  };

  useEffect(() => {
    void getUserPage();
  }, []);

  return (
    <div className={styles.root}>
      <div className="operation-header">
        <Button
          type="primary"
          onClick={() => {
            addUserActions.show();
          }}>
          新增用户
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={userData.data}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 位用户`,
          total: userData.total,
          pageSize: userData.size,
          current: userData.page,
          onChange:
          getUserPage
          ,
        }}
      />
      <AddOrEditUserModal
        modalActions={addUserActions}
        modalProps={{...addUserProps, title: "新增用户"}}
        refresh={getUserPage}/>
      <AddOrEditUserModal
        modalActions={editUserActions}
        modalProps={{...editUserProps, title: "编辑用户"}}
        refresh={() => getUserPage(userData.page, userData.size)}
      />
    </div>
  );
};

export default UserManage;
