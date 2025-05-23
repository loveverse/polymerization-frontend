import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Space, Table, Typography, message } from "antd";
import type { TableColumnsType } from "antd";
import { DownOutlined, RightOutlined } from "@ant-design/icons";

import { reqAddMenu, reqDelMenu, reqMenuTree, reqUpdateMenu } from "@/api/system";
import type { AddMenuReq, UpdateMenuReq } from "@/api/system/types";

import MenuModal, { MenuModalRef } from "./MenuModal";
import styles from "./index.module.scss";
import { MODULE_NAME } from "@/utils/constant";

export interface IMenuTypeList {
  key: React.Key;
  pid: string;
  id: string;
  name: string;
  icon: string;
  route: string;
  type: string;
  powerKey?: string;
  moduleName: string;
  orderValue: number;
  children?: IMenuTypeList[];
}

const rootDir = [{ value: "0", label: "根目录" }];
const MenuManage: React.FC = () => {
  const columns: TableColumnsType<IMenuTypeList> = [
    { title: "菜单名", dataIndex: "name" },
    { title: "菜单图标", dataIndex: "icon" },
    { title: "路由名", dataIndex: "route" },
    { title: "排序值", dataIndex: "orderValue", align: "center" },
    { title: "权限值", dataIndex: "powerKey", align: "center" },
    {
      title: "操作",
      align: "center",
      width: 300,
      render(value, record) {
        return (
          <>
            <Button
              type="link"
              disabled={record.type === "0"}
              onClick={(e) => {
                e.stopPropagation();
                addMenuRef.current?.menuForm.setFieldsValue({
                  pid: record.id,
                  moduleName: MODULE_NAME,
                });
                addMenuRef.current?.setPidOptions([
                  {
                    value: record.id,
                    label: record.name,
                  },
                ]);
                addMenuRef.current?.setShow(true);
              }}>
              添加子菜单
            </Button>
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation();
                const pidOptions = findParentItems(menuList, record.pid);
                updateMenuRef.current?.setPidOptions(pidOptions.length ? pidOptions : rootDir);
                updateMenuRef.current?.menuForm.setFieldsValue({
                  id: record.id,
                  pid: record.pid,
                  name: record.name,
                  icon: record.icon,
                  route: record.route,
                  type: record.type,
                  powerKey: record.powerKey,
                  moduleName: record.moduleName,
                  orderValue: record.orderValue,
                });

                updateMenuRef.current?.setShow(true);
              }}>
              编辑
            </Button>
            <Button
              type="text"
              danger
              onClick={(e) => {
                e.stopPropagation();
                delMenu({ id: record.id }, record.name);
              }}>
              删除
            </Button>
          </>
        );
      },
    },
  ];

  const [loading, setLoading] = useState(false);
  const [menuList, setMenuList] = useState<IMenuTypeList[]>([]);
  const fetchMenuTree = async () => {
    setLoading(true);
    const res = await reqMenuTree();
    if (res.code === 200) {
      setMenuList(res.data);
    } else {
      message.error(res.msg);
    }
    setLoading(false);
  };

  const addMenuRef = useRef<MenuModalRef>(null);
  const addMenu = async (values: AddMenuReq) => {
    addMenuRef.current?.setConfirmLoading(true);
    const res = await reqAddMenu(values);
    if (res.code === 200) {
      addMenuRef.current?.setShow(false);
      fetchMenuTree();
      message.success("添加菜单成功");
    } else {
      message.error(res.msg);
    }
    addMenuRef.current?.setConfirmLoading(false);
  };
  const updateMenuRef = useRef<MenuModalRef>(null);
  const updateMenu = async (values: UpdateMenuReq) => {
    const res = await reqUpdateMenu(values);
    if (res.code === 200) {
      updateMenuRef.current?.setShow(false);
      fetchMenuTree();
      message.success("修改菜单信息成功");
    } else {
      message.error(res.msg);
    }
  };
  const delMenu = async (values: CommonId, text: string) => {
    Modal.confirm({
      title: "提示",
      content: `确定删除【${text}】菜单吗？`,
      closable: true,
      onOk: async (close) => {
        const res = await reqDelMenu(values);
        if (res.code === 200) {
          fetchMenuTree();
          close();
          message.success("删除菜单成功");
        } else {
          message.error(res.msg);
        }
      },
    });
  };
  const findParentItems = (data: IMenuTypeList[], pid: string) => {
    // 初始化一个空数组来存储找到的上级项
    let parentItems: any[] = [];

    // 遍历数据
    data.forEach((item) => {
      // 如果当前项的id等于要查找的pid，则将其添加到结果数组中
      if (item.id === pid) {
        parentItems.push(
          ...data.map((entry) => ({
            value: entry.id,
            label: entry.name,
          }))
        );
      } else if (item.children && item.children.length > 0) {
        // 如果当前项有子项，则递归查找子项中的上级项，并将结果合并到结果数组中
        const foundItems = findParentItems(item.children, pid);
        parentItems = parentItems.concat(foundItems);
      }
    });

    // 返回找到的上级项数组
    return parentItems;
  };
  useEffect(() => {
    fetchMenuTree();
  }, []);

  return (
    <div className={styles.root}>
      <Space className="operation-header">
        <Button
          type="primary"
          onClick={() => {
            addMenuRef.current?.menuForm.setFieldsValue({
              moduleName: MODULE_NAME,
              pid: "0",
            });
            addMenuRef.current?.setPidOptions(rootDir);
            addMenuRef.current?.setShow(true);
          }}>
          新增根菜单
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={menuList}
        pagination={false}
        loading={loading}
        rowKey={(record) => record.id}
        expandable={{
          expandRowByClick: true,
          expandIcon: ({ record, expanded }) => {
            if (!record.children?.length) {
              return null;
            }
            return (
              <Typography.Link style={{ marginRight: 5 }}>
                {expanded ? <DownOutlined /> : <RightOutlined />}
              </Typography.Link>
            );
          },
        }}
      />

      <MenuModal title="新增菜单" ref={addMenuRef} handleSubmit={addMenu} />
      <MenuModal title="修改菜单" ref={updateMenuRef} handleSubmit={updateMenu} />
    </div>
  );
};

export default MenuManage;
