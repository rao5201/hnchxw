# hnchxw

海南茶海虾王管理有限责任公司官方网站

https://hnchxw.pages.dev/

---

# 🍵 海南茶海虾王管理有限责任公司 - 游戏项目

这是"茶海虾王"项目的完整源码库，采用 **PWA + Cocos Creator** 混合架构开发。

---

## 📦 项目结构

- **Lobby_Module/**: 游戏大厅 (Cocos Creator 项目)
- **Xinyu_Web/**: 茶海心遇模块 (PWA 单页应用)
- **MainWebsite/**: 主网站 (宣传网站)
- **Backend/**: 后端服务 (Express + 多数据库架构)
- **ico/**: 品牌Logo和图标资源

---

## 🚀 快速启动

### 1. 后端服务

```bash
cd Backend
npm install
# 创建 .env 文件并填入数据库配置
npm start
```

### 2. 前端网站

```bash
# 主网站
open index.html

# 或使用 Live Server
npx live-server --port=5500
```

---

## 🗓️ 更新日志

### 2026-03-31

#### ✨ 新增功能
- **多数据库架构**: 集成 CockroachDB + TiDB Cloud + Neon + Railway
  - CockroachDB: 即时数据处理
  - TiDB Cloud: 日备份数据存储（替代Supabase/PlanetScale）
  - Neon: 备份数据存储
  - Railway: 临时数据存储
- **邮件验证码服务**: 集成 Nodemailer，支持126邮箱
- **API测试脚本**: 创建自动化测试脚本 `test-api.js`
- **部署配置**: 添加 Vercel 和 Netlify 部署配置

#### 🔧 技术改进
- 替换 Supabase 为 TiDB Cloud（解决中国地区访问问题）
- 优化数据库连接池管理
- 添加智能故障转移机制
- 完善错误处理和日志记录

#### 📚 文档更新
- 创建详细的部署指南 `DEPLOY.md`
- 更新环境变量配置说明
- 添加 API 接口测试文档

### 2026-03-30

#### ✨ 新增功能
- **统一登录接口**: 支持手机号、邮箱、社交登录
- **主网站**: 创建宣传网站 `index.html`
- **品牌Logo**: 替换所有网站的品牌Logo
- **用户文档**: 添加使用说明、软件帮助、版本日志

#### 🔧 技术改进
- 集成 Twilio 短信服务（可选）
- 添加 IP 风控机制
- 实现验证码倒计时功能
- 优化响应式设计

### 2026-03-29

#### ✨ 初始版本
- 项目初始化
- 创建基础项目结构
- 集成 Cocos Creator 游戏大厅
- 创建茶海心遇 PWA 应用

---

## 🛠️ 技术栈

### 后端
- **框架**: Express.js
- **数据库**: 
  - CockroachDB (PostgreSQL)
  - TiDB Cloud (MySQL兼容)
  - Neon (PostgreSQL)
  - Railway (PostgreSQL)
- **邮件服务**: Nodemailer
- **短信服务**: Twilio (可选)
- **部署**: Vercel / Netlify

### 前端
- **游戏引擎**: Cocos Creator
- **Web应用**: PWA (Progressive Web App)
- **样式**: CSS3 + 响应式设计
- **部署**: Cloudflare Pages

---

## 📋 API 接口文档

### 认证接口

#### 发送邮箱验证码
```http
POST /api/auth/send-email
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### 发送短信验证码
```http
POST /api/auth/send-sms
Content-Type: application/json

{
  "phone": "13800138000"
}
```

#### 注册/登录
```http
POST /api/auth/register
Content-Type: application/json

{
  "type": "email",  // 或 "phone", "wechat", "alipay", "douyin"
  "identifier": "user@example.com",
  "code": "123456",
  "source_platform": "email"
}
```

#### 社交登录
```http
POST /api/auth/social
Content-Type: application/json

{
  "platform": "wechat",
  "code": "auth_code"
}
```

---

## 🔧 环境变量配置

创建 `.env` 文件：

```env
# 数据库连接配置
COCKROACHDB_URL="postgresql://root:password@host:26257/defaultdb?sslmode=verify-full"
TIDB_HOST="gateway01.ap-southeast-1.prod.aws.tidbcloud.com"
TIDB_PORT="4000"
TIDB_USER="username.root"
TIDB_PASSWORD="password"
TIDB_DATABASE="test"
NEON_URL="postgresql://user:password@host.neon.tech/db?sslmode=require"
RAILWAY_URL="postgresql://user:password@host.railway.app:5432/railway"

# 邮件服务配置
EMAIL_SERVICE="126"
EMAIL_USER="your-email@126.com"
EMAIL_PASSWORD="your-authorization-code"

# JWT密钥
JWT_SECRET="your-secret-key"

# 端口
PORT=3001
```

---

## 🧪 测试

运行自动化测试：

```bash
cd Backend
node test-api.js
```

---

## 🚀 部署

### 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
cd Backend
vercel --prod
```

### 部署到 Netlify

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 登录
netlify login

# 部署
cd Backend
netlify deploy --prod
```

---

## 📞 技术支持

- **邮箱**: rao201@126.com
- **地址**: 海南省海口市
- **GitHub**: https://github.com/rao5201/hnchxw

---

## 📄 许可证

© 2026 海南茶海虾王管理有限责任公司 版权所有
