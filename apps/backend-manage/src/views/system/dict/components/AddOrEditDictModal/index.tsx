import {Form, Modal, Input, App, Select} from "antd";
import {AddDictReq, UpdateDictReq} from "@/api/system/types";
import {reqAddDict, reqUpdateDict} from "@/api/system";
import {ModalControlsProps} from "@/hooks/useModalControls";
import {useEffect, useState} from "react";
import {reqModuleList} from "@/api/module";
import {ModuleDataRes} from "@/api/module/types";


const AddOrEditDictModal = (props: ModalControlsProps<UpdateDictReq>) => {
  const {message} = App.useApp()
  const {modalProps, actions, refresh} = props;
  const [dictForm] = Form.useForm<UpdateDictReq>();

  const addDict = async (values: AddDictReq) => {
    actions.setLoading(true)
    const res = await reqAddDict(values);
    if (res.code === 200) {
      actions.hide();
      dictForm.resetFields();
      message.success("添加字典成功");
      refresh?.()
    } else {
      message.error(res.msg);
    }
    actions.setLoading(false)
  };

  const editDict = async (values: UpdateDictReq) => {
    actions.setLoading(true);
    const res = await reqUpdateDict(values);
    if (res.code === 200) {
      actions.hide();
      message.success("修改字典信息成功");
      refresh?.()
    } else {
      message.error(res.msg);
    }
    actions.setLoading(false)
  };
  const [moduleList, setModuleList] = useState<ModuleDataRes[]>([]);
  const getModuleList = async () => {
    const res = await reqModuleList();
    if (res.code === 200) {
      setModuleList(res.data);
    } else {
      message.error(res.msg);
    }
  };

  // 监听modalProps.open变化，设置表单初始值
  useEffect(() => {
    if (modalProps.open) {
      void getModuleList()
      const initialValues = actions.getInitialValues();
      if (initialValues) {
        dictForm.setFieldsValue(initialValues);
      }
    }
  }, [modalProps.open]);

  return (
    <Modal
      {...modalProps}
      onOk={() => {
        dictForm
          .validateFields()
          .then((values) => {
            values.id ? editDict(values) : addDict(values)
          })
          .catch((err) => {
            console.error(err);
          });
      }}
    >
      <Form form={dictForm} autoComplete="off" labelCol={{span: 6}}>
        <Form.Item hidden name="id">
          <div></div>
        </Form.Item>
        <Form.Item label="字典名称" name="dictLabel" rules={[{required: true, max: 255}]}>
          <Input placeholder="请输入字典名称"/>
        </Form.Item>
        <Form.Item label="字典标识" name="dictValue" rules={[{required: true, max: 255}]}>
          <Input placeholder="请输入字典标识"/>
        </Form.Item>
        <Form.Item label="模块分组" name="moduleId">
          <Select placeholder="请选择应用的模块" options={moduleList}
                  fieldNames={{value: "id", label: "moduleName"}}/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddOrEditDictModal;
