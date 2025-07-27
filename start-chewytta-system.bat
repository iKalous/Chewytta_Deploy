@echo off
chcp 65001 >nul
echo ===============================================
echo    🚀 Chewytta 系统一键启动脚本
echo ===============================================
echo.

:: 检查Docker是否安装
echo [1/5] 检查Docker环境...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未检测到Docker！
    echo    请先安装Docker Desktop并确保其正在运行
    echo    下载地址：https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo ✅ Docker环境检查通过

:: 检查Docker是否运行
echo [2/5] 检查Docker服务状态...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：Docker服务未启动！
    echo    请启动Docker Desktop后重试
    pause
    exit /b 1
)
echo ✅ Docker服务正在运行

:: 停止可能存在的旧容器
echo [3/5] 清理旧的容器...
docker-compose down >nul 2>&1
echo ✅ 旧容器清理完成

:: 启动所有服务
echo [4/5] 启动Chewytta系统...
echo    正在构建和启动容器，首次运行可能需要几分钟...
docker-compose up -d --build
if %errorlevel% neq 0 (
    echo ❌ 启动失败！请检查错误信息
    pause
    exit /b 1
)

::  等待服务就绪
echo [5/5] 等待服务启动完成...
echo    正在等待数据库初始化...
timeout /t 15 /nobreak >nul

echo    正在检查后端API服务...
:check_backend
powershell -Command "try { $null = Test-NetConnection -ComputerName localhost -Port 8080 -InformationLevel Quiet; if ($?) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo    后端服务还在启动中，请稍候...
    timeout /t 5 /nobreak >nul
    goto check_backend
)
echo ✅ 后端API服务已就绪

echo    正在检查前端服务...
:check_frontend  
powershell -Command "try { $null = Test-NetConnection -ComputerName localhost -Port 80 -InformationLevel Quiet; if ($?) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo    前端服务还在启动中，请稍候...
    timeout /t 5 /nobreak >nul
    goto check_frontend
)
echo ✅ 前端服务已就绪

:: 检查服务状态
echo.
echo 📋 服务状态检查：
docker-compose ps

echo.
echo ===============================================
echo    🎉 Chewytta 系统启动成功！
echo ===============================================
echo.
echo 📝 访问信息：
echo    🌐 系统地址：http://localhost
echo    👤 管理员账号：root
echo    🔑 管理员密码：123456
echo.
echo 🔧 服务端口：
echo    前端服务：http://localhost (端口80)
echo    后端API：http://localhost:8080
echo    MySQL数据库：localhost:3306
echo    Redis缓存：localhost:6379
echo.
echo 💡 提示：
echo    - 首次启动可能需要等待1-2分钟完成初始化
echo    - 如需停止系统，请运行"stop-chewytta-system.bat"
echo    - 如遇问题，请查看操作指南或联系技术支持
echo.
echo 按任意键打开系统首页...
pause >nul

:: 打开浏览器前再确保服务稳定
echo 正在准备打开系统界面...
timeout /t 3 /nobreak >nul

:: 打开浏览器
start http://localhost

echo 系统已在浏览器中打开，祝您使用愉快！
timeout /t 3 >nul
