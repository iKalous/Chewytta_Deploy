@echo off
chcp 65001 > nul
title Chewytta 独立版本构建器

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🚀 Chewytta 独立版本构建                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📋 构建说明：
echo    • 此脚本将构建一个包含前端、后端和数据库的单文件部署包
echo    • 构建产物将使用 SQLite 数据库，无需外部依赖
echo    • 构建完成后，只需 Java 8+ 环境即可运行
echo.

echo 🔧 开始构建...
echo.

REM 检查 Java 环境
echo [1/4] 检查 Java 环境...
java -version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未找到 Java 环境，请确保已安装 Java 8 或更高版本
    pause
    exit /b 1
)
echo ✅ Java 环境检查通过

echo.
echo [2/4] 清理旧的构建产物...
if exist "target" (
    rmdir /s /q "target" > nul 2>&1
)
echo ✅ 清理完成

echo.
echo [3/4] 开始 Maven 构建...
echo    📦 正在安装前端依赖...
echo    🔨 正在构建前端应用...
echo    🚀 正在打包后端应用...
echo    （此过程可能需要几分钟，请耐心等待...）

REM 使用 Maven 构建项目，包含前端构建
call mvnw.cmd clean package -DskipTests -Dspring.profiles.active=standalone

if %errorlevel% neq 0 (
    echo.
    echo ❌ 构建失败！请检查错误信息
    pause
    exit /b 1
)

echo.
echo [4/4] 构建完成！

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                        🎉 构建成功！                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📂 构建产物位置：
echo    target\Chewytta-0.0.1-SNAPSHOT-standalone.jar
echo.

echo 🚀 启动方式：
echo    java -jar target\Chewytta-0.0.1-SNAPSHOT-standalone.jar
echo.

echo 📋 系统信息：
echo    • 访问地址：http://localhost:8080
echo    • 管理员账号：root
echo    • 管理员密码：123456
echo    • 数据库：SQLite（自动创建）
echo    • Redis：嵌入式（自动启动）
echo.

echo 💡 提示：
echo    • 首次启动时会自动创建数据库和初始数据
echo    • 数据库文件：chewytta.db
echo    • 日志文件：logs\chewytta-standalone.log
echo.

set /p choice="是否立即启动应用？(Y/N): "
if /i "%choice%"=="Y" (
    echo.
    echo 🚀 正在启动 Chewytta 独立版本...
    java -jar target\Chewytta-0.0.1-SNAPSHOT-standalone.jar
) else (
    echo.
    echo 💾 构建完成，可稍后手动启动应用
)

echo.
pause
