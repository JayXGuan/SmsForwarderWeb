# SmsForwarder API 接口文档

## 基础信息

- **服务端口**: 默认 5000（可在App中配置）
- **请求方式**: POST
- **数据格式**: JSON
- **跨域支持**: 已启用 CORS

## 通用请求结构

所有API接口都使用统一的请求结构：

```json
{
    "data": { ... },      // 具体业务数据
    "timestamp": 1234567890,  // 时间戳（毫秒），用于签名验证
    "sign": "签名字符串"       // 可选，开启签名验证时必填
}
```

## 通用响应结构

所有API接口都返回统一的响应结构：

```json
{
    "code": 200,          // 状态码：200=成功，其他=失败
    "msg": "success",     // 消息：成功时为"success"，失败时为错误信息
    "data": { ... },      // 业务数据（可选）
    "timestamp": 1234567890,  // 服务端时间戳
    "sign": "签名字符串"       // 可选，开启签名验证时返回
}
```

## 签名机制

### 签名算法

当服务端开启签名验证（安全措施=1）时，需要计算签名：

```
1. stringToSign = timestamp + "\n" + signKey
2. 使用 HmacSHA256 算法计算签名
3. 对签名结果进行 Base64 编码
4. 对 Base64 结果进行 URL 编码
```

### 签名示例代码（Python）

```python
import hmac
import hashlib
import base64
import urllib.parse
import time

def calc_sign(timestamp, sign_key):
    string_to_sign = f"{timestamp}\n{sign_key}"
    mac = hmac.new(
        sign_key.encode('utf-8'),
        string_to_sign.encode('utf-8'),
        hashlib.sha256
    )
    sign_data = base64.b64encode(mac.digest()).decode('utf-8')
    return urllib.parse.quote(sign_data)

timestamp = int(time.time() * 1000)
sign = calc_sign(timestamp, "your_sign_key")
```

## 安全措施

服务端支持三种安全措施：

| 值  | 说明                                        |
| --- | ------------------------------------------- |
| 0   | 无安全措施（明文传输）                      |
| 1   | 签名验证（需提供timestamp和sign）           |
| 2   | RSA加密（请求需用公钥加密，响应用私钥加密） |
| 3   | SM4加密（国密算法，请求和响应都加密）       |

---

## API 接口列表

### 1. 查询服务器配置

**接口地址**: `/config/query`

**请求参数**:

| 参数名       | 类型 | 必填 | 说明                     |
| ------------ | ---- | ---- | ------------------------ |
| version_code | Long | 否   | 客户端版本号，默认100038 |

**请求示例**:

```json
{
  "data": {
    "version_code": 100038
  },
  "timestamp": 1782720009000,
  "sign": ""
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "enable_api_clone": true,
    "enable_api_sms_send": true,
    "enable_api_sms_query": true,
    "enable_api_call_query": true,
    "enable_api_contact_query": true,
    "enable_api_contact_add": true,
    "enable_api_battery_query": true,
    "enable_api_wol": true,
    "enable_api_location": false,
    "extra_device_mark": "我的手机",
    "extra_sim1": "中国联通_13800138000",
    "extra_sim2": "中国电信_13900139000",
    "sim_info_list": {
      "0": {
        "carrier_name": "中国联通",
        "icc_id": "898601...",
        "sim_slot_index": 0,
        "number": "",
        "country_iso": "cn",
        "subscription_id": 1
      },
      "1": {
        "carrier_name": "中国电信",
        "icc_id": "898603...",
        "sim_slot_index": 1,
        "number": "",
        "country_iso": "cn",
        "subscription_id": 2
      }
    },
    "version_code": 100055,
    "version_name": "3.5.0.260628"
  },
  "timestamp": 1782720009000
}
```

---

### 2. 发送短信

**接口地址**: `/sms/send`

**请求参数**:

