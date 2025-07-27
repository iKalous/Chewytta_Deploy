@echo off
chcp 65001 >nul
echo ===============================================
echo    🔧 Chewytta 系统环境检查工具
echo ===============================================
echo.

:: 检查操作系统
echo [1/6] 检查操作系统版本...
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
echo ✅ Windows %VERSION%

:: 检查Docker安装
echo [2/6] 检查Docker安装...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker未安装或未添加到PATH
    echo    请下载安装Docker Desktop: https://www.docker.com/products/docker-desktop
    goto :end
) else (
    for /f "tokens=3" %%i in ('docker --version') do echo ✅ Docker %%i 已安装
)

:: 检查Docker服务
echo [3/6] 检查Docker服务状态...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker服务未启动
    echo    请启动Docker Desktop
    goto :end
) else (
    echo ✅ Docker服务正在运行
)

:: 检查端口占用
echo [4/6] 检查端口占用情况...
netstat -an | findstr ":80 " >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口80被占用，可能会影响前端服务
) else (
    echo ✅ 端口80可用
)

netstat -an | findstr ":3306 " >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口3306被占用，可能会影响MySQL服务
) else (
    echo ✅ 端口3306可用
)

netstat -an | findstr ":6379 " >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口6379被占用，可能会影响Redis服务
) else (
    echo ✅ 端口6379可用
)

:: 检查磁盘空间
echo [5/6] 检查磁盘空间...
for /f "tokens=3" %%i in ('dir /-c %cd% 2^>nul ^| findstr "bytes free"') do (
    set FREESPACE=%%i
)
if defined FREESPACE (
    echo ✅ 磁盘空间充足
) else (
    echo ⚠️  无法检查磁盘空间
)

:: 检查内存
echo [6/6] 检查系统内存...
for /f "skip=1 tokens=4" %%i in ('wmic computersystem get TotalPhysicalMemory') do (
    if not "%%i"=="" (
        set /a MEMORY=%%i/1024/1024/1024
        goto :memory_done
    )
)
:memory_done
if %MEMORY% GEQ 4 (
    echo ✅ 系统内存: %MEMORY%GB （推荐4GB+）
) else (
    echo ⚠️  系统内存: %MEMORY%GB （建议至少4GB）
)

echo.
echo ===============================================
echo    📋 环境检查完成
echo ===============================================
echo.
echo 💡 建议：
echo    - 如有端口冲突，请先停止占用服务
echo    - 确保Docker Desktop正在运行
echo    - 关闭不必要的程序释放内存
echo.

:end
pause
