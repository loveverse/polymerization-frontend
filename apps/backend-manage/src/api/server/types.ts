export interface AddServerReq {
  deviceCode: string;
  pushPrefix: string;
  schoolId: string;
  schoolName: string;
  serverIp: string;
  serverName: string;
  serverType: string;
  staticPrefix: string;
  uploadPrefix: string;
}

export type EditServerReq = AddServerReq & CommonId;

export interface ServerListRes {
  id: string;
  schoolId: string;
  schoolName: string;
  serverName: string;
  serverIp: string;
  deviceCode: string;
  staticPrefix: string;
  uploadPrefix: string;
  pushPrefix: string;
  exceptionNumber: number;
  deviceNumber: number;
}
export interface DeviceListRes {
  deviceModel: string;
  deviceName: string;
  deviceStatus: string;
  deviceType: string;
  id: string;
  remark: string;
  serverId: string;
}
