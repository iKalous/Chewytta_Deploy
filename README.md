# 🎯 Chewytta 系统 Docker 部署指南

## 📋 目录
- [系统简介](#系统简介)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [详细使用说明](#详细使用说明)
- [系统架构](#系统架构)
- [常见问题](#常见问题)
- [技术支持](#技术支持)

---

## 🌟 系统简介

Chewytta 是一个现代化的盲盒管理系统，采用前后端分离架构，支持用户注册、盲盒抽取、收藏管理等功能。

### 🏗️ 技术栈
- **前端**: React + TypeScript + Vite + Tailwind CSS
- **后端**: Spring Boot 3.3.13 + Java 17
- **数据库**: MySQL 8.0
- **缓存**: Redis
- **容器化**: Docker + Docker Compose
- **Web服务器**: Nginx

---

## 💻 环境要求

### 🖥️ 系统要求
- **操作系统**: Windows 10/11 (64位)
- **内存**: 至少 4GB RAM (推荐 8GB+)
- **硬盘**: 至少 2GB 可用空间
- **网络**: 稳定的互联网连接 (首次启动需要下载镜像)

### 🛠️ 必需软件
1. **Docker Desktop for Windows**
   - 下载地址: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - 版本要求: 4.0+ (支持 Docker Compose V2)
   - ⚠️ **重要**: 安装后请确保 Docker Desktop 正在运行

### 🔧 可选软件
- **浏览器**: Chrome、Firefox、Edge 等现代浏览器
- **文本编辑器**: 用于查看日志或修改配置

---

## 🚀 快速开始

### 📦 第一步：下载部署包
1. 将整个 `Chewytta-Docker-Deploy` 文件夹复制到您的电脑上
2. 确保所有文件完整，包括：
   - `🚀 一键启动 Chewytta 系统.bat`
   - `🛑 一键关闭 Chewytta 系统.bat`
   - `docker-compose.yml`
   - `README.md` (本文件)
   - 其他相关文件夹

### 🏃‍♂️ 第二步：启动系统
1. **双击运行** `🚀 一键启动 Chewytta 系统.bat`
2. 等待脚本自动完成以下操作：
   - ✅ 检查 Docker 环境
   - ✅ 清理旧容器
   - ✅ 下载和构建镜像 (首次运行约5-10分钟)
   - ✅ 启动所有服务
   - ✅ 验证服务状态

### 🌐 第三步：访问系统
启动完成后，系统会自动打开浏览器访问 `http://localhost`

**默认管理员账号:**
- 用户名: `root`
- 密码: `123456`

---

## 📚 详细使用说明

### 🎮 系统功能
1. **用户管理**
   - 用户注册和登录
   - 个人资料管理
   - 头像上传

2. **盲盒系统**
   - 盲盒商品展示
   - 在线抽取体验
   - 抽取记录查看

3. **收藏系统**
   - 收藏心仪商品
   - 收藏列表管理

4. **管理后台**
   - 商品管理
   - 用户管理
   - 数据统计

### 🔧 系统管理

#### 启动系统
```bash
# 方法一：使用批处理脚本 (推荐)
双击: 🚀 一键启动 Chewytta 系统.bat

# 方法二：使用命令行
docker-compose up -d --build
```

#### 停止系统
```bash
# 方法一：使用批处理脚本 (推荐)
双击: 🛑 一键关闭 Chewytta 系统.bat

# 方法二：使用命令行
docker-compose down
```

#### 查看系统状态
```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs [service_name]
# 例如: docker-compose logs frontend
```

#### 重启特定服务
```bash
# 重启前端
docker-compose restart frontend

# 重启后端
docker-compose restart backend

# 重启数据库
docker-compose restart mysql
```

---

## 🏛️ 系统架构

### 🐳 Docker 容器组成
| 容器名称 | 镜像 | 端口 | 功能描述 |
|---------|------|------|----------|
| chewytta-frontend | nginx:latest | 80 | 前端服务 + 反向代理 |
| chewytta-backend | openjdk:17-jdk-slim | 8080 | 后端 API 服务 |
| chewytta-mysql | mysql:8.0 | 3306 | 数据库服务 |
| chewytta-redis | redis:latest | 6379 | 缓存服务 |

### 🌐 网络架构
```
用户浏览器 (80) 
    ↓
Nginx 前端容器 (80)
    ├── 静态文件服务
    ├── API 代理 → 后端容器 (8080)
    └── 资源代理 → 后端容器 (8080)
             ↓
    Spring Boot 后端 (8080)
         ├── MySQL 数据库 (3306)
         └── Redis 缓存 (6379)
```

### 📁 数据持久化
- **MySQL 数据**: `./mysql-data` (数据库文件)
- **上传文件**: `./AdminContent` (用户上传的图片)
- **应用数据**: `./ChewyApp` (应用配置和缓存)

---

## ❓ 常见问题

### 🚨 启动失败问题

#### Q1: "未检测到Docker"
**解决方案:**
1. 下载并安装 Docker Desktop
2. 启动 Docker Desktop 并等待完全启动
3. 重新运行启动脚本

#### Q2: "Docker服务未启动"
**解决方案:**
1. 打开 Docker Desktop
2. 等待状态显示为 "Engine running"
3. 重新运行启动脚本

#### Q3: 端口被占用
**解决方案:**
```bash
# 检查端口占用
netstat -ano | findstr :80
netstat -ano | findstr :3306
netstat -ano | findstr :6379

# 停止占用进程或修改 docker-compose.yml 中的端口配置
```

### 🐛 运行时问题

#### Q4: 网页打不开或显示 502 错误
**解决方案:**
1. 等待 2-3 分钟 (服务可能还在启动)
2. 检查容器状态: `docker-compose ps`
3. 查看日志: `docker-compose logs`

#### Q5: 数据库连接失败
**解决方案:**
1. 确认 MySQL 容器正常运行
2. 检查数据库日志: `docker-compose logs mysql`
3. 重启数据库容器: `docker-compose restart mysql`

#### Q6: 图片上传后无法显示
**解决方案:**
1. 检查 AdminContent 文件夹权限
2. 重启前端容器: `docker-compose restart frontend`
3. 清除浏览器缓存

### 🔧 维护操作

#### 完全重置系统 (清除所有数据)
```bash
# ⚠️ 警告：此操作会删除所有用户数据
docker-compose down -v
docker system prune -a -f
```

#### 备份数据
```bash
# 备份数据库
docker exec chewytta-mysql mysqldump -u root -proot chewytta > backup.sql

# 备份上传文件
copy /Y AdminContent backup-AdminContent
```

#### 更新系统
```bash
# 停止系统
docker-compose down

# 拉取最新镜像
docker-compose pull

# 重新构建并启动
docker-compose up -d --build
```

---

## 📞 技术支持

### 🔍 日志查看
```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs frontend
docker-compose logs backend
docker-compose logs mysql
docker-compose logs redis

# 实时查看日志
docker-compose logs -f [service_name]
```

### 📊 系统监控
```bash
# 查看容器资源使用情况
docker stats

# 查看磁盘使用情况
docker system df
```

### 🆘 获取帮助
如果遇到无法解决的问题，请提供以下信息：
1. 错误截图或错误信息
2. 系统版本信息
3. Docker 版本: `docker --version`
4. 容器状态: `docker-compose ps`
5. 相关日志: `docker-compose logs`

---

## 📄 版本信息

- **Chewytta 版本**: 1.0.0
- **构建日期**: 2025-07-27
- **Docker Compose 版本**: 3.8+
- **支持系统**: Windows 10/11

---

## 📜 许可证

本项目遵循相关开源协议，具体请查看项目源码中的 LICENSE 文件。

---

**🎉 祝您使用愉快！如有问题欢迎反馈！**
