@echo off
chcp 65001 >nul
echo ===============================================
echo    Chewytta File Access Test Script
echo ===============================================
echo.

echo [1/4] Testing backend API connection...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/login' -Method POST -ContentType 'application/json' -Body '{}' -UseBasicParsing; Write-Host 'Backend API accessible (Status code:' $response.StatusCode ')' } catch { Write-Host 'Backend API response:' $_.Exception.Response.StatusCode }"

echo.
echo [2/4] Testing frontend service...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost' -UseBasicParsing; Write-Host 'Frontend service accessible (Status code:' $response.StatusCode ')' } catch { Write-Host 'Frontend service error:' $_.Exception.Message }"

echo.
echo [3/4] Testing admin-content path proxy...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost/admin-content/' -UseBasicParsing; Write-Host 'admin-content path accessible (Status code:' $response.StatusCode ')' } catch { Write-Host 'admin-content response:' $_.Exception.Response.StatusCode }"

echo.
echo [4/4] Testing uploads path proxy...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost/uploads/' -UseBasicParsing; Write-Host 'uploads path accessible (Status code:' $response.StatusCode ')' } catch { Write-Host 'uploads path response:' $_.Exception.Response.StatusCode }"

echo.
echo ===============================================
echo    File Directory Check
echo ===============================================
echo AdminContent directory:
if exist "AdminContent" (
    echo AdminContent directory exists
    dir /AD AdminContent 2>nul | find /C "directories" >nul && echo    Contains subdirectories
) else (
    echo AdminContent directory does not exist
)

echo.
echo ChewyApp directory:
if exist "ChewyApp" (
    echo ChewyApp directory exists
    dir /AD ChewyApp 2>nul | find /C "directories" >nul && echo    Contains subdirectories
) else (
    echo ChewyApp directory does not exist
)

echo.
echo ===============================================
echo    Test Completed!
echo ===============================================
echo If you see errors, please check container status and configuration
echo Run docker-compose ps to view container status
echo Run docker-compose logs [service] to view logs
echo.
pause
