# Todoist 克隆项目

这是一个全栈 Web 应用程序，旨在模仿 Todoist 的核心功能。它拥有一个使用 Node.js 构建的后端 API 和一个使用 React 构建的前端单页应用。

## 功能特性

- **用户认证**: 使用 JWT 实现安全的用户注册和登录。
- **任务管理**: 对任务进行完整的增删改查（CRUD）操作。
- **积分系统**: 用户完成任务可以获得积分。
- **前后端分离**: 采用现代化的解耦架构，将后端 API 与前端客户端分离。

---

## 技术栈

### 后端
- **运行环境**: Node.js
- **框架**: Express.js
- **数据库**: SQLite
- **ORM**: Prisma
- **认证**: JSON Web Tokens (JWT), 使用 bcryptjs 进行密码哈希

### 前端
- **框架**: React
- **构建工具**: Vite
- **API 通信**: Axios
- **路由**: React Router

---

## 项目设置与安装

请按照以下步骤在本地运行此项目。

### 环境要求

- [Node.js](https://nodejs.org/) (推荐 v18 或更高版本)
- [npm](https://www.npmjs.com/)

### 1. 克隆代码仓库

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. 后端设置

后端服务器位于项目的根目录。

**a. 安装依赖**
```bash
npm install
```

**b. 设置环境变量**

复制环境变量示例文件，并更新为您自己的密钥。

```bash
cp .env.example .env
```

打开 `.env` 文件，将 `YOUR_JWT_SECRET_HERE` 替换为一个长的、随机且安全的字符串。

**c. 运行数据库迁移**

Prisma 需要根据 schema 来设置 SQLite 数据库。

```bash
npx prisma migrate dev
```

此命令将创建 `prisma/dev.db` 文件及所有必需的数据表。

**d. 启动后端服务器**

```bash
npm run start # 或在开发时使用 'nodemon index.js'
```

后端 API 现在将运行在 `http://localhost:3000`。

### 3. 前端设置

前端应用程序位于 `frontend/` 目录中。

**a. 安装依赖**

进入前端目录并安装其依赖。

```bash
cd frontend
npm install
```

**b. 启动前端开发服务器**

```bash
npm run dev
```

前端应用程序现在将运行在 `http://localhost:5173` (或下一个可用端口)。Vite 开发服务器已预先配置，会将 API 请求代理到后端，因此不会有 CORS 跨域问题。

### 4. 访问应用程序

- 打开您的网络浏览器并访问 `http://localhost:5173`。
- 您应该会看到登录页面。
- 您可以注册一个新用户并开始使用该应用。

---

## API 端点

所有 API 端点都以 `/api` 为前缀。

### 认证 (`/api/auth`)
- `POST /register`: 创建一个新用户。
  - 请求体: `{ "email": "user@example.com", "password": "password123" }`
- `POST /login`: 登录用户并获取一个 JWT。
  - 请求体: `{ "email": "user@example.com", "password": "password123" }`

### 任务 (`/api/tasks`)
*所有任务相关的路由都需要在请求头中提供一个有效的 JWT (`Authorization: Bearer <token>`)*

- `GET /`: 获取认证用户的所有任务。
- `POST /`: 创建一个新任务。
  - 请求体: `{ "title": "我的新任务", "dueDate": "2024-12-31T23:59:59Z", "reminderTime": "2024-12-31T23:00:00Z", "points": 10 }`
- `PUT /:id`: 更新一个任务。
- `DELETE /:id`: 删除一个任务。