| 参数名        | 类型   | 必填 | 说明                         |
| ------------- | ------ | ---- | ---------------------------- |
| sim_slot      | Int    | 是   | SIM卡槽：1=SIM1, 2=SIM2      |
| phone_numbers | String | 是   | 接收号码，多个号码用分号分隔 |
| msg_content   | String | 是   | 短信内容                     |

**请求示例**:

```json
{
  "data": {
    "sim_slot": 1,
    "phone_numbers": "13800138000",
    "msg_content": "这是一条测试短信"
  },
  "timestamp": 1782720009000,
  "sign": ""
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "success",
  "timestamp": 1782720009000
}
```

---

### 3. 查询短信

**接口地址**: `/sms/query`

**请求参数**:

| 参数名    | 类型   | 必填 | 说明                            |
| --------- | ------ | ---- | ------------------------------- |
| type      | Int    | 否   | 短信类型：1=接收, 2=发送，默认1 |
| page_num  | Int    | 否   | 页码，默认1                     |
| page_size | Int    | 否   | 每页条数，默认10                |
| keyword   | String | 否   | 关键词搜索                      |

**请求示例**:

```json
{
  "data": {
    "type": 1,
    "page_num": 1,
    "page_size": 10,
    "keyword": ""
  },
  "timestamp": 1782720009000,
  "sign": ""
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "name": "联系人姓名",
      "number": "13800138000",
      "content": "短信内容",
      "date": 1782720009000,
      "type": 1,
      "simId": 0,
      "subId": 1
    }
  ],
  "timestamp": 1782720009000
}
```

---

### 4. 查询通话记录

**接口地址**: `/call/query`

**请求参数**:

| 参数名       | 类型   | 必填 | 说明                                    |
| ------------ | ------ | ---- | --------------------------------------- |
| type         | Int    | 否   | 通话类型：1=来电, 2=去电, 3=未接，默认1 |
| page_num     | Int    | 否   | 页码，默认1                             |
| page_size    | Int    | 否   | 每页条数，默认10                        |
| phone_number | String | 否   | 号码筛选                                |

**请求示例**:

```json
{
  "data": {
    "type": 1,
    "page_num": 1,
    "page_size": 10,
    "phone_number": ""
  },
  "timestamp": 1782720009000,
  "sign": ""
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "name": "联系人姓名",
      "number": "13800138000",
      "dateLong": 1782720009000,
      "duration": 60,
      "type": 1,
      "viaNumber": "",
      "simId": 0,
      "subId": 1,
      "isForwarded": false
    }
  ],
  "timestamp": 1782720009000
}
```

---

### 5. 查询联系人

**接口地址**: `/contact/query`

**请求参数**:

| 参数名       | 类型   | 必填 | 说明             |
| ------------ | ------ | ---- | ---------------- |
| page_num     | Int    | 否   | 页码，默认1      |
| page_size    | Int    | 否   | 每页条数，默认10 |
| phone_number | String | 否   | 号码筛选         |
| name         | String | 否   | 姓名筛选         |

**请求示例**:

```json
{
  "data": {
    "page_num": 1,
    "page_size": 10,
    "phone_number": "",
    "name": ""
  },
  "timestamp": 1782720009000,
  "sign": ""
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "name": "联系人姓名",
      "phone_number": "13800138000"
    }
  ],
  "timestamp": 1782720009000
}
```

---

### 6. 添加联系人

**接口地址**: `/contact/add`

**请求参数**:

| 参数名       | 类型   | 必填 | 说明                         |
| ------------ | ------ | ---- | ---------------------------- |
| name         | String | 是   | 联系人姓名                   |
| phone_number | String | 是   | 电话号码，多个号码用分号分隔 |

**请求示例**:

```json
{
  "data": {
    "name": "新联系人",
    "phone_number": "13800138000;13900139000"
  },
  "timestamp": 1782720009000,
  "sign": ""
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "success",
  "timestamp": 1782720009000
}
```

---

### 7. 查询电量

**接口地址**: `/battery/query`

**请求参数**:

| 参数名       | 类型 | 必填 | 说明         |
| ------------ | ---- | ---- | ------------ |
| version_code | Long | 否   | 客户端版本号 |

