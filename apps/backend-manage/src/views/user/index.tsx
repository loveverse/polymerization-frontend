import React, {useEffect, useRef, useState} from "react";
import {Button, Modal, Space, Switch, Table, Tag, message} from "antd";
import type {TableColumnsType} from "antd";

import {reqRoleList} from "@/api/system";
import {
  reqAddUser,
  reqDelUser,
  reqResetUserPassword,
  reqUpdateUser,
  reqUpdateUserStatus,
  reqUserPage,
} from "@/api/user";
import {
  AddUserReq,
  UpdateUserReq,
  UpdateUserStatusReq,
  UserDataRes,
  } from "@/api/user/types";
import {PAGE_CURRENT, PAGE_SIZE} from "@/utils/constant";
import UserModal, {UserModalRef} from "./UserModal";
import styles from "./index.module.scss";
import {useAppContext} from "@/context";
import {RoleDataRes, RolePageParam} from "@/api/system/types";

const SystemUser: React.FC = () => {
  const {dicts} = useAppContext();

  const columns: TableColumnsType<UserDataRes> = [
    {
      title: "序号",
      align: "center",
      width: 80,
      render: (value, _, index) => (userData.page - 1) * userData.size + index + 1,
    },
    {title: "用户名", dataIndex: "username", align: "center"},
    {title: "昵称", dataIndex: "name", align: "center"},
    {
      title: "性别",
      dataIndex: "gender",
      align: "center",
      render: (value) => dicts.getLabel("gender", value),
    },
    {
      title: "用户角色",
      dataIndex: "roles",
      align: "center",
      render(value, record) {
        return (
          <Space>
            {record.roles.map((k, ki) => {
              return (
                <Tag color="processing" key={ki}>
                  {k.roleName}
                </Tag>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: "职务",
      dataIndex: "title",
      align: "center",
    },
    {
      title: "手机号",
      dataIndex: "phoneNumber",
      align: "center",
    },
    {title: "邮箱", dataIndex: "email", align: "center"},
    {
      title: "状态",
      dataIndex: "isLock",
      align: "center",
      render(value, record) {
        return (
          <Switch
            checkedChildren="启用"
            unCheckedChildren="停用"
            checked={!value}
            onChange={(check) => {
              updateUserStatus({
                id: record.id,
                isLock: Number(!check),
              });
            }}
          />
        );
      },
    },
    {
      title: "操作",
      align: "center",
      width: 240,
      render(value, record) {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                Modal.confirm({
                  title: "提示",
                  closable: true,
                  content: `是否将【${record.username}】密码重置为123456 ?`,
                  onOk: async (close) => {
                    resetUserPassword(
                      {id: record.id, password: "123456"} as UpdateUserReq,
                      close
                    );
                  },
                });
              }}>
              重置密码
            </Button>
            <Button
              type="link"
              onClick={() => {
                const showFn = () => {
                  updateUserRef.current?.userForm.setFieldsValue({
                    id: record.id,
                    username: record.username,
                    name: record.name,
                    // isLock: Number(!record.isLock),
                    roles: record.roles.map((k) => k.id),
                    title: record.title,
                    phoneNumber: record.phoneNumber,
                    email: record.email,
                  });
                  updateUserRef.current?.setShow(true);
                };
                if (roleList.length) {
                  showFn();
                  return;
                }
                getRoleList(showFn);
              }}>
              编辑
            </Button>
            <Button type="text" danger onClick={() => delUser({id: record.id}, record.username)}>
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
  const getUserPage = async (page = userData.page, size = userData.size) => {
    setLoading(true);
    const res = await reqUserPage({page, size});
    if (res.code === 200) {
      const {current, ...rest} = res.data;
      setUserData({...rest, page: current as number});
    } else {
      message.error(res.msg);
    }
    setLoading(false);
  };
  const [roleList, setRoleList] = useState<RoleDataRes[]>([]);
  const getRoleList = async (cb: () => void) => {
    const res = await reqRoleList();
    if (res.code === 200) {
      if (res.data.length) {
        setRoleList(res.data);
        cb();
      } else {
        message.warning("请先到角色管理创建角色");
      }
    } else {
      message.error(res.msg);
    }
  };
  const addUserRef = useRef<UserModalRef>(null);
  const addUser = async (values: AddUserReq) => {
    addUserRef.current?.setConfirmLoading(true);
    const res = await reqAddUser(values);
    if (res.code === 200) {
      addUserRef.current?.setShow(false);
      getUserPage();
      message.success("添加用户成功");
    } else {
      message.error(res.msg);
    }
    addUserRef.current?.setConfirmLoading(false);
  };

  const updateUserRef = useRef<UserModalRef>(null);
  const updateUser = async (values: UpdateUserReq) => {
    updateUserRef.current?.setConfirmLoading(true);
    const {isLock, ...rest} = values;
    const res = await reqUpdateUser(rest);
    if (res.code === 200) {
      updateUserRef.current?.setShow(false);
      getUserPage();
      message.success("修改用户信息成功");
    } else {
      message.error(res.msg);
    }
    updateUserRef.current?.setConfirmLoading(false);
  };
  const updateUserStatus = async (values: UpdateUserStatusReq) => {
    const res = await reqUpdateUserStatus(values);
    if (res.code === 200) {
      message.success("修改状态成功");
      getUserPage(userData.page, userData.size);
    } else {
      message.error(res.msg);
    }
  };
  const resetUserPassword = async (values: UpdateUserReq, close: () => void) => {
    const res = await reqResetUserPassword(values);
    if (res.code === 200) {
      message.success("重置密码成功");
      close();
      getUserPage(userData.page, userData.size);
    } else {
      message.error(res.msg);
    }
  };

  const delUser = async (values: CommonId, text: string) => {
    Modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${text}】吗？`,
      onOk: async (close) => {
        const res = await reqDelUser(values);
        if (res.code === 200) {
          getUserPage();
          close();
          message.success("删除用户成功");
        } else {
          message.error(res.msg);
        }
      },
    });
  };

  useEffect(() => {
    getUserPage();
  }, []);

  return (
    <div className={styles.root}>
      <div className="operation-header">
        <Button
          type="primary"
          onClick={() => {
            const showFn = () => {
              addUserRef.current?.setShow(true);
            };
            if (roleList.length) {
              showFn();
              return;
            }
            getRoleList(showFn);
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
          onChange: (page, pageSize) => {
            getUserPage(page, pageSize);
          },
        }}
      />
      <UserModal title="新增用户" ref={addUserRef} handleSubmit={addUser} roleOptions={roleList}/>
      <UserModal
        title="修改用户"
        ref={updateUserRef}
        handleSubmit={updateUser}
        roleOptions={roleList}
      />
    </div>
  );
};

export default SystemUser;
