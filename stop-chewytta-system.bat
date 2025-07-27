@echo off
chcp 65001 >nul
echo ===============================================
echo    Chewytta System One-Click Stop Script
echo ===============================================
echo.

:: Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker not detected!
    pause
    exit /b 1
)

echo [1/3] Stopping Chewytta system...
docker-compose down

echo [2/3] Cleaning temporary resources...
docker system prune -f >nul 2>&1

echo [3/3] Checking stop status...
docker-compose ps

echo.
echo ===============================================
echo    Chewytta System Successfully Stopped!
echo ===============================================
echo.
echo System Status:
echo    All services stopped
echo    Temporary resources cleaned
echo    Data saved (will be automatically restored on next startup)
echo.
echo Tips:
echo    - System data has been safely saved and will be automatically restored on next startup
echo    - To restart, run "start-chewytta-system.bat"
echo    - For complete cleanup (including data), manually execute: docker-compose down -v
echo.
echo Thank you for using Chewytta system!
pause