**请求示例**:

```json
{
  "data": {
    "version_code": 100038
  },
  "timestamp": 1782720009000,
  "sign": ""
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "level": 80,
    "scale": 100,
    "status": 2,
    "health": 1,
    "plugged": 1,
    "voltage": 4200,
    "temperature": 25,
    "technology": "Li-ion"
  },
  "timestamp": 1782720009000
}
```

---

### 8. 查询位置

**接口地址**: `/location/query`

**请求参数**:

| 参数名       | 类型 | 必填 | 说明         |
| ------------ | ---- | ---- | ------------ |
| version_code | Long | 否   | 客户端版本号 |

**请求示例**:

```json
{
  "data": {
    "version_code": 100038
  },
  "timestamp": 1782720009000,
  "sign": ""
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "latitude": 39.9042,
    "longitude": 116.4074,
    "altitude": 50.0,
    "accuracy": 10.0,
    "speed": 0.0,
    "bearing": 0.0,
    "time": 1782720009000,
    "address": "北京市朝阳区xxx"
  },
  "timestamp": 1782720009000
}
```

---

### 9. 发送WOL唤醒包

**接口地址**: `/wol/send`

**请求参数**:

| 参数名 | 类型   | 必填 | 说明                            |
| ------ | ------ | ---- | ------------------------------- |
| mac    | String | 是   | 目标设备MAC地址                 |
| ip     | String | 否   | 广播IP地址，默认255.255.255.255 |
| port   | Int    | 否   | 端口，默认9                     |

**请求示例**:

```json
{
  "data": {
    "mac": "AA:BB:CC:DD:EE:FF",
    "ip": "192.168.1.255",
    "port": 9
  },
  "timestamp": 1782720009000,
  "sign": ""
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "success",
  "timestamp": 1782720009000
}
```

---

### 10. 拉取克隆配置

**接口地址**: `/clone/pull`

**功能说明**: 从服务端拉取App配置信息（用于多设备同步）

**请求参数**:

| 参数名       | 类型   | 必填 | 说明                       |
| ------------ | ------ | ---- | -------------------------- |
| version_code | Long   | 是   | 客户端版本号               |
| version_name | String | 否   | 客户端版本名称             |
| settings     | Map    | 否   | 客户端配置（用于版本校验） |

**请求示例**:

```json
{
  "data": {
    "version_code": 100038,
    "version_name": "1.0.38",
    "settings": {}
  },
  "timestamp": 1782720009000,
  "sign": ""
}
```

**响应示例**:

```json
{
    "code": 200,
    "msg": "success",
    "data": {
        "version_code": 100038,
        "version_name": "1.0.38",
        "settings": { ... },
        "sender_list": [ ... ],
        "rule_list": [ ... ],
        "frpc_list": [ ... ],
        "task_list": [ ... ]
    },
    "timestamp": 1782720009000
}
```

---

### 11. 推送克隆配置

**接口地址**: `/clone/push`

**功能说明**: 向服务端推送App配置信息（用于多设备同步）

**请求参数**:

| 参数名       | 类型   | 必填 | 说明           |
| ------------ | ------ | ---- | -------------- |
| version_code | Long   | 是   | 客户端版本号   |
| version_name | String | 否   | 客户端版本名称 |
| settings     | Map    | 是   | App配置        |
| sender_list  | List   | 否   | 发送通道列表   |
| rule_list    | List   | 否   | 转发规则列表   |
| frpc_list    | List   | 否   | Frpc配置列表   |
| task_list    | List   | 否   | 定时任务列表   |

**请求示例**:

```json
{
    "data": {
        "version_code": 100038,
        "version_name": "1.0.38",
        "settings": { ... },
        "sender_list": [ ... ],
        "rule_list": [ ... ],
        "frpc_list": [ ... ],
        "task_list": [ ... ]
    },
    "timestamp": 1782720009000,
    "sign": ""
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "success",
  "timestamp": 1782720009000
}
```

