@echo off
chcp 65001 >nul
echo ===============================================
echo    Chewytta File Persistence Verification Tool
echo ===============================================
echo.

echo [1/5] Checking Docker container status...
docker-compose ps

echo.
echo [2/5] Checking container file mapping...
echo AdminContent mapping check:
docker exec chewytta-backend find /app/AdminContent -name "*.png" | wc -l
echo Container AdminContent PNG file count: ^

echo.
echo ChewyApp mapping check:
docker exec chewytta-backend find /app/ChewyApp -name "*.png" | wc -l
echo Container ChewyApp PNG file count: ^

echo.
echo [3/5] Checking host machine files...
echo AdminContent host file check:
if exist "AdminContent\boxes\covers" (
    powershell -Command "Get-ChildItem -Recurse -Include *.png AdminContent\boxes\covers | Measure-Object | Select-Object -ExpandProperty Count"
) else (
    echo 0
)

echo ChewyApp host file check:
if exist "ChewyApp\userdata\avatars" (
    powershell -Command "Get-ChildItem -Recurse -Include *.png ChewyApp\userdata\avatars | Measure-Object | Select-Object -ExpandProperty Count"
) else (
    echo 0
)

echo.
echo [4/5] Testing file creation sync...
echo Creating test files in container...
docker exec chewytta-backend touch /app/AdminContent/test-sync.txt
docker exec chewytta-backend touch /app/ChewyApp/test-sync.txt

timeout /t 2 /nobreak >nul

echo Checking if host machine has test files:
if exist "AdminContent\test-sync.txt" (
    echo AdminContent sync normal
    del "AdminContent\test-sync.txt" >nul 2>&1
) else (
    echo AdminContent sync failed
)

if exist "ChewyApp\test-sync.txt" (
    echo ChewyApp sync normal
    del "ChewyApp\test-sync.txt" >nul 2>&1
) else (
    echo ChewyApp sync failed
)

echo Cleaning test files in container...
docker exec chewytta-backend rm -f /app/AdminContent/test-sync.txt
docker exec chewytta-backend rm -f /app/ChewyApp/test-sync.txt

echo.
echo [5/5] Generating detailed report...
echo.
echo ===============================================
echo    File Persistence Status Report
echo ===============================================
echo Host directory mapping:
echo    AdminContent: %CD%\AdminContent
echo    ChewyApp:     %CD%\ChewyApp
echo.
echo Container directories:
echo    AdminContent: /app/AdminContent
echo    ChewyApp:     /app/ChewyApp
echo.
echo Troubleshooting tips:
echo    1. If file sync fails, check Docker Desktop file sharing settings
echo    2. If uploaded images disappear after restart, may be application config issue
echo    3. If browser shows 404/500, check nginx proxy configuration
echo    4. Run docker-compose logs backend to view backend logs
echo.
echo Check completed! Press any key to continue...
pause >nul
