@echo off
chcp 65001 >nul
echo ===============================================
echo    🔄 Chewytta 文件持久化验证工具
echo ===============================================
echo.

echo [1/5] 检查Docker容器状态...
docker-compose ps

echo.
echo [2/5] 检查容器内文件映射...
echo AdminContent映射检查:
docker exec chewytta-backend find /app/AdminContent -name "*.png" | wc -l
echo 容器内AdminContent PNG文件数量: ^

echo.
echo ChewyApp映射检查:
docker exec chewytta-backend find /app/ChewyApp -name "*.png" | wc -l
echo 容器内ChewyApp PNG文件数量: ^

echo.
echo [3/5] 检查宿主机文件...
echo AdminContent宿主机文件检查:
if exist "AdminContent\boxes\covers" (
    powershell -Command "Get-ChildItem -Recurse -Include *.png AdminContent\boxes\covers | Measure-Object | Select-Object -ExpandProperty Count"
) else (
    echo 0
)

echo ChewyApp宿主机文件检查:
if exist "ChewyApp\userdata\avatars" (
    powershell -Command "Get-ChildItem -Recurse -Include *.png ChewyApp\userdata\avatars | Measure-Object | Select-Object -ExpandProperty Count"
) else (
    echo 0
)

echo.
echo [4/5] 测试文件创建同步...
echo 在容器内创建测试文件...
docker exec chewytta-backend touch /app/AdminContent/test-sync.txt
docker exec chewytta-backend touch /app/ChewyApp/test-sync.txt

timeout /t 2 /nobreak >nul

echo 检查宿主机是否有测试文件:
if exist "AdminContent\test-sync.txt" (
    echo ✅ AdminContent 同步正常
    del "AdminContent\test-sync.txt" >nul 2>&1
) else (
    echo ❌ AdminContent 同步失败
)

if exist "ChewyApp\test-sync.txt" (
    echo ✅ ChewyApp 同步正常
    del "ChewyApp\test-sync.txt" >nul 2>&1
) else (
    echo ❌ ChewyApp 同步失败
)

echo 清理容器内测试文件...
docker exec chewytta-backend rm -f /app/AdminContent/test-sync.txt
docker exec chewytta-backend rm -f /app/ChewyApp/test-sync.txt

echo.
echo [5/5] 生成详细报告...
echo.
echo ===============================================
echo    📊 文件持久化状态报告
echo ===============================================
echo 🗂️  宿主机目录映射:
echo    AdminContent: %CD%\AdminContent
echo    ChewyApp:     %CD%\ChewyApp
echo.
echo 🐳 容器内目录:
echo    AdminContent: /app/AdminContent
echo    ChewyApp:     /app/ChewyApp
echo.
echo 💡 故障排除提示:
echo    1. 如果文件同步失败，请检查Docker Desktop的文件共享设置
echo    2. 如果上传的图片重启后消失，可能是应用配置问题
echo    3. 如果浏览器显示404/500，检查nginx代理配置
echo    4. 运行 docker-compose logs backend 查看后端日志
echo.
echo 📋 检查完成！按任意键继续...
pause >nul
