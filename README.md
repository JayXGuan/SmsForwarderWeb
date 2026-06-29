# SmsForwarder Web 管理端

基于 Next.js 和 PocketBase 的短信转发设备管理平台。

## 功能特性

- 🔐 强登录认证（基于 PocketBase）
- 📱 多设备管理
- 📨 短信查询与发送
- 📞 通话记录查询
- 👤 联系人管理
- 🔋 电量状态监控
- 📍 位置信息查询
- 💻 WOL 远程唤醒

## 技术栈

- **前端**: Next.js 14+ (App Router)
- **样式**: Tailwind CSS
- **后端**: PocketBase
- **语言**: TypeScript

## 快速开始

### 1. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 2. 启动开发服务器

本项目已集成 PocketBase，启动时会自动下载并运行 PocketBase 服务：

```bash
npm run dev
```

此命令会同时启动：

- **Next.js** 开发服务器 (端口 3000)
- **PocketBase** 服务 (端口 8090)

首次运行时，脚本会自动下载适合您系统的 PocketBase 可执行文件。

### 3. 配置 PocketBase

访问 `http://127.0.0.1:8090/_/` 进入管理后台，完成以下配置：

#### 创建用户集合 (users)

在 Collections 中创建 `users` 集合（如果不存在）。

#### 创建设备集合 (devices)

创建 `devices` 集合，字段如下：

| 字段名        | 类型     | 说明                       |
| ------------- | -------- | -------------------------- |
| name          | text     | 设备名称                   |
| ip            | text     | 设备 IP 地址               |
| port          | number   | 端口号，默认 5000          |
| sign_key      | text     | 签名密钥（可选）           |
| security_mode | number   | 安全模式：0=无, 1=签名验证 |
| user          | relation | 关联用户                   |

### 4. 配置环境变量（可选）

如果 PocketBase 运行在其他地址，创建 `.env.local` 文件：

```env
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

### 单独启动服务

如果需要单独启动某个服务：

```bash
# 只启动 Next.js
npm run dev:next

# 只启动 PocketBase (macOS/Linux)
npm run dev:pocketbase

# 只启动 PocketBase (Windows)
npm run dev:pocketbase:win
```

访问 `http://localhost:3000` 查看 Next.js 应用。
访问 `http://127.0.0.1:8090/_/` 查看 PocketBase 管理后台。

## 项目结构

```
SmsForwarderWeb/
├── pb/                     # PocketBase 可执行文件目录 (gitignore)
├── pb_data/                # PocketBase 数据目录 (gitignore)
├── scripts/                # 启动脚本
│   ├── start-pocketbase.sh # macOS/Linux 启动脚本
│   └── start-pocketbase.bat# Windows 启动脚本
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── login/          # 登录页面
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
│   │   └── pocketbase.ts   # PocketBase 客户端
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
