@echo off
chcp 65001 >nul
echo ===============================================
echo    Chewytta Deploy Package Builder
echo ===============================================
echo.

:: Check for 7zip or winrar
echo [1/3] Checking compression tools...
where 7z >nul 2>&1
if %errorlevel% equ 0 (
    set COMPRESSOR=7z
    echo Found 7-Zip
    goto :compress
)

where winrar >nul 2>&1
if %errorlevel% equ 0 (
    set COMPRESSOR=winrar
    echo Found WinRAR
    goto :compress
)

echo Error: No compression tool found
echo    Please install 7-Zip or WinRAR and try again
pause
exit /b 1

:compress
echo [2/3] Starting compression...

:: Set output filename
set DATETIME=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set DATETIME=%DATETIME: =0%
set OUTPUT=Chewytta-Docker-Deploy-%DATETIME%.zip

:: Ensure frontend dist exists for deployment
if not exist "chewytta_fronted\dist" (
    echo Warning: Frontend dist directory not found!
    echo Building frontend for deployment...
    cd chewytta_fronted
    if not exist "node_modules" (
        echo Installing dependencies...
        call npm install
        if %errorlevel% neq 0 (
            echo Error: npm install failed
            cd ..
            pause
            exit /b 1
        )
    )
    echo Building frontend...
    call npm run build
    if %errorlevel% neq 0 (
        echo Error: npm build failed
        cd ..
        pause
        exit /b 1
    )
    cd ..
) else (
    echo Frontend dist directory found
)

if "%COMPRESSOR%"=="7z" (
    echo Using 7-Zip compression...
    7z a -tzip "%OUTPUT%" * -x!*.bat -x!node_modules -x!.git -x!.gitignore
) else if "%COMPRESSOR%"=="winrar" (
    echo Using WinRAR compression...
    winrar a -afzip "%OUTPUT%" * -x*.bat -x*node_modules -x*.git -x*.gitignore
) else if "%COMPRESSOR%"=="powershell" (
    echo Using PowerShell compression...
    echo Creating file list for compression...
    powershell -Command "$items = @(); Get-ChildItem -Path . -Recurse | ForEach-Object { if ($_.Name -notlike '*.bat' -and $_.FullName -notlike '*node_modules*' -and $_.FullName -notlike '*.git*' -and $_.FullName -notlike '*.gitignore*') { $items += $_.FullName } }; Compress-Archive -Path $items -DestinationPath '%OUTPUT%' -Force"
)

if %errorlevel% equ 0 (
    echo Compression completed: %OUTPUT%
) else (
    echo Compression failed
    pause
    exit /b 1
)

echo [3/3] Cleaning temporary files...
echo Cleanup completed

echo.
echo ===============================================
echo    Package Creation Successful!
echo ===============================================
echo.
echo Output file: %OUTPUT%
echo File location: %cd%
echo.
echo Tips:
echo    - You can share this package with other users
echo    - After extraction, run "start-chewytta-system.bat" to use
echo    - Ensure Docker Desktop is installed on target machine
echo.
pause
