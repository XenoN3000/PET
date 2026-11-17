@echo off
setlocal enabledelayedexpansion

:: ==============================================================================
:: PET Platform - Windows Command Prompt Runner Script
:: Supports building UI and running the unified .NET host
:: ==============================================================================

set SKIP_UI=false
set WATCH_MODE=false
set DEV_MODE=false
set UI_ONLY=false
set RESET_DB=false

:parse_args
if "%~1"=="" goto after_parse

if /i "%~1"=="-s" ( set SKIP_UI=true & shift & goto parse_args )
if /i "%~1"=="--skip-ui" ( set SKIP_UI=true & shift & goto parse_args )
if /i "%~1"=="/s" ( set SKIP_UI=true & shift & goto parse_args )

if /i "%~1"=="-w" ( set WATCH_MODE=true & shift & goto parse_args )
if /i "%~1"=="--watch" ( set WATCH_MODE=true & shift & goto parse_args )
if /i "%~1"=="/w" ( set WATCH_MODE=true & shift & goto parse_args )

if /i "%~1"=="-d" ( set DEV_MODE=true & shift & goto parse_args )
if /i "%~1"=="--dev" ( set DEV_MODE=true & shift & goto parse_args )
if /i "%~1"=="/d" ( set DEV_MODE=true & shift & goto parse_args )

if /i "%~1"=="-u" ( set UI_ONLY=true & shift & goto parse_args )
if /i "%~1"=="--ui-only" ( set UI_ONLY=true & shift & goto parse_args )
if /i "%~1"=="/u" ( set UI_ONLY=true & shift & goto parse_args )

if /i "%~1"=="-r" ( set RESET_DB=true & shift & goto parse_args )
if /i "%~1"=="--reset-db" ( set RESET_DB=true & shift & goto parse_args )
if /i "%~1"=="/r" ( set RESET_DB=true & shift & goto parse_args )

if /i "%~1"=="-h" goto show_help
if /i "%~1"=="--help" goto show_help
if /i "%~1"=="/h" goto show_help
if /i "%~1"=="/?" goto show_help

echo Unknown option: %~1
echo.
call :show_help_text
exit /b 1

:show_help
call :show_help_text
exit /b 0

:show_help_text
echo Usage: run.bat [OPTIONS]
echo.
echo Options:
echo   -s, --skip-ui     Skip building the frontend SPA bundle.
echo   -w, --watch       Run backend with 'dotnet watch' for auto-reloading.
echo   -d, --dev         Run both Vite dev server and .NET API concurrently.
echo   -u, --ui-only     Only build the frontend SPA assets into API\wwwroot and exit.
echo   -r, --reset-db    Delete local pet.db to force fresh database schema creation and seeding.
echo   -h, --help        Show this help message.
echo.
echo Examples:
echo   run.bat                  # Builds frontend, then runs .NET host
echo   run.bat --skip-ui        # Starts .NET immediately without rebuilding frontend
echo   run.bat -s -w            # Skips frontend build and starts .NET in watch mode
echo   run.bat --dev            # Launches full interactive development mode
echo   run.bat -s -r            # Re-seeds clean database and starts .NET immediately
goto :eof

:after_parse
cd /d "%~dp0"

if "%RESET_DB%"=="true" (
    echo ^>^>^> Resetting database ^(removing API\pet.db^)...
    if exist "API\pet.db" del /f /q "API\pet.db"
)

if "%DEV_MODE%"=="true" (
    echo ^>^>^> Starting in full DEV mode ^(Vite dev server + .NET watch on port 5000^)...
    start "PET - Vite Dev Server" cmd /c "npm --prefix client-app run dev"
    start "PET - .NET Host" cmd /c "dotnet watch --project API --urls http://localhost:5000"
    echo Both servers launched in separate windows. Close them to terminate.
    exit /b 0
)

if "%SKIP_UI%"=="false" (
    echo ^>^>^> Building client application into API\wwwroot...
    call npm --prefix client-app run build
    if errorlevel 1 (
        echo [ERROR] Client build failed with error code !errorlevel!.
        exit /b !errorlevel!
    )
    echo ^>^>^> Client build completed successfully.
)

if "%UI_ONLY%"=="true" (
    echo ^>^>^> UI build finished ^(--ui-only specified^). Exiting.
    exit /b 0
)

if "%WATCH_MODE%"=="true" (
    echo ^>^>^> Launching .NET API with dotnet watch on http://localhost:5000...
    dotnet watch --project API --urls "http://localhost:5000"
) else (
    echo ^>^>^> Launching .NET API with dotnet run on http://localhost:5000...
    dotnet run --project API --urls "http://localhost:5000"
)
