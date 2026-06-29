# SmsForwarder 短信指令文档

## 基础信息

- **指令前缀**: 所有短信指令必须以 `smsf#` 开头
- **指令格式**: `smsf#功能#操作#参数`
- **分隔符**: 使用 `#` 分隔各部分
- **参数格式**: 部分指令需要JSON格式参数

## 前置条件

### 1. 开启短信指令功能

在App中开启"短信指令"开关：

- **设置路径**: 设置 → 短信指令开关

### 2. 配置安全号码（可选但推荐）

为防止恶意指令，建议配置安全号码：

- **设置路径**: 设置 → 短信指令安全号码
- **格式**: 多个号码用逗号或分号分隔
- **规则**: 只有安全号码列表中的号码发送的指令才会被执行
- **匹配规则**: 发送方号码结尾匹配即可（如配置 `138000`，则 `13800138000` 可以执行）

---

## 短信指令列表

### 1. HTTP服务器控制

#### 启动HTTP服务器

```
smsf#httpserver#start
```

**功能**: 启动5000端口的HTTP API服务器

**使用场景**: 远程开启API服务，然后通过HTTP接口查询短信、发送短信等

---

#### 停止HTTP服务器

```
smsf#httpserver#stop
```

**功能**: 停止HTTP API服务器

**使用场景**: 不需要API服务时关闭，节省资源

---

### 2. Frpc内网穿透控制

#### 启动所有自启动Frpc

```
smsf#frpc#start
```

**功能**: 启动所有标记为"开机自启"的Frpc隧道

---

#### 停止所有自启动Frpc

```
smsf#frpc#stop
```

**功能**: 停止所有标记为"开机自启"的Frpc隧道

---

#### 启动指定Frpc

```
smsf#frpc#start#uid1,uid2,uid3
```

**功能**: 启动指定UID的Frpc隧道

**参数**: Frpc配置的UID，多个UID用逗号分隔

---

#### 停止指定Frpc

```
smsf#frpc#stop#uid1,uid2,uid3
```

**功能**: 停止指定UID的Frpc隧道

**参数**: Frpc配置的UID，多个UID用逗号分隔

---

### 3. 系统控制（需要Root权限）

#### 重启设备

```
smsf#system#reboot
```

**功能**: 重启Android设备

**前提条件**: 设备需要已Root

**注意**: 有重复消息过滤机制（10秒+配置时间），避免误操作

---

#### 关机

```
smsf#system#shutdown
```

**功能**: 关闭Android设备

**前提条件**: 设备需要已Root

**注意**: 有重复消息过滤机制（10秒+配置时间），避免误操作

---

### 4. WiFi控制

#### 开启WiFi

```
smsf#wifi#on
```

**功能**: 开启设备WiFi

---

#### 关闭WiFi

```
smsf#wifi#off
```

**功能**: 关闭设备WiFi

---

### 5. 发送短信

#### 指令格式

```
smsf#sms#send#JSON参数
```

#### JSON参数说明

| 参数名        | 类型   | 必填 | 说明                    |
| ------------- | ------ | ---- | ----------------------- |
| sim_slot      | Int    | 是   | SIM卡槽：1=SIM1, 2=SIM2 |
| phone_numbers | String | 是   | 接收号码                |
| msg_content   | String | 是   | 短信内容                |

**重要**: JSON字段名使用**下划线格式**，不是驼峰格式！

#### 指令示例

```
smsf#sms#send#{"sim_slot":1,"phone_numbers":"13800138000","msg_content":"这是一条测试短信"}
```

#### 多号码发送示例

```
smsf#sms#send#{"sim_slot":1,"phone_numbers":"13800138000;13900139000","msg_content":"群发测试"}
```

#### 使用SIM2发送示例

```
smsf#sms#send#{"sim_slot":2,"phone_numbers":"13800138000","msg_content":"从SIM2发送"}
```

---

## 指令快速参考表

| 指令                    | 功能               | 权限要求       |
| ----------------------- | ------------------ | -------------- |
| `smsf#httpserver#start` | 启动HTTP服务器     | 无             |
| `smsf#httpserver#stop`  | 停止HTTP服务器     | 无             |
| `smsf#frpc#start`       | 启动所有自启动Frpc | 需下载Frpc库   |
| `smsf#frpc#stop`        | 停止所有自启动Frpc | 无             |
| `smsf#frpc#start#uids`  | 启动指定Frpc       | 需下载Frpc库   |
| `smsf#frpc#stop#uids`   | 停止指定Frpc       | 无             |
| `smsf#system#reboot`    | 重启设备           | 需Root         |
| `smsf#system#shutdown`  | 关机               | 需Root         |
| `smsf#wifi#on`          | 开启WiFi           | 无             |
| `smsf#wifi#off`         | 关闭WiFi           | 无             |
| `smsf#sms#send#JSON`    | 发送短信           | 需发送短信权限 |

---

## 常见问题排查

### 1. 指令没有执行

**可能原因**:

- 短信指令开关未开启
- 发送号码不在安全号码列表中
- 指令格式错误

**排查步骤**:

1. 检查App日志，搜索 `SmsReceiver` 或 `SmsCommandUtils`
2. 确认短信指令开关已开启
3. 确认发送号码在安全号码列表中（或清空安全号码配置）

### 2. 发送短信指令失败

**日志示例**:

```
SmsSendData(simSlot=0, phoneNumbers=null, msgContent=null)
Parsing SMS failed: Parameter specified as non-null is null
```

**原因**: JSON字段名格式错误

**解决**: 使用下划线格式字段名：

- ✅ 正确: `sim_slot`, `phone_numbers`, `msg_content`
- ❌ 错误: `simSlot`, `phoneNumbers`, `msgContent`

### 3. Frpc指令失败

**日志示例**:

```
还未下载Frpc库
```

**原因**: 未下载Frpc库

**解决**: 在App中下载Frpc库

### 4. 系统指令失败

**日志示例**:

```
设备未Root
```

**原因**: 设备没有Root权限

**解决**: Root设备或使用其他指令

---

## 使用场景示例

### 场景1: 远程查询短信

步骤：

1. 发送短信指令启动HTTP服务器：`smsf#httpserver#start`
2. 等待服务器启动（约5秒）
3. 通过HTTP API查询短信：POST请求 `/sms/query`

### 场景2: 远程找手机

步骤：

1. 发送短信指令开启WiFi：`smsf#wifi#on`
2. 发送短信指令启动位置服务：`smsf#httpserver#start`（需提前开启位置API）
3. 通过HTTP API查询位置：POST请求 `/location/query`

### 场景3: 远程控制另一台手机发送短信

步骤：

1. 发送短信指令：`smsf#sms#send#{"sim_slot":1,"phone_numbers":"目标号码","msg_content":"内容"}`

### 场景4: 远程开关内网穿透

步骤：

1. 需要时启动Frpc：`smsf#frpc#start`
2. 不需要时停止Frpc：`smsf#frpc#stop`

---

## 安全建议

1. **配置安全号码**: 只允许可信号码执行指令
2. **使用签名验证**: HTTP API开启签名验证，防止未授权访问
3. **定期检查日志**: 关注异常指令执行记录
4. **谨慎使用系统指令**: 重启/关机指令可能导致设备长时间不可用
