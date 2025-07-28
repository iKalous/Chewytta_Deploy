# 🎯 Chewytta 独立版本

> **单文件部署版本** - 包含前端、后端、数据库的完整应用

## 📋 简介

Chewytta 独立版本是一个**完全自包含**的盲盒抽取系统，专为**快速部署**和**学术演示**设计。

### ✨ 特性

- 🚀 **单文件部署** - 仅需一个 JAR 文件
- 💾 **嵌入式数据库** - 使用 SQLite，无需外部数据库
- 🔧 **嵌入式缓存** - 内置 Redis，无需外部缓存服务
- 🎨 **集成前端** - React 前端已打包到 JAR 中
- ⚡ **即开即用** - 仅需 Java 运行环境

## 🛠️ 系统要求

- **Java 8+** （推荐 Java 11 或更高版本）
- **内存**: 最少 512MB，推荐 1GB+
- **磁盘**: 最少 100MB 可用空间

## 🚀 快速开始

### 1️⃣ 构建应用

```bash
# 运行构建脚本
./构建独立版本.bat

# 或者使用 Maven 命令
./mvnw clean package -DskipTests -Dspring.profiles.active=standalone
```

### 2️⃣ 启动应用

```bash
# 使用启动脚本
./启动独立版本.bat

# 或者直接运行 JAR
java -jar target/Chewytta-0.0.1-SNAPSHOT-standalone.jar
```

### 3️⃣ 访问系统

- **前端地址**: http://localhost:8080
- **管理员账号**: `root`
- **管理员密码**: `123456`

## 📁 文件结构

```
Chewytta-Standalone/
├── src/                          # 源代码
│   ├── main/
│   │   ├── java/                 # Java 源码
│   │   └── resources/
│   │       ├── application-standalone.yml  # 独立版本配置
│   │       ├── schema-sqlite.sql           # SQLite 数据库架构
│   │       └── data-sqlite.sql             # 初始数据
├── target/
│   └── Chewytta-0.0.1-SNAPSHOT-standalone.jar  # 构建产物
├── logs/                         # 日志文件（运行时生成）
├── chewytta.db                   # SQLite 数据库（运行时生成）
├── 构建独立版本.bat               # 构建脚本
├── 启动独立版本.bat               # 启动脚本
└── README.md                     # 本文档
```

## ⚙️ 配置说明

### 数据库配置

- **类型**: SQLite
- **文件位置**: `./chewytta.db`
- **自动创建**: 首次启动时自动创建表结构和初始数据

### 缓存配置

- **类型**: 嵌入式 Redis
- **端口**: 6379
- **自动启动**: 随应用启动，无需外部 Redis 服务

### 文件上传

- **上传目录**: `./uploads/`
- **最大文件大小**: 50MB
- **支持格式**: jpg, jpeg, png, gif, bmp, webp

## 🔧 开发说明

### 构建流程

1. **前端构建** - 使用 Vite 构建 React 应用
2. **资源复制** - 将前端构建产物复制到 JAR 的 static 目录
3. **后端打包** - 使用 Spring Boot Maven 插件打包
4. **依赖嵌入** - 将 SQLite 和嵌入式 Redis 打包进 JAR

### 关键组件

- **SQLiteDialect** - Hibernate SQLite 方言
- **EmbeddedRedisConfig** - 嵌入式 Redis 配置
- **DefaultUserInitService** - 用户初始化服务

## 🐛 故障排除

### 常见问题

1. **端口被占用**
   ```
   错误: Port 8080 is already in use
   解决: 修改 application-standalone.yml 中的 server.port
   ```

2. **内存不足**
   ```
   错误: OutOfMemoryError
   解决: 启动时增加内存参数
   java -Xmx1g -jar target/Chewytta-0.0.1-SNAPSHOT-standalone.jar
   ```

3. **数据库文件权限**
   ```
   错误: Unable to create database file
   解决: 确保当前目录有写入权限
   ```

### 日志调试

- **日志文件**: `./logs/chewytta-standalone.log`
- **控制台输出**: 启动时实时显示关键信息

## 📊 性能建议

- **推荐内存**: 1GB+
- **并发用户**: 适合 < 100 并发用户
- **数据规模**: 适合中小型数据集

## 🔒 安全说明

- 默认管理员密码为 `123456`，**生产环境请及时修改**
- SQLite 数据库文件包含敏感信息，请妥善保管
- 建议在生产环境中配置 HTTPS

## 📝 版本信息

- **版本**: 0.0.1-SNAPSHOT
- **构建日期**: 2025-01-XX
- **Java 版本**: 11+
- **Spring Boot**: 3.3.13

## 🤝 技术支持

如遇问题，请检查：
1. Java 版本是否符合要求
2. 端口 8080 是否被占用
3. 当前目录是否有写入权限
4. 日志文件中的错误信息

---

**Chewytta 独立版本** - 让盲盒抽取系统的部署变得简单快捷！ 🎉
