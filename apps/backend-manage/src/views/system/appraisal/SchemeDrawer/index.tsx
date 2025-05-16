import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import {
  Form,
  FormInstance,
  Input,
  Drawer,
  DrawerProps,
  message,
  Space,
  Button,
  Select,
  Checkbox,
  Switch,
  InputNumber,
  Typography,
} from "antd";
import { reqAddScheme, reqEditScheme } from "@/api/system";
import { AddSchemeReq, DimensionalityListRes, EditSchemeReq } from "@/api/system/types";

import { reqCourseList } from "@/api/course/course";
import { reqPeriodList } from "@/api/base";
import { CoursePageRes } from "@/api/course/course/types";
import { PeriodListRes } from "@/api/base/types";
import styles from "./index.module.scss";

interface Options {
  courses: Omit<CoursePageRes, "disabled">[];
  periods: PeriodListRes[];
}
export interface SchemeDrawerRef extends ChildRef {
  schemeForm: FormInstance<EditSchemeReq>;
}
interface SchemeDrawerProps extends DrawerProps, ChildCallback {
  dimensionalityList: DimensionalityListRes[];
}
const SchemeDrawer = forwardRef<SchemeDrawerRef, SchemeDrawerProps>(function Child(props, ref) {
  useImperativeHandle(
    ref,
    () => {
      return {
        setShow,
        setConfirmLoading,
        schemeForm,
      };
    },
    []
  );

  const { dimensionalityList, callback, ...drawerProps } = props;
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [schemeForm] = Form.useForm<EditSchemeReq>();
  const addScheme = async (values: AddSchemeReq) => {
    setConfirmLoading(true);
    const res = await reqAddScheme(values);
    if (res.code === 200) {
      setShow(false);
      schemeForm.resetFields();
      message.success("新增测评方案成功");
      callback();
    } else {
      message.error(res.message);
    }
    setConfirmLoading(false);
  };
  const editScheme = async (values: EditSchemeReq) => {
    setConfirmLoading(true);
    const res = await reqEditScheme(values);
    if (res.code === 200) {
      setShow(false);
      schemeForm.resetFields();
      message.success("编辑测评方案成功");
      callback();
    } else {
      message.error(res.message);
    }
    setConfirmLoading(false);
  };
  const [options, setOptions] = useState<Options>({
    courses: [],
    periods: [],
  });
  const getOptions = async () => {
    const [res1, res2] = await Promise.all([reqCourseList({}), reqPeriodList()]);
    if ([res1, res2].every((k) => k.code === 200)) {
      setOptions({
        courses: res1.data.map((item) => {
          const { disabled, ...rest } = item;
          return rest;
        }),
        periods: res2.data,
      });
    } else {
      message.error(res1.message);
    }
  };

  const initdimensionList = useMemo(() => {
    return dimensionalityList
      .map((item) => {
        return {
          dimensionId: item.id,
          leftNum: 0,
          rightNum: 0,
        };
      })
      .slice(0, 2);
  }, [dimensionalityList]);

  useEffect(() => {
    if (show) {
      getOptions();
    }
  }, [show]);

  return (
    <Drawer
      {...drawerProps}
      open={show}
      width={520}
      onClose={() => setShow(false)}
      rootClassName={styles["root"]}
      extra={
        <Space size={15}>
          <Button onClick={() => setShow(false)}>取消</Button>
          <Button
            loading={confirmLoading}
            type="primary"
            onClick={() => {
              schemeForm
                .validateFields()
                .then((values) => {
                  if (values.planDimensions.length > dimensionalityList.length) {
                    message.warning("测评维度重复！");
                    return;
                  }
                  const list: EditSchemeReq["planDimensions"] = [];
                  let count = 0;
                  const len = values.planDimensions.length;
                  for (let i = 0; i < len; i++) {
                    const element = values.planDimensions[i];
                    list.push({
                      id: element.id || undefined,
                      dimensionId: element.dimensionId,
                      leftNum: element.leftNum,
                      rightNum: element.rightNum,
                    });
                    count = count + element.leftNum + element.rightNum;
                  }
                  // if (count / len !== 100) {
                  //   message.warning("测评分数百分比总和不等于100！");
                  //   return;
                  // }
                  values.planDimensions = list;
                  values.id ? editScheme(values) : addScheme(values);
                })
                .catch((err) => {
                  console.error(err);
                });
            }}>
            确定
          </Button>
        </Space>
      }>
      <Form form={schemeForm} autoComplete="off" labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <div />
        </Form.Item>
        <Form.Item label="测评方案名称" name="planName" rules={[{ required: true }]}>
          <Input placeholder="请输入测评方案名称" />
        </Form.Item>
        <Form.Item label="应用课程" name="courseId" rules={[{ required: true }]}>
          <Select
            options={options.courses}
            fieldNames={{ value: "id", label: "subjectName" }}
            placeholder="请选择应用课程"
          />
        </Form.Item>
        <Form.Item
          label="适用学段"
          name="periodIds"
          rules={[{ required: true, message: "请选择应用学段" }]}>
          <Checkbox.Group
            options={options.periods.map((item) => {
              return {
                value: item.id,
                label: item.periodName,
              };
            })}
          />
        </Form.Item>
        <Form.Item
          label="规则状态"
          name="isEnabled"
          valuePropName="checked"
          rules={[{ required: true }]}>
          <Switch unCheckedChildren="停用" checkedChildren="正常" />
        </Form.Item>
        <Form.List name="planDimensions" initialValue={initdimensionList}>
          {(fields, { add, remove }) => (
            <div className="dimension-body">
              <div>
                <span>测评维度详情</span>
                <ul className="dimension-header">
                  <li>测评维度</li>
                  <li>总分百分比范围</li>
                  <li>操作</li>
                </ul>
              </div>

              {fields.map((field) => (
                <ul key={field.key} className="dimension-list">
                  <li>
                    <Form.Item
                      noStyle
                      name={[field.name, "dimensionId"]}
                      rules={[{ required: true }]}>
                      <Select
                        options={dimensionalityList}
                        fieldNames={{ value: "id", label: "dimensionName" }}
                        size="small"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </li>
                  <li>
                    <Space>
                      <Form.Item noStyle name={[field.name, "leftNum"]}>
                        <InputNumber size="small" min={0} max={100} style={{ width: "auto" }} />
                      </Form.Item>
                      -
                      <Form.Item noStyle name={[field.name, "rightNum"]}>
                        <InputNumber size="small" min={0} max={100} style={{ width: "auto" }} />
                      </Form.Item>
                      %
                    </Space>
                  </li>
                  <li>
                    <Typography.Text
                      type="danger"
                      className="cur-pointer"
                      onClick={() => {
                        remove(field.name);
                      }}>
                      删除
                    </Typography.Text>
                  </li>
                </ul>
              ))}
              <Button
                type="dashed"
                block
                onClick={() => add({ dimensionId: "", leftNum: 0, rightNum: 0 })}
                className="add-dimension-btn">
                新增测评维度
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
    </Drawer>
  );
});

export default SchemeDrawer;
