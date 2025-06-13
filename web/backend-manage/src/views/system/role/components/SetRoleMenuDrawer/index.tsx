import {reqMenuIdsByRoleId, reqMenuTreeByModuleId, reqSetRolePermissions} from "@/api/system";
import {SpinLoading} from "@/components";
import {Button, Drawer, message, Space, Tree} from "antd";
import React, {useEffect, useState} from "react";
import {DrawerControlsProps} from "@/hooks/useDrawerControls";
import {MenuListRes} from "@/api/system/types";

export interface SetRoleMenuProps extends DrawerControlsProps {
  roleId: string;
}

interface RoleMenuInfo {
  menuList: MenuListRes[];
  menuIds: string[];
}

const SetRoleMenuDrawer = (props: SetRoleMenuProps) => {
  const {roleId, drawerProps, actions, refresh} = props;

  const [menuLoading, setMenuLoading] = useState(false);
  const [menuInfo, setMenuInfo] = useState<RoleMenuInfo>({
    menuList: [],
    menuIds: [],
  });
  // m_ht
  const getRoleMenuInfo = async () => {
    setMenuLoading(true)
    const [res1, res2] = await Promise.all([reqMenuTreeByModuleId({moduleId: "1"}), reqMenuIdsByRoleId({roleId: roleId})]);
    if (res1.code === 200 && res2.code === 200) {
      setMenuInfo({
        menuList: res1.data, menuIds: res2.data.menuIds,
      });
    } else {
      message.error("系统繁忙,请刷新后重试!");
    }
    setMenuLoading(false)
  };

  // 设置角色权限
  const setRolePermissions = async () => {
    const res = await reqSetRolePermissions({
      id: roleId,
      menuIds: menuInfo.menuIds,
    });
    if (res.code === 200) {
      actions.hide();
      message.success("设置角色菜单权限成功");
    } else {
      message.error(res.msg);
    }

  };
  useEffect(() => {
    if (drawerProps.open) {
      void getRoleMenuInfo();
    }
  }, [drawerProps.open]);
  return (
    <Drawer
      {...drawerProps}
      title="设置角色菜单权限"
      placement="right"
      width={400}
      extra={
        <Space>
          <Button onClick={() => actions.hide()}>取消</Button>
          <Button
            type="primary"
            loading={drawerProps.confirmLoading}
            onClick={() => {
              void setRolePermissions()
            }}>
            确定
          </Button>
        </Space>
      }>
      <div>
        <SpinLoading spinning={menuLoading} hasData={menuInfo.menuList.length}>
          {menuInfo.menuList.length ? (
            <Tree
              checkable
              defaultExpandAll
              checkStrictly
              checkedKeys={menuInfo.menuIds}
              treeData={menuInfo.menuList}
              fieldNames={{key: "id", title: "menuName"}}
              onCheck={(checkedKeys: any) => {
                setMenuInfo({
                  ...menuInfo,
                  menuIds: checkedKeys.checked,
                });
              }}
            />
          ) : null}
        </SpinLoading>
      </div>
    </Drawer>
  );
}

export default SetRoleMenuDrawer;
