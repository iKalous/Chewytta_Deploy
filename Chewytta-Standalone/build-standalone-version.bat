@echo off
chcp 65001 >nul 2>&1
title 构建 Chewytta 独立版本

echo ========================================
echo    🔨 构建 Chewytta 独立版本
echo ========================================
echo.

echo 🔧 第1步：准备前端资源...
cd /d "d:\2025\hw\Chewytta\chewytta_fronted"
if not exist "dist" (
    echo ⚠️  前端未构建，开始构建前端...
    call npm install
    call npm run build
    if %errorlevel% neq 0 (
        echo ❌ 前端构建失败
        pause
        exit /b 1
    )
) else (
    echo ✅ 前端资源已存在
)

echo.
echo 🔧 第2步：复制前端资源到后端...
cd /d "d:\2025\hw\Chewytta\Chewytta"
if not exist "src\main\resources\static" mkdir "src\main\resources\static"
xcopy "..\chewytta_fronted\dist\*" "src\main\resources\static\" /E /Y /Q
echo ✅ 前端资源复制完成

echo.
echo 🔧 第3步：使用简化配置构建后端...
mvn clean package -f pom-simple.xml -DskipTests
if %errorlevel% neq 0 (
    echo ❌ 后端构建失败
    pause
    exit /b 1
)

echo.
echo 🔧 第4步：复制构建产物到独立包...
copy "target\Chewytta-0.0.1-SNAPSHOT.jar" "..\Chewytta-Standalone\" /Y

echo.
echo ========================================
echo 🎉 独立版本构建完成！
echo ========================================
echo.
echo 📁 独立包位置: ..\Chewytta-Standalone\
echo 🚀 双击 "启动 Chewytta 系统.bat" 即可运行
echo.
pause
