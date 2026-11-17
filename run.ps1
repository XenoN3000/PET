<#
.SYNOPSIS
    PET Platform - Windows PowerShell Unified Runner Script
.DESCRIPTION
    Supports building the React frontend into API/wwwroot and hosting the unified ASP.NET Core API on port 5000.
    Accepts identical flags to run.sh (e.g., -s, --skip-ui, -w, --watch, -d, --dev, -u, --ui-only, -r, --reset-db, -h, --help).
.EXAMPLE
    .\run.ps1
    .\run.ps1 -s
    .\run.ps1 --skip-ui
    .\run.ps1 -s -w
    .\run.ps1 --skip-ui --watch
    .\run.ps1 --dev
    .\run.ps1 -s -r
    .\run.ps1 --reset-db
    .\run.ps1 -u
    .\run.ps1 --help
#>

$ErrorActionPreference = "Stop"

$SkipUi = $false
$WatchMode = $false
$DevMode = $false
$UiOnly = $false
$ResetDb = $false

function Show-Help {
@"
Usage: .\run.ps1 [OPTIONS]

Options:
  -s, --skip-ui     Skip building the frontend SPA bundle.
  -w, --watch       Run backend with 'dotnet watch' for auto-reloading.
  -d, --dev         Run both Vite dev server and .NET API concurrently.
  -u, --ui-only     Only build the frontend SPA assets into API/wwwroot and exit.
  -r, --reset-db    Delete local pet.db to force fresh database schema creation and seeding.
  -h, --help        Show this help message.

Examples:
  .\run.ps1                  # Builds frontend, then runs .NET host
  .\run.ps1 --skip-ui        # Starts .NET immediately without rebuilding frontend
  .\run.ps1 -s -w            # Skips frontend build and starts .NET in watch mode
  .\run.ps1 --dev            # Launches full interactive development mode
  .\run.ps1 -s -r            # Re-seeds clean database and starts .NET immediately
"@
}

foreach ($arg in $args) {
    switch -Regex ($arg) {
        '^(-s|--skip-ui|-SkipUi)$' {
            $SkipUi = $true
            break
        }
        '^(-w|--watch|-Watch)$' {
            $WatchMode = $true
            break
        }
        '^(-d|--dev|-Dev)$' {
            $DevMode = $true
            break
        }
        '^(-u|--ui-only|-UiOnly)$' {
            $UiOnly = $true
            break
        }
        '^(-r|--reset-db|-ResetDb)$' {
            $ResetDb = $true
            break
        }
        '^(-h|--help|-Help|-\?|/\?)$' {
            Show-Help
            exit 0
        }
        default {
            Write-Host "Unknown option: $arg" -ForegroundColor Red
            Show-Help
            exit 1
        }
    }
}

# Resolve workspace root directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

if ($ResetDb) {
    Write-Host ">>> Resetting database (removing API/pet.db)..." -ForegroundColor Yellow
    if (Test-Path "API/pet.db") {
        Remove-Item "API/pet.db" -Force
    }
}

if ($DevMode) {
    Write-Host ">>> Starting in full DEV mode (Vite dev server + .NET watch on port 5000)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit -Command `"Write-Host 'Starting Vite Dev Server...' -ForegroundColor Cyan; npm --prefix client-app run dev`""
    Start-Process powershell -ArgumentList "-NoExit -Command `"Write-Host 'Starting .NET API Watch...' -ForegroundColor Cyan; dotnet watch --project API --urls 'http://localhost:5000'`""
    Write-Host "Both Vite and .NET have been started in separate PowerShell windows." -ForegroundColor Green
    exit 0
}

if (-not $SkipUi) {
    Write-Host ">>> Building client application into API/wwwroot..." -ForegroundColor Cyan
    npm --prefix client-app run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Client build failed."
        exit $LASTEXITCODE
    }
    Write-Host ">>> Client build completed successfully." -ForegroundColor Green
}

if ($UiOnly) {
    Write-Host ">>> UI build finished (--ui-only specified). Exiting." -ForegroundColor Green
    exit 0
}

if ($WatchMode) {
    Write-Host ">>> Launching .NET API with dotnet watch on http://localhost:5000..." -ForegroundColor Cyan
    dotnet watch --project API --urls "http://localhost:5000"
} else {
    Write-Host ">>> Launching .NET API with dotnet run on http://localhost:5000..." -ForegroundColor Cyan
    dotnet run --project API --urls "http://localhost:5000"
}
