import { forwardRef, memo, useEffect, useImperativeHandle, useState } from "react";
import { Button, Drawer, DrawerProps, Segmented, Space, Tree, message } from "antd";
import { reqSchoolRoleList } from "@/api/school";
import { ModuleListRes } from "@/api/module/types";
import { SpinLoading } from "@/components";

import { IMenuTypeList } from "@/views/system/menu";
import { reqMenuTree } from "@/api/system";

export interface SettingRoleProps extends ChildProps<string[]> {
  schoolInfo: {
    id: string;
    modules: ModuleListRes[];
  };
}

const SettingRoleDrawer = forwardRef<ChildRef, DrawerProps & SettingRoleProps>(function Child(
  props,
  ref
) {
  useImperativeHandle(ref, () => {
    return {
      setShow,
      setConfirmLoading,
    };
  });

  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [moduleValue, setModuleValue] = useState("");
  const [loading, setLoading] = useState(false);

  const getSchoolRoleList = async () => {
    const res = await reqSchoolRoleList({ id: props.schoolInfo.id });
    if (res.code === 200) {
      if (res.data.moduleIds.length) {
        const moduleId = res.data.moduleIds[0];
        setModuleValue(moduleId);
        setMenuIds(res.data.menuIds);
        getMenuList(moduleId);
      }
    } else {
      message.error(res.message);
    }
  };

  const [menuList, setMenuList] = useState<IMenuTypeList[]>([]);
  const getMenuList = async (value: string) => {
    setLoading(true);
    const res = await reqMenuTree();
    if (res.code === 200) {
      setMenuList(res.data);
    } else {
      message.error(res.message);
    }
    setLoading(false);
  };
  // 设置模块菜单
  const [menuIds, setMenuIds] = useState<string[]>([]);
  // id无变化会多次执行
  useEffect(() => {
    if (show) {
      getSchoolRoleList();
    }
  }, [show]);
  return (
    <Drawer
      title="设置模块菜单权限"
      placement="right"
      width={500}
      onClose={() => setShow(false)}
      open={show}
      extra={
        <Space>
          <Button onClick={() => setShow(false)}>取消</Button>
          <Button
            type="primary"
            loading={confirmLoading}
            onClick={() => {
              props.handleSubmit(menuIds);
            }}>
            确定
          </Button>
        </Space>
      }>
      <Segmented
        options={props.schoolInfo.modules.map((item) => {
          return {
            value: item.moduleValue,
            label: item.moduleName,
          };
        })}
        style={{ marginBottom: 20 }}
        value={moduleValue}
        onChange={(value) => {
          setModuleValue(value);
          getMenuList(value);
        }}
      />

      <SpinLoading spinning={loading} hasData={menuList.length}>
        <Tree
          checkable
          defaultExpandAll
          checkStrictly
          treeData={menuList}
          checkedKeys={menuIds}
          fieldNames={{ key: "id", title: "name" }}
          onCheck={(checkedKeys: any) => {
            setMenuIds(checkedKeys.checked);
          }}
        />
      </SpinLoading>
    </Drawer>
  );
});

export default memo(SettingRoleDrawer);
