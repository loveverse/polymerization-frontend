import { useEffect, useRef, useState } from "react";
import { Avatar, Badge, Button, Modal, Space, message } from "antd";

import {
  reqAddRole,
  reqDelRole,
  reqDelUserRole,
  reqRoleList,
  reqRolePermission,
  reqSetRolePermission,
  reqUpdateRole,
  reqUserByRoleList,
} from "@/api/system";
import { AddRoleReq, UpdataRoleReq, RolePageRes } from "@/api/system/types";
import { IMenuTypeList } from "@/views/system/menu";
import styles from "./index.module.scss";

import { ComTitle } from "@/components";
import EditIcon from "@/assets/imgs/edit.png";
import DeleteIcon from "@/assets/imgs/delete.png";
import RoleModal, { RoleModalRef } from "./RoleModal";
import { UserPageRes } from "@/api/user/types";
import { CloseCircleOutlined } from "@ant-design/icons";
import AssignRolesModal from "./AssignRolesModal";
import MenuPermissionsDrawer from "./MenuPermissionsDrawer";

const SystemRole: React.FC = () => {
  const [roleData, setRoleData] = useState<RolePageRes[]>([]);
  const [roleId, setRoleId] = useState("");
  const fetchRoleList = async () => {
    const res = await reqRoleList();
    if (res.code === 200) {
      setRoleData(res.data);
      if (res.data.length) {
        setRoleId(roleId || res.data[0].id);
        fetchUserByRoleList(roleId || res.data[0].id);
      }
    } else {
      message.error(res.message);
    }
  };
  const addRoleRef = useRef<RoleModalRef>(null);
  const addRole = async (values: AddRoleReq) => {
    addRoleRef.current?.setConfirmLoading(true);
    const res = await reqAddRole(values);
    if (res.code === 200) {
      addRoleRef.current?.setShow(false);
      message.success("添加角色成功");
      addRoleRef.current?.roleForm.resetFields();
      fetchRoleList();
    } else {
      message.error(res.message);
    }
    addRoleRef.current?.setConfirmLoading(false);
  };

  const updateRoleRef = useRef<RoleModalRef>(null);
  const updateRole = async (values: UpdataRoleReq) => {
    updateRoleRef.current?.setConfirmLoading(true);
    const res = await reqUpdateRole(values);
    if (res.code === 200) {
      updateRoleRef.current?.setShow(false);
      fetchRoleList();
      message.success("修改角色信息成功");
    } else {
      message.error(res.message);
    }
    updateRoleRef.current?.setConfirmLoading(false);
  };
  const delRole = async (values: CommonId, text: string) => {
    Modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${text}】吗？`,
      onOk: async (close) => {
        const res = await reqDelRole(values);
        if (res.code === 200) {
          fetchRoleList();
          close();
          message.success("删除角色成功");
        } else {
          message.error(res.message);
        }
      },
    });
  };
  // 人员操作
  const [userByRoleList, setUserByRoleList] = useState<UserPageRes[]>([]);
  const fetchUserByRoleList = async (id: string) => {
    const res = await reqUserByRoleList({ id });
    if (res.code === 200) {
      setUserByRoleList(res.data);
    } else {
      message.error(res.message);
    }
  };
  const delUserRole = async (values: UserPageRes) => {
    Modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要移除【${values.username}】吗？`,
      onOk: async (close) => {
        const res = await reqDelUserRole({ userIds: [values.id], roleId });
        if (res.code === 200) {
          fetchRoleList();
          close();
          message.success("移除用户成功");
        } else {
          message.error(res.message);
        }
      },
    });
  };
  // 角色权限
  const [menuList, setMenuList] = useState<IMenuTypeList[]>([]);

  const [permissionShow, setPermissionShow] = useState(false);

  const [menuInfo, setMenuInfo] = useState<{
    menuIds: string[];
    [key: string]: any;
  }>({
    menuIds: [],
  });
  const getRolePermissionTree = async (value: CommonId) => {
    const res = await reqRolePermission(value);
    if (res.code === 200) {
      setMenuInfo(res.data);
    } else {
      message.error(res.message);
    }
  };
  const [setRoleLoading, setSetRoleLoading] = useState(false);
  const setRolePermission = async () => {
    setSetRoleLoading(true);
    const res = await reqSetRolePermission({
      roleId: menuInfo.id,
      powerIds: menuInfo.menuIds,
    });
    if (res.code === 200) {
      setPermissionShow(false);
      message.success("设置角色权限成功");
    } else {
      message.error(res.message);
    }
    setSetRoleLoading(false);
  };

  const assignRolesRef = useRef<ChildRef>(null);
  const setMenuRef = useRef<ChildRef>(null);
  useEffect(() => {
    fetchRoleList();
  }, []);
  return (
    <div className={styles.root}>
      <div className="role-box">
        <div className="role-header-box">
          <ComTitle title="角色列表" />
          <Button
            type="primary"
            size="large"
            ghost
            block
            onClick={() => {
              addRoleRef.current?.setShow(true);
            }}>
            添加角色
          </Button>
        </div>
        <ul className="role-list-box">
          {roleData.map((item, index) => {
            return (
              <li
                key={index}
                className={roleId === item.id ? "selected" : ""}
                onClick={(e) => {
                  e.stopPropagation();
                  setRoleId(item.id);
                  fetchUserByRoleList(item.id);
                }}>
                <span>
                  {item.roleName}（{item.userCount}）
                </span>
                <Space>
                  <Button
                    icon={<img src={EditIcon} />}
                    type="text"
                    onClick={() => {
                      updateRoleRef.current?.setShow(true);
                      updateRoleRef.current?.roleForm.setFieldsValue({
                        id: item.id,
                        roleName: item.roleName,
                      });
                    }}></Button>
                  <Button
                    icon={<img src={DeleteIcon} />}
                    type="text"
                    onClick={() => delRole({ id: item.id }, item.roleName)}></Button>
                </Space>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="personal-box">
        <ComTitle title="人员名单">
          <Space>
            <Button
              type="primary"
              onClick={() => {
                assignRolesRef.current?.setShow(true);
              }}>
              添加成员
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setMenuRef.current?.setShow(true);
              }}>
              权限设置
            </Button>
          </Space>
        </ComTitle>
        <div className="user-list">
          <ul>
            {userByRoleList.map((item, index) => {
              return (
                <li key={index}>
                  <Badge
                    count={
                      <CloseCircleOutlined className="del-icon" onClick={() => delUserRole(item)} />
                    }
                    offset={[-8, 8]}
                    className="del-tip">
                    <Avatar src={item.headImg} className="avator" />
                  </Badge>
                  <p className="user-name">{item.username}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <RoleModal title="新增角色" handleSubmit={addRole} ref={addRoleRef} />
      <RoleModal title="修改角色" handleSubmit={updateRole} ref={updateRoleRef} />
      <AssignRolesModal
        ref={assignRolesRef}
        title="添加成员"
        roleId={roleId}
        callback={fetchRoleList}
      />
      <MenuPermissionsDrawer ref={setMenuRef} title="设置角色菜单" roleId={roleId} />
    </div>
  );
};

export default SystemRole;
