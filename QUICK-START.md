# Chewytta 快速部署指南

## 🚀 一键启动（推荐）

如果你是第一次使用或者遇到任何问题，请按以下步骤操作：

### 步骤 1：运行准备脚本
```bash
prepare-for-deployment.bat
```

这个脚本会自动：
- 检查并构建后端 JAR 文件
- 检查并构建前端 dist 目录
- 创建必要的 Docker 配置文件

### 步骤 2：启动系统
```bash
start-chewytta-system.bat
```

## 📋 系统要求

在运行脚本之前，请确保你的系统已安装：

1. **Docker Desktop** - 用于容器化部署
2. **Java 17+** - 用于构建后端（如果 JAR 文件不存在）
3. **Node.js 18+** - 用于构建前端（如果 dist 目录不存在）

## 🔧 故障排除

### 问题 1：找不到 backend JAR 文件
**解决方案：** 运行 `prepare-for-deployment.bat`，它会自动构建 JAR 文件

### 问题 2：找不到 frontend dist 目录
**解决方案：** 运行 `prepare-for-deployment.bat`，它会自动构建前端资源

### 问题 3：Docker 构建失败
**错误信息：** `Could not transfer artifact...`
**解决方案：** 这是网络依赖问题，系统会自动使用离线模式构建

### 问题 4：容器无法启动
**解决方案：** 
1. 确保 Docker Desktop 正在运行
2. 运行 `stop-chewytta-system.bat` 清理旧容器
3. 重新运行 `start-chewytta-system.bat`

## 📁 文件说明

- `prepare-for-deployment.bat` - 部署准备脚本（解决构建依赖问题）
- `start-chewytta-system.bat` - 启动系统
- `stop-chewytta-system.bat` - 停止系统
- `build-deploy-package.bat` - 打包部署文件

## 🌐 访问系统

启动成功后，你可以访问：
- 前端应用：http://localhost:3000
- 后端 API：http://localhost:8080
- API 文档：http://localhost:8080/swagger-ui.html

## 💡 提示

1. **首次运行**：请先运行 `prepare-for-deployment.bat`
2. **网络问题**：如果遇到网络问题，系统会自动使用离线模式
3. **端口冲突**：如果端口被占用，请修改 `docker-compose.yml` 中的端口配置
