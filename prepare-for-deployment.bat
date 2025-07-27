@echo off
chcp 65001 >nul
echo ===============================================
echo    Chewytta Deployment Preparation Tool
echo ===============================================
echo.
echo This script will prepare your system for deployment by:
echo   1. Building the backend JAR file
echo   2. Building the frontend dist directory
echo   3. Ensuring all Docker files are ready
echo.

:: Check if Java/Maven is available for backend build
echo [1/4] Checking backend build requirements...
cd Chewytta
if not exist "target\Chewytta-0.0.1-SNAPSHOT.jar" (
    echo Backend JAR not found, building...
    call mvnw.cmd clean package -DskipTests
    if %errorlevel% neq 0 (
        echo Error: Backend build failed
        echo Please ensure you have Java 17+ installed
        cd ..
        pause
        exit /b 1
    )
    echo Backend build completed successfully
) else (
    echo Backend JAR already exists
)
cd ..

:: Check if Node.js is available for frontend build
echo [2/4] Checking frontend build status...
if not exist "chewytta_fronted\dist" (
    echo Frontend not built, building now...
    cd chewytta_fronted
    
    if not exist "node_modules" (
        echo Installing dependencies...
        npm install
        if %errorlevel% neq 0 (
            echo Failed to install dependencies
            pause
            exit /b 1
        )
    )
    
    echo Building frontend...
    npm run build
    if %errorlevel% neq 0 (
        echo Failed to build frontend
        pause
        exit /b 1
    )
    
    cd ..
    echo Frontend build completed!
) else (
    echo Frontend already built!
)

echo [2/2] Frontend ready for deployment
echo.
echo ===============================================
echo    Pre-build Completed Successfully!
echo ===============================================
echo.
echo The system is now ready for deployment.
echo You can run "start-chewytta-system.bat" to start the system.
echo.
pause
