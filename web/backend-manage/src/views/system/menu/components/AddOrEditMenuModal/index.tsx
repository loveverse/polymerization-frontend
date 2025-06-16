import {
  App,
  Col,
  Form,
  GetProp,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  SelectProps
} from "antd";
import {type AddMenuReq, type MenuListRes, UpdateMenuReq} from "@/api/system/types";
import {useAppContext} from "@/context";
import {ModalControlsProps} from "@/hooks/useModalControls";
import {reqAddMenu, reqUpdateMenu} from "@/api/system";
import {useEffect, useState} from "react";

type SelectOptions = GetProp<SelectProps, 'options'>;

export interface MenuMethods {
  setParentOptions: (parentId: string, data: MenuListRes[]) => void
}

const findParentItems = (data: MenuListRes[], pid: string) => {
  // 初始化一个空数组来存储找到的上级项
  let parentItems: SelectOptions = [];
  // 遍历数据
  data.forEach((item) => {
    // 如果当前项的id等于要查找的pid，则将其添加到结果数组中
    if (item.id === pid) {
      parentItems.push(
        ...data.map((entry) => ({
          value: entry.id,
          label: entry.menuName,
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

const rootDir = [{value: "0", label: "根菜单"}];

const AddOrEditMenuModal = (props: ModalControlsProps<AddMenuReq | UpdateMenuReq, MenuMethods>) => {
  const {modalProps, modalActions, refresh} = props
  const {message} = App.useApp()
  const {dict} = useAppContext();

  const [menuForm] = Form.useForm<UpdateMenuReq>();
  const menuId = Form.useWatch("id", menuForm);
  const menuType = Form.useWatch("menuType", menuForm);
  const addMenu = async (values: AddMenuReq) => {
    modalActions.setLoading(true);
    const res = await reqAddMenu(values);
    if (res.code === 200) {
      modalActions.hide();
      message.success("添加菜单成功");
      menuForm.resetFields();
      refresh?.()
    } else {
      message.error(res.msg);
    }
    modalActions.setLoading(false);
  };
  const editMenu = async (values: UpdateMenuReq) => {
    modalActions.setLoading(true)
    const res = await reqUpdateMenu(values);
    if (res.code === 200) {
      modalActions.hide();
      message.success("修改菜单信息成功");
      refresh?.();
    } else {
      message.error(res.msg);
    }
    modalActions.setLoading(false)
  };
  const [parentMenuOptions, setParentMenuOptions] = useState<SelectOptions>(rootDir)
  const setParentOptions = (parentId: string, data: MenuListRes[]) => {
    console.log(parentId, data, 444);
    const nodes = findParentItems(data, parentId);
    setParentMenuOptions(nodes.length ? nodes : rootDir);
  }

  useEffect(() => {
    modalActions.exposeMethods({
      setParentOptions,
      setFieldsValue: menuForm.setFieldsValue,
    })

  }, []);
  return (
    <Modal
      {...modalProps}
      width={800}
      onOk={() => {
        menuForm
          .validateFields()
          .then((values) => {
            values.id ? editMenu(values) : addMenu(values)
          })
          .catch((err) => {
            console.error(err);
          });
      }}
    >
      <Form form={menuForm} autoComplete="off" labelCol={{span: 6}}
            initialValues={{visible: 1, menuType: "1"}}>
        <Form.Item hidden name="id">
          <div></div>
        </Form.Item>
        <Form.Item
          name="moduleId"
          hidden
        >
          <div></div>
        </Form.Item>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="菜单名称" name="menuName" rules={[{required: true, max: 255}]}>
              <Input placeholder="请输入菜单名称"/>
            </Form.Item>
            <Form.Item label="菜单类型" name="menuType">
              <Select options={dict.getDictItemList("menu_type")}
                      placeholder="请选择菜单类型"></Select>
            </Form.Item>
            <Form.Item label="排序值" name="sortOrder">
              <InputNumber
                placeholder="请输入排序值"
                step={10}
                min={0}
                maxLength={255}
                style={{width: "100%"}}
              />
            </Form.Item>
            {menuType !== "2" ?
              <Form.Item label="显示" name="visible" tooltip="是否在左侧菜单中显示">
                <Radio.Group buttonStyle="solid" optionType="button"
                             options={[{value: 0, label: "隐藏"}, {value: 1, label: "显示"}]}>
                </Radio.Group>
              </Form.Item> : null}

          </Col>
          <Col span={12}>
            {menuType !== "2" ?
              <Form.Item label="菜单路径" name="path" rules={[{required: true, max: 255}]}>
                <Input placeholder="请输入路由名称"/>
              </Form.Item> : null}

            {menuType !== "2" ? <Form.Item label="图标" name="icon">
              <Input placeholder="请输入图标" maxLength={255}/>
            </Form.Item> : null}
            {
              menuType === "2" ? <Form.Item label="权限标识" name="permission"
                                            tooltip="对应后台接口@PreAuthorize注解入参字符串">
                <Input placeholder="请输入权限值" maxLength={255}/>
              </Form.Item> : null
            }

            <Form.Item label="父级菜单" name="parentId" required>
              <Select options={parentMenuOptions} disabled={!menuId}></Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
export default AddOrEditMenuModal;
