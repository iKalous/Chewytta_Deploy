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
echo [2/4] Checking frontend build requirements...
cd chewytta_fronted
if not exist "dist" (
    echo Frontend dist not found, building...
    if not exist "node_modules" (
        echo Installing dependencies...
        call npm install
        if %errorlevel% neq 0 (
            echo Error: npm install failed
            echo Please ensure you have Node.js installed
            cd ..
            pause
            exit /b 1
        )
    )
    echo Building frontend...
    call npm run build
    if %errorlevel% neq 0 (
        echo Error: Frontend build failed
        cd ..
        pause
        exit /b 1
    )
    echo Frontend build completed successfully
) else (
    echo Frontend dist already exists
)
cd ..

:: Verify Dockerfile.simple exists
echo [3/4] Checking Docker configuration...
if not exist "Chewytta\Dockerfile.simple" (
    echo Creating Dockerfile.simple...
    echo # Use Java 17 base image > Chewytta\Dockerfile.simple
    echo FROM openjdk:17-jdk-slim >> Chewytta\Dockerfile.simple
    echo. >> Chewytta\Dockerfile.simple
    echo # Set working directory >> Chewytta\Dockerfile.simple
    echo WORKDIR /app >> Chewytta\Dockerfile.simple
    echo. >> Chewytta\Dockerfile.simple
    echo # Copy the built JAR file >> Chewytta\Dockerfile.simple
    echo COPY target/Chewytta-0.0.1-SNAPSHOT.jar app.jar >> Chewytta\Dockerfile.simple
    echo. >> Chewytta\Dockerfile.simple
    echo # Expose port >> Chewytta\Dockerfile.simple
    echo EXPOSE 8080 >> Chewytta\Dockerfile.simple
    echo. >> Chewytta\Dockerfile.simple
    echo # Run the application >> Chewytta\Dockerfile.simple
    echo ENTRYPOINT ["java", "-jar", "app.jar"] >> Chewytta\Dockerfile.simple
    echo Dockerfile.simple created
) else (
    echo Dockerfile.simple already exists
)

:: Verify frontend Dockerfile.simple exists
echo [4/4] Checking frontend Docker configuration...
if not exist "chewytta_fronted\Dockerfile.simple" (
    echo Creating frontend Dockerfile.simple...
    echo FROM nginx:latest > chewytta_fronted\Dockerfile.simple
    echo COPY dist /usr/share/nginx/html >> chewytta_fronted\Dockerfile.simple
    echo COPY nginx.conf /etc/nginx/nginx.conf >> chewytta_fronted\Dockerfile.simple
    echo Frontend Dockerfile.simple created
) else (
    echo Frontend Dockerfile.simple already exists
)

echo.
echo ===============================================
echo    Deployment Preparation Complete!
echo ===============================================
echo.
echo Your system is now ready for deployment.
echo You can now run "start-chewytta-system.bat" to start the system.
echo.
pause
