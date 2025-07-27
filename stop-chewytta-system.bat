@echo off
chcp 65001 >nul
echo ===============================================
echo    🛑 Chewytta 系统一键关闭脚本
echo ===============================================
echo.

:: 检查Docker是否安装
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未检测到Docker！
    pause
    exit /b 1
)

echo [1/3] 正在停止Chewytta系统...
docker-compose down

echo [2/3] 清理临时资源...
docker system prune -f >nul 2>&1

echo [3/3] 检查停止状态...
docker-compose ps

echo.
echo ===============================================
echo    ✅ Chewytta 系统已成功关闭！
echo ===============================================
echo.
echo 📋 系统状态：
echo    🔴 所有服务已停止
echo    🧹 临时资源已清理
echo    💾 数据已保存（下次启动时会自动恢复）
echo.
echo 💡 提示：
echo    - 系统数据已安全保存，下次启动时会自动恢复
echo    - 如需重新启动，请运行"start-chewytta-system.bat"
echo    - 如需完全清理（包括数据），请手动执行 docker-compose down -v
echo.
echo 感谢使用 Chewytta 系统！
pause
