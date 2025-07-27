@echo off
chcp 65001 >nul
echo ===============================================
echo    📦 Chewytta 部署包打包工具
echo ===============================================
echo.

:: 检查是否存在7zip或winrar
echo [1/3] 检查压缩工具...
where 7z >nul 2>&1
if %errorlevel% equ 0 (
    set COMPRESSOR=7z
    echo ✅ 发现 7-Zip
    goto :compress
)

where winrar >nul 2>&1
if %errorlevel% equ 0 (
    set COMPRESSOR=winrar
    echo ✅ 发现 WinRAR
    goto :compress
)

echo ❌ 未找到压缩工具
echo    请安装 7-Zip 或 WinRAR 后重试
pause
exit /b 1

:compress
echo [2/3] 开始打包...

:: 设置输出文件名
set DATETIME=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set DATETIME=%DATETIME: =0%
set OUTPUT=Chewytta-Docker-Deploy-%DATETIME%.zip

if "%COMPRESSOR%"=="7z" (
    7z a -tzip "%OUTPUT%" * -x!*.bat
) else (
    winrar a -afzip "%OUTPUT%" * -x*.bat
)

if %errorlevel% equ 0 (
    echo ✅ 打包完成: %OUTPUT%
) else (
    echo ❌ 打包失败
    pause
    exit /b 1
)

echo [3/3] 清理临时文件...
echo ✅ 清理完成

echo.
echo ===============================================
echo    🎉 打包成功！
echo ===============================================
echo.
echo 📦 输出文件: %OUTPUT%
echo 📁 文件位置: %cd%
echo.
echo 💡 提示：
echo    - 可以将此压缩包分享给其他用户
echo    - 解压后运行"🚀 一键启动 Chewytta 系统.bat"即可使用
echo    - 确保目标机器已安装Docker Desktop
echo.
pause