---

## 数据模型说明

### SimInfo (SIM卡信息)

| 字段名          | 类型   | 说明                     |
| --------------- | ------ | ------------------------ |
| carrier_name    | String | 运营商名称               |
| icc_id          | String | ICCID                    |
| sim_slot_index  | Int    | 卡槽索引：0=SIM1, 1=SIM2 |
| number          | String | 手机号码（可能为空）     |
| country_iso     | String | 国家代码                 |
| subscription_id | Int    | SubscriptionId           |

> **注意**: `sim_info_list` 中的 `number` 字段受系统限制可能为空或不准确，建议同时使用 `extra_sim1` 和 `extra_sim2` 字段来获取完整的号码信息。

### SmsInfo (短信信息)

| 字段名  | 类型   | 说明                            |
| ------- | ------ | ------------------------------- |
| name    | String | 联系人姓名                      |
| number  | String | 发送/接收号码                   |
| content | String | 短信内容                        |
| date    | Long   | 时间戳（毫秒）                  |
| type    | Int    | 类型：1=接收, 2=发送            |
| simId   | Int    | 卡槽ID：0=SIM1, 1=SIM2, -1=未知 |
| subId   | Int    | SubscriptionId                  |

### CallInfo (通话信息)

| 字段名      | 类型    | 说明                         |
| ----------- | ------- | ---------------------------- |
| name        | String  | 联系人姓名                   |
| number      | String  | 电话号码                     |
| dateLong    | Long    | 时间戳（毫秒）               |
| duration    | Int     | 通话时长（秒）               |
| type        | Int     | 类型：1=来电, 2=去电, 3=未接 |
| viaNumber   | String  | 来源号码                     |
| simId       | Int     | 卡槽ID                       |
| subId       | Int     | SubscriptionId               |
| isForwarded | Boolean | 是否来电转移                 |

### ContactInfo (联系人信息)

| 字段名       | 类型   | 说明       |
| ------------ | ------ | ---------- |
| name         | String | 联系人姓名 |
| phone_number | String | 电话号码   |

### BatteryInfo (电量信息)

| 字段名      | 类型   | 说明                                       |
| ----------- | ------ | ------------------------------------------ |
| level       | Int    | 当前电量百分比                             |
| scale       | Int    | 电量最大值（通常为100）                    |
| status      | Int    | 状态：1=充电中, 2=放电中, 3=满电, 4=未充电 |
| health      | Int    | 健康：1=良好, 2=过热, 3=损坏               |
| plugged     | Int    | 插头：0=无, 1=AC充电器, 2=USB              |
| voltage     | Int    | 电压（mV）                                 |
| temperature | Int    | 温度（0.1°C单位）                          |
| technology  | String | 电池技术                                   |

### LocationInfo (位置信息)

| 字段名    | 类型   | 说明           |
| --------- | ------ | -------------- |
| latitude  | Double | 纬度           |
| longitude | Double | 经度           |
| altitude  | Double | 海拔高度       |
| accuracy  | Double | 精度（米）     |
| speed     | Double | 速度（米/秒）  |
| bearing   | Double | 方向           |
| time      | Long   | 时间戳（毫秒） |
| address   | String | 地址描述       |

---

## 错误码说明

| code | 说明                  |
| ---- | --------------------- |
| 200  | 成功                  |
| 500  | 服务端错误            |
| 其他 | 具体错误信息见msg字段 |

---

## 注意事项

1. **字段命名**: JSON字段名使用**下划线格式**（如 `sim_slot`），不是驼峰格式
2. **SIM卡槽**: `sim_slot` 参数值：1表示SIM1，2表示SIM2
3. **权限要求**: App需要有相应的系统权限（短信、联系人、通话记录等）
4. **功能开关**: 每个API功能可在App中单独开启/关闭，未开启时请求会返回错误
5. **时间容差**: 签名验证时，timestamp与服务端时间的误差不能超过配置的时间容差（默认600秒）
