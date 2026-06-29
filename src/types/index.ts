// PocketBase 设备记录
export interface DeviceRecord {
  id: string;
  user: string;
  name: string;
  ip: string;
  port: number;
  sign_key?: string;
  security_mode: number;
  created: string;
  updated: string;
}

// SmsForwarder API 响应结构
export interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data?: T;
  timestamp: number;
  sign?: string;
}

// ApiRequest 请求结构
export interface ApiRequest<T = unknown> {
  data: T;
  timestamp: number;
  sign?: string;
}

// SimInfo SIM卡信息
export interface SimInfo {
  carrier_name: string;
  icc_id: string;
  sim_slot_index: number;
  number: string;
  country_iso: string;
  subscription_id: number;
}

// ConfigQueryData 配置查询数据
export interface ConfigQueryData {
  enable_api_clone: boolean;
  enable_api_sms_send: boolean;
  enable_api_sms_query: boolean;
  enable_api_call_query: boolean;
  enable_api_contact_query: boolean;
  enable_api_contact_add: boolean;
  enable_api_battery_query: boolean;
  enable_api_wol: boolean;
  enable_api_location: boolean;
  extra_device_mark: string;
  extra_sim1: string;
  extra_sim2: string;
  sim_info_list: Record<string, SimInfo>;
  version_code: number;
  version_name: string;
}

// SmsInfo 短信信息
export interface SmsInfo {
  name: string;
  number: string;
  content: string;
  date: number;
  type: number;
  simId: number;
  subId: number;
}

// CallInfo 通话信息
export interface CallInfo {
  name: string;
  number: string;
  dateLong: number;
  duration: number;
  type: number;
  viaNumber: string;
  simId: number;
  subId: number;
  isForwarded: boolean;
}

// ContactInfo 联系人信息
export interface ContactInfo {
  name: string;
  phone_number: string;
}

// BatteryInfo 电量信息
export interface BatteryInfo {
  level: number;
  scale: number;
  status: number;
  health: number;
  plugged: number;
  voltage: number;
  temperature: number;
  technology: string;
}

// LocationInfo 位置信息
export interface LocationInfo {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  speed: number;
  bearing: number;
  time: number;
  address: string;
}

// 查询参数类型
export interface SmsQueryParams {
  type?: number;
  page_num?: number;
  page_size?: number;
  keyword?: string;
}

export interface CallQueryParams {
  type?: number;
  page_num?: number;
  page_size?: number;
  phone_number?: string;
}

export interface ContactQueryParams {
  page_num?: number;
  page_size?: number;
  phone_number?: string;
  name?: string;
}

// 操作参数类型
export interface SmsSendParams {
  sim_slot: number;
  phone_numbers: string;
  msg_content: string;
}

export interface ContactAddParams {
  name: string;
  phone_number: string;
}

export interface WolSendParams {
  mac: string;
  ip?: string;
  port?: number;
}

// 设备完整信息（包含API返回的配置）
export interface DeviceFullInfo {
  record: DeviceRecord;
  config?: ConfigQueryData;
  isLoading: boolean;
  error?: string;
}
