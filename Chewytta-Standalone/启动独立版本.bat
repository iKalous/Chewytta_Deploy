@echo off
chcp 65001 > nul
title Chewytta 独立版本启动器

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🚀 Chewytta 独立版本启动                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM 检查 JAR 文件是否存在
if not exist "target\Chewytta-0.0.1-SNAPSHOT-standalone.jar" (
    echo ❌ 错误：未找到构建产物文件
    echo.
    echo 📋 请先运行 "构建独立版本.bat" 构建项目
    echo.
    pause
    exit /b 1
)

echo 📋 启动信息：
echo    • JAR 文件：target\Chewytta-0.0.1-SNAPSHOT-standalone.jar
echo    • 访问地址：http://localhost:8080
echo    • 管理员账号：root / 123456
echo.

echo 🔧 检查 Java 环境...
java -version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未找到 Java 环境，请确保已安装 Java 8 或更高版本
    pause
    exit /b 1
)
echo ✅ Java 环境检查通过

echo.
echo 🚀 正在启动 Chewytta 独立版本...
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║ 提示：按 Ctrl+C 可停止应用                                  ║
echo ║ 浏览器访问：http://localhost:8080                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM 启动应用
java -jar target\Chewytta-0.0.1-SNAPSHOT-standalone.jar

echo.
echo 📋 应用已停止运行
pause
