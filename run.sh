#!/usr/bin/env bash
set -e

# ==============================================================================
# PET Platform - Unified Runner Script
# Supports building UI and running the unified .NET host
# ==============================================================================

SKIP_UI=false
WATCH_MODE=false
DEV_MODE=false
UI_ONLY=false
RESET_DB=false

show_help() {
  cat << EOF
Usage: ./run.sh [OPTIONS]

Options:
  -s, --skip-ui     Skip building the frontend SPA bundle.
  -w, --watch       Run backend with 'dotnet watch' for auto-reloading.
  -d, --dev         Run both Vite dev server and .NET API concurrently.
  -u, --ui-only     Only build the frontend SPA assets into API/wwwroot and exit.
  -r, --reset-db    Delete local pet.db to force fresh database schema creation and seeding.
  -h, --help        Show this help message.

Examples:
  ./run.sh                  # Builds frontend, then runs .NET host
  ./run.sh --skip-ui        # Starts .NET immediately without rebuilding frontend
  ./run.sh -s -w            # Skips frontend build and starts .NET in watch mode
  ./run.sh --dev            # Launches full interactive development mode
  ./run.sh -s -r            # Re-seeds clean database and starts .NET immediately
EOF
}

while [[ $# -gt 0 ]]; do
  case $1 in
    -s|--skip-ui)
      SKIP_UI=true
      shift
      ;;
    -w|--watch)
      WATCH_MODE=true
      shift
      ;;
    -d|--dev)
      DEV_MODE=true
      shift
      ;;
    -u|--ui-only)
      UI_ONLY=true
      shift
      ;;
    -r|--reset-db)
      RESET_DB=true
      shift
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

# Resolve workspace root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ "$RESET_DB" = true ]; then
  echo ">>> Resetting database (removing API/pet.db)..."
  rm -f API/pet.db
fi

if [ "$DEV_MODE" = true ]; then
  echo ">>> Starting in full DEV mode (Vite dev server + .NET watch on port 5000)..."
  trap 'kill 0' SIGINT SIGTERM EXIT
  npm --prefix client-app run dev &
  dotnet watch --project API --urls "http://localhost:5000" &
  wait
  exit 0
fi

if [ "$SKIP_UI" = false ]; then
  echo ">>> Building client application into API/wwwroot..."
  npm --prefix client-app run build
  echo ">>> Client build completed successfully."
fi

if [ "$UI_ONLY" = true ]; then
  echo ">>> UI build finished (--ui-only specified). Exiting."
  exit 0
fi

if [ "$WATCH_MODE" = true ]; then
  echo ">>> Launching .NET API with dotnet watch on http://localhost:5000..."
  dotnet watch --project API --urls "http://localhost:5000"
else
  echo ">>> Launching .NET API with dotnet run on http://localhost:5000..."
  dotnet run --project API --urls "http://localhost:5000"
fi
