import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Modal, ModalProps, Table, TableColumnsType, message } from "antd";
import { reqAbnormalDeviceList } from "@/api/server";
import { DeviceListRes } from "@/api/server/types";

interface AbnormalDeviceProps extends ModalProps {
  serverId: string;
}
const AbnormalDeviceModal = forwardRef<ChildRef, AbnormalDeviceProps>(function Child(props, ref) {
  useImperativeHandle(
    ref,
    () => {
      return {
        setShow,
        setConfirmLoading,
      };
    },
    []
  );
  const { serverId, ...modalProps } = props;
  const [show, setShow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const columns: TableColumnsType<DeviceListRes> = [
    {
      title: "序号",
      align: "center",
      render: (value, record, index) => index + 1,
    },
    { title: "设备名称", align: "center", dataIndex: "deviceName" },
    { title: "设备型号", align: "center", dataIndex: "deviceModel" },
    { title: "设备编号", align: "center", dataIndex: "" },
    { title: "设备类型", align: "center", dataIndex: "deviceType" },
    { title: "设备状态", align: "center", dataIndex: "deviceStatus" },
    { title: "备注信息", align: "center", dataIndex: "remark" },
  ];
  const [deviceData, setDeviceData] = useState<DeviceListRes[]>([]);
  const [loading, setLoading] = useState(false);
  const getDeviceList = async () => {
    setLoading(true);
    const res = await reqAbnormalDeviceList({ id: serverId });
    if (res.code === 200) {
      setDeviceData(res.data);
    } else {
      message.error(res.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (show) {
      getDeviceList();
    }
  }, [show]);

  return (
    <Modal
      {...modalProps}
      open={show}
      width={800}
      title="异常设备列表"
      onOk={() => setShow(false)}
      cancelButtonProps={{ hidden: true }}
      okText="关闭">
      <Table columns={columns} dataSource={deviceData} loading={loading} pagination={false} />
    </Modal>
  );
});

export default AbnormalDeviceModal;
