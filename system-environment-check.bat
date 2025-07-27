@echo off
chcp 65001 >nul
echo ===============================================
echo    Chewytta System Environment Check Tool
echo ===============================================
echo.

:: Check operating system
echo [1/6] Checking operating system version...
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
echo Windows %VERSION%

:: Check Docker installation
echo [2/6] Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker not installed or not added to PATH
    echo    Please download and install Docker Desktop: https://www.docker.com/products/docker-desktop
    goto :end
) else (
    for /f "tokens=3" %%i in ('docker --version') do echo Docker %%i installed
)

:: Check Docker service
echo [3/6] Checking Docker service status...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker service not started
    echo    Please start Docker Desktop
    goto :end
) else (
    echo Docker service is running
)

:: Check port usage
echo [4/6] Checking port usage...
netstat -an | findstr ":80 " >nul
if %errorlevel% equ 0 (
    echo Warning: Port 80 is occupied, may affect frontend service
) else (
    echo Port 80 available
)

netstat -an | findstr ":3306 " >nul
if %errorlevel% equ 0 (
    echo Warning: Port 3306 is occupied, may affect MySQL service
) else (
    echo Port 3306 available
)

netstat -an | findstr ":6379 " >nul
if %errorlevel% equ 0 (
    echo Warning: Port 6379 is occupied, may affect Redis service
) else (
    echo Port 6379 available
)

:: Check disk space
echo [5/6] Checking disk space...
for /f "tokens=3" %%i in ('dir /-c %cd% 2^>nul ^| findstr "bytes free"') do (
    set FREESPACE=%%i
)
if defined FREESPACE (
    echo Disk space sufficient
) else (
    echo Unable to check disk space
)

:: Check memory
echo [6/6] Checking system memory...
for /f "skip=1 tokens=4" %%i in ('wmic computersystem get TotalPhysicalMemory') do (
    if not "%%i"=="" (
        set /a MEMORY=%%i/1024/1024/1024
        goto :memory_done
    )
)
:memory_done
if %MEMORY% GEQ 4 (
    echo System memory: %MEMORY%GB (Recommended 4GB+)
) else (
    echo Warning: System memory: %MEMORY%GB (Recommend at least 4GB)
)

echo.
echo ===============================================
echo    Environment Check Completed
echo ===============================================
echo.
echo Recommendations:
echo    - If there are port conflicts, please stop the occupying services first
echo    - Ensure Docker Desktop is running
echo    - Close unnecessary programs to free up memory
echo.

:end
pause
