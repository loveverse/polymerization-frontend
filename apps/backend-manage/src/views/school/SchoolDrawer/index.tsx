import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Checkbox,
  Form,
  FormInstance,
  Input,
  Drawer,
  DrawerProps,
  Space,
  DatePicker,
  Button,
  Flex,
  Radio,
  InputNumber,
  Cascader,
  message,
} from "antd";
import { AreaTreeRes, PeriodListRes } from "@/api/base/types";
import { useAppContext } from "@/context";
import { AddSchoolReq, UpdateSchoolReq } from "@/api/school/types";
import { reqAddSchool, reqUpdateSchool } from "@/api/school";

const { RangePicker } = DatePicker;

export interface FilterOptions {
  periods: PeriodListRes[];
  areas: AreaTreeRes[];
}

export interface SchoolDrawerProps extends DrawerProps {
  options: FilterOptions;
  callback(): void;
}
export interface SchoolDrawerRef extends ChildRef {
  schoolForm: FormInstance<UpdateSchoolReq>;
}

const SchoolDrawer = forwardRef<SchoolDrawerRef, SchoolDrawerProps>(function Child(props, ref) {
  useImperativeHandle(
    ref,
    () => {
      return {
        setShow,
        schoolForm,
        setConfirmLoading,
      };
    },
    []
  );
  const { options, callback, ...drawerProps } = props;
  const { dicts } = useAppContext();
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [schoolForm] = Form.useForm<UpdateSchoolReq>();

  const addSchool = async (values: AddSchoolReq) => {
    setConfirmLoading(true);
    const res = await reqAddSchool(values);
    if (res.code === 200) {
      setShow(false);
      schoolForm.resetFields();
      message.success("添加学校成功");
      callback();
    } else {
      message.error(res.message);
    }
    setConfirmLoading(false);
  };
  const updateSchool = async (values: UpdateSchoolReq) => {
    setConfirmLoading(true);
    const res = await reqUpdateSchool(values);
    if (res.code === 200) {
      setShow(false);
      callback();
      message.success("修改学校信息成功");
    } else {
      message.error(res.message);
    }
    setConfirmLoading(false);
  };
  return (
    <Drawer
      {...drawerProps}
      open={show}
      width={500}
      onClose={() => setShow(false)}
      footer={
        <Flex justify="flex-end">
          <Space>
            <Button onClick={() => setShow(false)}>取消</Button>
            <Button
              type="primary"
              loading={confirmLoading}
              onClick={() => {
                schoolForm
                  .validateFields()
                  .then((values) => {
                    const { times, ...rest } = values;
                    if (Array.isArray(times)) {
                      rest.validStartTime = times[0].valueOf();
                      rest.validEndTime = times[1].valueOf();
                    }
                    if (Array.isArray(rest.areaId)) {
                      rest.areaId = rest.areaId[rest.areaId.length - 1];
                    }
                    if (rest.id) {
                      updateSchool(rest);
                      return;
                    }
                    addSchool(rest);
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }}>
              确认
            </Button>
          </Space>
        </Flex>
      }>
      <Form
        form={schoolForm}
        autoComplete="off"
        labelCol={{ span: 7 }}
        labelAlign="left"
        initialValues={{
          isDisabled: "0",
        }}>
        <Form.Item hidden name="id">
          <div></div>
        </Form.Item>
        <Form.Item label="学校名称" name="schoolName" rules={[{ required: true, max: 255 }]}>
          <Input placeholder="请输入学校名称" />
        </Form.Item>
        <Form.Item
          label="所属区域"
          name="areaId"
          rules={[{ required: true, message: "请选择所属区域" }]}>
          <Cascader
            allowClear
            options={options.areas}
            style={{ width: "100%" }}
            fieldNames={{ value: "id", label: "name" }}
            placeholder="请选择省/市/县"
          />
        </Form.Item>
        <Form.Item name="address" label="详细地址">
          <Input.TextArea rows={4} placeholder="请输入详细地址" />
        </Form.Item>
        <Form.Item
          label="教授学段"
          name="periodIds"
          rules={[{ required: true, message: "请选择教授学段" }]}>
          <Checkbox.Group
            options={options.periods.map((item) => {
              return {
                value: item.id,
                label: item.periodName,
              };
            })}></Checkbox.Group>
        </Form.Item>
        <Form.Item label="系统应用状态" name="isDisabled" rules={[{ required: true }]}>
          <Radio.Group options={dicts.getDict("lock_status")}></Radio.Group>
        </Form.Item>
        <Form.Item label="系统启用有效期" name="times" rules={[{ required: true }]}>
          <RangePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="学校联系人" name="contacts" rules={[{ required: true }]}>
          <Input placeholder="请输入学校联系人" />
        </Form.Item>
        <Form.Item label="联系电话" name="contactsPhone" rules={[{ required: true }]}>
          <InputNumber placeholder="请输入联系电话" controls={false} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="学校账号">
          <Input disabled placeholder="系统默认生成" />
        </Form.Item>
      </Form>
    </Drawer>
  );
});

export default SchoolDrawer;
