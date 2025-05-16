import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { Typography, Space, Table, TableColumnsType, Button, Flex, message, Modal } from "antd";
import { reqDelServer, reqServerList } from "@/api/server";
import ServerDrawer, { ServerDrawerRef } from "./ServerDrawer";
import AbnormalDeviceModal from "./AbnormalDeviceModal";
import { ServerListRes } from "@/api/server/types";
const { Text, Link } = Typography;

const ServerDevice = () => {
  const columns: TableColumnsType<ServerListRes> = [
    { title: "序号", align: "center", render: (value, record, index) => index + 1 },
    { title: "学校/机构", align: "center", dataIndex: "schoolName" },
    { title: "服务器名", align: "center", dataIndex: "serverName" },
    { title: "IP", align: "center", dataIndex: "serverIp" },
    { title: "设备号", align: "center", dataIndex: "deviceCode" },
    { title: "静态资源前缀", align: "center", dataIndex: "staticPrefix" },
    { title: "上传文件前缀", align: "center", dataIndex: "uploadPrefix" },
    { title: "推送前缀", align: "center", dataIndex: "pushPrefix" },
    { title: "教学设备数量", align: "center", dataIndex: "deviceNumber" },
    {
      title: "教学设备异常",
      align: "center",
      dataIndex: "exceptionNumber",
      render: (value, record) => {
        return value ? (
          <Link
            onClick={() => {
              setServerId(record.id);
              abnormalDeviceRef.current?.setShow(true);
            }}>
            {value}
          </Link>
        ) : (
          <Text>{value}</Text>
        );
      },
    },
    {
      title: "操作",
      align: "center",
      width: 150,
      render: (value, record) => {
        return (
          <Space>
            <Link
              onClick={() => {
                const { schoolName, exceptionNumber, deviceNumber, ...rest } = record;
                editServerRef.current?.serverForm.setFieldsValue(rest);
                editServerRef.current?.setShow(true);
              }}>
              编辑
            </Link>
            <Text
              type="danger"
              className="cur-pointer"
              onClick={() => {
                delServer(record);
              }}>
              删除
            </Text>
          </Space>
        );
      },
    },
  ];
  const [serverList, setServerList] = useState<ServerListRes[]>([]);
  const getServerList = async () => {
    const res = await reqServerList();
    if (res.code === 200) {
      setServerList(res.data);
    } else {
      message.error(res.message);
    }
  };

  const addServerRef = useRef<ServerDrawerRef>(null);
  const editServerRef = useRef<ServerDrawerRef>(null);
  const delServer = async (values: ServerListRes) => {
    Modal.confirm({
      title: "提示",
      closable: true,
      content: `确定要删除【${values.serverName}】吗？`,
      onOk: async (close) => {
        const res = await reqDelServer({ id: values.id });
        if (res.code === 200) {
          close();
          message.success("删除服务器成功");
          getServerList();
        } else {
          message.error(res.message);
        }
      },
    });
  };

  const abnormalDeviceRef = useRef<ChildRef>(null);
  const [serverId, setServerId] = useState("");

  useEffect(() => {
    getServerList();
  }, []);

  return (
    <div className={styles["root"]}>
      <Flex justify="flex-end" style={{ marginBottom: 20 }}>
        <Button
          type="primary"
          onClick={() => {
            addServerRef.current?.setShow(true);
          }}>
          添加服务器
        </Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={serverList}
        pagination={false}
        rowKey={(record) => record.id}
      />
      <ServerDrawer ref={addServerRef} title="添加服务器" callback={getServerList} />
      <ServerDrawer ref={editServerRef} title="编辑服务器" callback={getServerList} />
      <AbnormalDeviceModal ref={abnormalDeviceRef} serverId={serverId} />
    </div>
  );
};

export default ServerDevice;
