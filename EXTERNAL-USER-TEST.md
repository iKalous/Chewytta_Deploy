# 外部用户部署测试指南

## 🎯 模拟外部用户环境

为了确保别人下载你的系统后能够成功运行，请按以下步骤进行测试：

### 测试步骤 1：清理当前环境
```bash
# 停止所有容器
stop-chewytta-system.bat

# 删除构建产物（模拟新用户状态）
rmdir /s /q "Chewytta\target"
rmdir /s /q "chewytta_fronted\dist"
rmdir /s /q "chewytta_fronted\node_modules"
```

### 测试步骤 2：验证一键启动流程
```bash
# 直接运行启动脚本（应该自动检测并准备）
start-chewytta-system.bat
```

**预期行为：**
- 脚本应该检测到缺少 JAR 文件和 dist 目录
- 询问是否运行准备脚本
- 自动执行准备和启动流程

### 测试步骤 3：验证手动准备流程
```bash
# 手动运行准备脚本
prepare-for-deployment.bat

# 然后启动系统
start-chewytta-system.bat
```

## 🔍 外部用户常见问题测试

### 测试场景 1：网络环境差的用户
**模拟方法：** 断开网络或使用代理
**预期结果：** prepare-for-deployment.bat 应该能够处理网络问题

### 测试场景 2：Java/Node.js 版本不符
**模拟方法：** 临时修改 PATH 或使用旧版本
**预期结果：** 脚本应该给出明确的版本要求提示

### 测试场景 3：Docker 未安装/未启动
**模拟方法：** 停止 Docker Desktop
**预期结果：** start-chewytta-system.bat 应该给出明确的 Docker 要求

## 📋 外部用户文档检查清单

- [ ] README.md 包含系统要求
- [ ] QUICK-START.md 提供一键启动指南
- [ ] 脚本文件有中文友好的错误信息
- [ ] 所有必要的配置文件已包含
- [ ] Docker 配置使用离线模式

## 🚨 常见问题解决方案

### Maven 构建失败
**原因：** 网络依赖下载失败
**解决方案：** 使用 Dockerfile.simple 避免容器内构建

### 前端构建失败
**原因：** npm 依赖安装失败
**解决方案：** prepare-for-deployment.bat 会处理依赖安装

### 端口被占用
**原因：** 3000/8080/3306/6379 端口已被使用
**解决方案：** 修改 docker-compose.yml 端口配置

## 💡 发布前最终检查

1. **测试完整的外部用户流程**
2. **确认所有脚本能够处理错误情况**
3. **验证文档的准确性和完整性**
4. **测试在干净的 Windows 环境中运行**
