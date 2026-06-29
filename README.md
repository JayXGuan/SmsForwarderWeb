# SmsForwarder Web 管理端

基于 Next.js 和 SQLite 的短信转发设备管理平台。

## 功能特性

- 🔐 强登录认证（首次访问自动引导注册）
- 📱 多设备管理
- 📨 短信查询与发送
- 📞 通话记录查询
- 👤 联系人管理
- 🔋 电量状态监控
- 📍 位置信息查询
- 💻 WOL 远程唤醒

## 技术栈

- **前端**: Next.js 16+ (App Router)
- **样式**: Tailwind CSS
- **数据库**: SQLite (better-sqlite3)
- **语言**: TypeScript

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 初始化系统

首次访问时，系统会检测是否存在用户。如果没有用户，会自动显示"初始化系统"页面：

1. 输入管理员邮箱
2. 设置密码（至少6位）
3. 确认密码
4. 点击"创建管理员账户"

创建成功后会自动登录并跳转到主页。

### 4. 后续登录

系统初始化后，访问时会显示正常的登录页面，使用创建的管理员账户登录即可。

## 数据存储

数据存储在项目根目录的 `data/` 目录下：

- `data/sms_forwarder.db` - SQLite 数据库文件

数据库文件会被 `.gitignore` 忽略，不会提交到 Git。

## 数据库结构

系统会自动创建以下表：

### users（用户表）

| 字段       | 类型     | 说明                |
| ---------- | -------- | ------------------- |
| id         | INTEGER  | 主键                |
| email      | TEXT     | 邮箱（唯一）        |
| password   | TEXT     | 密码（bcrypt 哈希） |
| created_at | DATETIME | 创建时间            |

### devices（设备表）

| 字段          | 类型     | 说明                         |
| ------------- | -------- | ---------------------------- |
| id            | INTEGER  | 主键                         |
| name          | TEXT     | 设备名称                     |
| ip            | TEXT     | 设备 IP 地址                 |
| port          | INTEGER  | 端口号（默认 5000）          |
| sign_key      | TEXT     | 签名密钥（可选）             |
| security_mode | INTEGER  | 安全模式（0=无, 1=签名验证） |
| user_id       | INTEGER  | 所属用户 ID                  |
| created_at    | DATETIME | 创建时间                     |

### sessions（会话表）

| 字段       | 类型     | 说明               |
| ---------- | -------- | ------------------ |
| id         | TEXT     | Session ID（UUID） |
| user_id    | INTEGER  | 用户 ID            |
| expires_at | DATETIME | 过期时间（7天）    |
| created_at | DATETIME | 创建时间           |

## 项目结构

```
SmsForwarderWeb/
├── data/                   # SQLite 数据库目录（gitignore）
│   └── sms_forwarder.db    # 数据库文件
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── login/          # 登录/初始化页面
│   │   ├── devices/[id]/   # 设备详情页
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页（设备列表）
│   ├── components/         # React 组件
│   │   ├── devices/        # 设备相关组件
│   │   └── shared/         # 共享组件
│   ├── actions/            # Server Actions
│   │   ├── auth.ts         # 认证相关
│   │   ├── devices.ts      # 设备管理
│   │   └── deviceApi.ts    # 设备 API 调用
│   ├── lib/                # 工具库
│   │   └── db.ts           # SQLite 数据库模块
│   └── types/              # TypeScript 类型定义
│       └── index.ts
└── ...
```

## API 功能

本管理端支持以下 SmsForwarder API 功能：

| API               | 功能            | 方法 |
| ----------------- | --------------- | ---- |
| `/config/query`   | 查询服务器配置  | POST |
| `/sms/send`       | 发送短信        | POST |
| `/sms/query`      | 查询短信        | POST |
| `/call/query`     | 查询通话记录    | POST |
| `/contact/query`  | 查询联系人      | POST |
| `/contact/add`    | 添加联系人      | POST |
| `/battery/query`  | 查询电量        | POST |
| `/location/query` | 查询位置        | POST |
| `/wol/send`       | 发送 WOL 唤醒包 | POST |

## 安全模式

支持两种安全模式：

- **模式 0**: 无安全措施（明文传输）
- **模式 1**: 签名验证（HmacSHA256）

## 开发说明

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 许可证

MIT License
