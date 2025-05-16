import { reqMenuTree, reqRolePermission, reqSetRolePermission } from "@/api/system";
import { SpinLoading } from "@/components";
import { Drawer, Space, Button, Tree, message, DrawerProps } from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
export interface MenuPermissionsChildProps extends DrawerProps {
  roleId: string;
}
interface MenuInfo {
  menuList: any[];
  menuIds: string[];
}

const MenuPermissionsDrawer = forwardRef<ChildRef, MenuPermissionsChildProps>(function Child(
  props,
  ref
) {
  useImperativeHandle(ref, () => {
    return {
      setShow,
      setConfirmLoading,
    };
  });
  const { roleId, ...drawerProps } = props;
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [menuLoading, setMenuLoading] = useState(false);
  const [menuInfo, setMenuInfo] = useState<MenuInfo>({
    menuList: [],
    menuIds: [],
  });
  // m_ht
  const fetchMenuInfo = async () => {
    const [res1, res2] = await Promise.all([reqMenuTree(), reqRolePermission({ id: roleId })]);
    if (res1.code === 200 && res2.code === 200) {
      setMenuInfo({
        menuList: res1.data,
        menuIds: res2.data.menuIds,
      });
    } else {
      message.error("系统繁忙,请刷新后重试!");
    }
  };

  // 设置角色权限
  const setRoleMenu = async () => {
    setConfirmLoading(true);
    const res = await reqSetRolePermission({
      roleId: roleId,
      powerIds: menuInfo.menuIds,
    });
    if (res.code === 200) {
      setShow(false);
      message.success("设置角色菜单权限成功");
    } else {
      message.error(res.message);
    }
    setConfirmLoading(false);
  };
  useEffect(() => {
    if (show) {
      fetchMenuInfo();
    }
  }, [show]);
  return (
    <Drawer
      {...drawerProps}
      title="设置角色菜单权限"
      placement="right"
      width={400}
      onClose={() => setShow(false)}
      open={show}
      extra={
        <Space>
          <Button onClick={() => setShow(false)}>取消</Button>
          <Button
            type="primary"
            loading={confirmLoading}
            onClick={() => {
              setRoleMenu();
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
              fieldNames={{ key: "id", title: "name" }}
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
});

export default MenuPermissionsDrawer;
