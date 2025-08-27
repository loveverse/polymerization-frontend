import React, { useEffect, useState } from "react"
import {
  Button,
  message,
  Modal,
  Select,
  Space,
  Table,
  TableColumnsType,
  Tag,
  Typography,
} from "antd"
import { DownOutlined, RightOutlined } from "@ant-design/icons"

import { reqDelMenu, reqMenuTreeByModuleId } from "@/api/system"
import type { AddMenuReq, MenuListRes, UpdateMenuReq } from "@/api/system/types"

import styles from "./index.module.scss"
import AddOrEditMenuModal, { MenuMethods } from "./components/AddOrEditMenuModal"
import { useModalControls } from "@/hooks"
import { ModuleDataRes } from "@/api/module/types"
import { reqModuleList } from "@/api/module"
import { useAppContext } from "@/context"

const MenuManage: React.FC = () => {
  const { dict } = useAppContext()
  const columns: TableColumnsType<MenuListRes> = [
    { title: "菜单名称", dataIndex: "menuName" },
    { title: "菜单图标", dataIndex: "icon" },
    { title: "菜单路径", dataIndex: "path" },
    {
      title: "菜单类型",
      dataIndex: "menuType",
      render: (_value, record) => {
        return (
          <Tag color={record.menuType === "2" ? "success" : "processing"}>
            {dict.getDictItemMap("menu_type", record.menuType)}
          </Tag>
        )
      },
    },
    { title: "权限标识", dataIndex: "permission", align: "center" },
    { title: "排序值", dataIndex: "sortOrder", align: "center" },
    {
      title: "操作",
      align: "center",
      width: 300,
      render(_value, record) {
        return (
          <>
            <Button
              type="link"
              disabled={record.menuType === "2"}
              onClick={e => {
                e.stopPropagation()
                setModalTitle("添加子菜单")
                addMenuActions.show({
                  parentId: record.id,
                  moduleId: moduleId,
                })
                addMenuActions.setParentOptions(record.id, menuList)
              }}>
              添加子菜单
            </Button>
            <Button
              type="link"
              onClick={e => {
                e.stopPropagation()
                editMenuActions.show(record)
                editMenuActions.setParentOptions(record.parentId, menuList)
              }}>
              编辑
            </Button>
            <Button
              type="text"
              danger
              onClick={e => {
                e.stopPropagation()
                delMenu(record)
              }}>
              删除
            </Button>
          </>
        )
      },
    },
  ]

  const [loading, setLoading] = useState(false)
  const [menuList, setMenuList] = useState<MenuListRes[]>([])
  const getMenuList = async (value?: string) => {
    setLoading(true)
    const res = await reqMenuTreeByModuleId({ moduleId: value || moduleId })
    if (res.code === 200) {
      setMenuList(res.data)
    } else {
      message.error(res.msg)
    }
    setLoading(false)
  }

  const [addMenuProps, addMenuActions] = useModalControls<AddMenuReq, MenuMethods>()
  const [editMenuProps, editMenuActions] = useModalControls<UpdateMenuReq, MenuMethods>()

  const delMenu = (values: MenuListRes) => {
    Modal.confirm({
      title: "提示",
      content: `确定删除【${values.menuName}】菜单吗？`,
      closable: true,
      onOk: async () => {
        const res = await reqDelMenu({ id: values.id, moduleId: moduleId })
        if (res.code === 200) {
          message.success("删除菜单成功")
          await getMenuList()
        } else {
          message.error(res.msg)
        }
      },
    })
  }

  const [moduleList, setModuleList] = useState<ModuleDataRes[]>([])
  const [moduleId, setModuleId] = useState("")
  const getModuleList = async () => {
    const res = await reqModuleList()
    if (res.code === 200) {
      setModuleList(res.data)
      if (res.data.length) {
        setModuleId(res.data[0].id)
        await getMenuList(res.data[0].id)
      }
    } else {
      message.error(res.msg)
    }
  }
  const [modalTitle, setModalTitle] = useState("")
  useEffect(() => {
    void getModuleList()
  }, [])

  return (
    <div className={styles.root}>
      <Space className="operation-header">
        <Select
          value={moduleId}
          options={moduleList}
          fieldNames={{ value: "id", label: "moduleName" }}
          style={{ width: 150 }}
          onChange={value => {
            setModuleId(value)
            void getMenuList(value)
          }}></Select>
        <Button
          type="primary"
          onClick={() => {
            setModalTitle("新增根菜单")
            addMenuActions.show({
              parentId: "0",
              moduleId: moduleId,
            })
          }}>
          新增根菜单
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={menuList}
        pagination={false}
        loading={loading}
        rowKey={record => record.id}
        expandable={{
          expandRowByClick: true,
          expandIcon: ({ record, expanded }) => {
            if (!record.children?.length) {
              return null
            }
            return (
              <Typography.Link style={{ marginRight: 5 }}>
                {expanded ? <DownOutlined /> : <RightOutlined />}
              </Typography.Link>
            )
          },
        }}
      />

      <AddOrEditMenuModal
        modalProps={{ ...addMenuProps, title: modalTitle }}
        modalActions={addMenuActions}
        refresh={getMenuList}
      />
      <AddOrEditMenuModal
        modalProps={{ ...editMenuProps, title: "编辑菜单" }}
        modalActions={editMenuActions}
        refresh={getMenuList}
      />
    </div>
  )
}

export default MenuManage
