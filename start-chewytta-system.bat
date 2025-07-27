@echo off
chcp 65001 >nul
echo ===============================================
echo    Chewytta System One-Click Start Script
echo ===============================================
echo.

:: Check if Docker is installed
echo [1/5] Checking Docker environment...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker not detected!
    echo    Please install Docker Desktop first and ensure it's running
    echo    Download: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo Docker environment check passed

:: Check if Docker is running
echo [2/5] Checking Docker service status...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker service not started!
    echo    Please start Docker Desktop and try again
    pause
    exit /b 1
)
echo Docker service is running

:: Stop existing containers if any
echo [3/5] Cleaning old containers...
docker-compose down >nul 2>&1
echo Old container cleanup completed

:: Start all services
echo [4/5] Starting Chewytta system...
echo    Building and starting containers, first run may take several minutes...
docker-compose up -d --build
if %errorlevel% neq 0 (
    echo Startup failed! Please check error messages
    pause
    exit /b 1
)

::  Wait for services to be ready
echo [5/5] Waiting for services to start...
echo    Waiting for database initialization...
timeout /t 15 /nobreak >nul

echo    Checking backend API service...
:check_backend
powershell -Command "try { $null = Test-NetConnection -ComputerName localhost -Port 8080 -InformationLevel Quiet; if ($?) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo    Backend service is still starting, please wait...
    timeout /t 5 /nobreak >nul
    goto check_backend
)
echo Backend API service is ready

echo    Checking frontend service...
:check_frontend  
powershell -Command "try { $null = Test-NetConnection -ComputerName localhost -Port 80 -InformationLevel Quiet; if ($?) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo    Frontend service is still starting, please wait...
    timeout /t 5 /nobreak >nul
    goto check_frontend
)
echo Frontend service is ready

:: Check service status
echo.
echo Service Status Check:
docker-compose ps

echo.
echo ===============================================
echo    Chewytta System Started Successfully!
echo ===============================================
echo.
echo Access Information:
echo    System URL: http://localhost
echo    Admin Account: root
echo    Admin Password: 123456
echo.
echo Service Ports:
echo    Frontend Service: http://localhost (Port 80)
echo    Backend API: http://localhost:8080
echo    MySQL Database: localhost:3306
echo    Redis Cache: localhost:6379
echo.
echo Tips:
echo    - First startup may take 1-2 minutes to complete initialization
echo    - To stop the system, run "stop-chewytta-system.bat"
echo    - If you encounter issues, check the operation guide or contact technical support
echo.
echo Press any key to open the system homepage...
pause >nul

:: Open browser after ensuring service stability
echo Preparing to open system interface...
timeout /t 3 /nobreak >nul

:: Open browser
start http://localhost

echo System opened in browser, enjoy using it!
timeout /t 3 >nul
