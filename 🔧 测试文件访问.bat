@echo off
chcp 65001 >nul
echo ===============================================
echo    🔧 Chewytta 文件访问测试脚本
echo ===============================================
echo.

echo [1/4] 测试后端API连接...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/login' -Method POST -ContentType 'application/json' -Body '{}' -UseBasicParsing; Write-Host '✅ 后端API可访问 (状态码:' $response.StatusCode ')' } catch { Write-Host '⚠️  后端API响应:' $_.Exception.Response.StatusCode }"

echo.
echo [2/4] 测试前端服务...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost' -UseBasicParsing; Write-Host '✅ 前端服务可访问 (状态码:' $response.StatusCode ')' } catch { Write-Host '❌ 前端服务错误:' $_.Exception.Message }"

echo.
echo [3/4] 测试admin-content路径代理...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost/admin-content/' -UseBasicParsing; Write-Host '✅ admin-content路径可访问 (状态码:' $response.StatusCode ')' } catch { Write-Host '⚠️  admin-content响应:' $_.Exception.Response.StatusCode }"

echo.
echo [4/4] 测试uploads路径代理...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost/uploads/' -UseBasicParsing; Write-Host '✅ uploads路径可访问 (状态码:' $response.StatusCode ')' } catch { Write-Host '⚠️  uploads路径响应:' $_.Exception.Response.StatusCode }"

echo.
echo ===============================================
echo    📋 文件目录检查
echo ===============================================
echo AdminContent目录:
if exist "AdminContent" (
    echo ✅ AdminContent 目录存在
    dir /AD AdminContent 2>nul | find /C "个目录" >nul && echo    包含子目录
) else (
    echo ❌ AdminContent 目录不存在
)

echo.
echo ChewyApp目录:
if exist "ChewyApp" (
    echo ✅ ChewyApp 目录存在
    dir /AD ChewyApp 2>nul | find /C "个目录" >nul && echo    包含子目录
) else (
    echo ❌ ChewyApp 目录不存在
)

echo.
echo ===============================================
echo    测试完成！
echo ===============================================
echo 如果看到❌错误，请检查容器状态和配置
echo 运行 docker-compose ps 查看容器状态
echo 运行 docker-compose logs [service] 查看日志
echo.
pause
