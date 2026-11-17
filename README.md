# PET Physics & Quality Control Interactive Platform

An interactive medical physics simulation and quality assurance platform designed for Positron Emission Tomography (PET). This platform enables medical physicists, nuclear medicine technologists, and radiology residents to simulate QC protocols, analyze reconstruction metrics, evaluate partial volume corrections, and study international imaging standards (NEMA NU 2-2018, IAEA Human Health Reports, AAPM Report 126).

---

## Key Features

- **Quality Control Protocol Engine**:
  - Pre-configured protocols for Daily Uniformity, Spatial Resolution, Sensitivity, Count Rate Performance, and Image Quality.
  - Interactive acceptance criteria evaluation and automated printable QC checklists with sign-off workflows.
- **Interactive Physics Workbenches**:
  - **Daily Uniformity Lab**: Real-time sinogram & transaxial slice simulation, defect injection (cold spots, PMT drift, normalization failure), and integral/differential uniformity analysis.
  - **Spatial Resolution Lab**: Point source response profiling, line spread functions, and automated FWHM / FWTM calculations across radial and tangential axes.
  - **Partial Volume Effect (PVE) & Recovery**: Sphere phantom recovery curves (CRC) across varying sphere diameters and background activity ratios.
  - **Dose & Reconstruction Comparison**: Interactive side-by-side and split-slider viewers comparing standard dose vs. ultra-low-dose scans with deep learning denoising.
  - **AI Reconstruction Assessment**: Evaluation workbench with PSNR, SSIM, and Dice Similarity Coefficients calibrated against IAEA/Abdelrahman clinical guidelines.
- **Assessment & Educational Quizzes**:
  - Board-style clinical medical physics quizzes with immediate rationales, scoring breakdown, and review mode.
- **Bilingual Localization (English & Persian)**:
  - Full bidirectional support (LTR and RTL) with specialized Persian medical physics terminology.
  - Beautiful Persian typography powered by **Vazirmatn**.
  - Database-driven translation tables for domain content with automatic fallback to English.
- **Unified Single-Process Architecture**:
  - ASP.NET Core 9 backend serves both RESTful API endpoints and the compiled React 19 frontend bundle on **port 5000**.

---

## Tech Stack

- **Backend**: .NET 9.0 (ASP.NET Core Web API, Clean Architecture, MediatR, Entity Framework Core, SQLite)
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, `i18next`
- **Hosting & Scripts**: Cross-platform runners for Bash, Windows Command Prompt, and PowerShell

---

## Prerequisites

Ensure you have the following installed on your machine:
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (v18.x or later) and `npm`

---

## Running the Application

The platform includes unified runner scripts for **Linux/macOS** (`run.sh`), **Windows Command Prompt** (`run.bat`), and **Windows PowerShell** (`run.ps1`). 

Each script automatically builds the React SPA into `API/wwwroot` and launches the unified ASP.NET Core host at **`http://localhost:5000`**.

### 1. Linux & macOS (Bash)

Make the script executable (first time only):
```bash
chmod +x run.sh
```

Run the application:
```bash
# Standard run (builds frontend, then launches .NET on http://localhost:5000)
./run.sh

# Skip frontend build (starts backend immediately)
./run.sh -s
# or
./run.sh --skip-ui

# Watch mode (auto-reloads backend on code edits)
./run.sh -s -w

# Full interactive dev mode (Vite dev server + .NET watch concurrently)
./run.sh --dev

# Reset database (deletes API/pet.db to force clean schema migration and re-seeding)
./run.sh -s -r

# Display help and options
./run.sh -h
```

---

### 2. Windows Command Prompt (`run.bat`)

Open Command Prompt (`cmd.exe`) in the project directory:

```cmd
:: Standard run (builds frontend, then launches .NET on http://localhost:5000)
run.bat

:: Skip frontend build (starts backend immediately)
run.bat -s
:: or
run.bat --skip-ui

:: Watch mode (auto-reloads backend on code edits)
run.bat -s -w

:: Full interactive dev mode (Vite dev server + .NET watch concurrently in separate windows)
run.bat --dev

:: Reset database (deletes API\pet.db to force clean schema migration and re-seeding)
run.bat -s -r

:: Display help and options
run.bat -h
```

---

### 3. Windows PowerShell (`run.ps1`)

Open PowerShell in the project directory:

```powershell
# Standard run (builds frontend, then launches .NET on http://localhost:5000)
.\run.ps1

# Skip frontend build (starts backend immediately)
.\run.ps1 -s
# or
.\run.ps1 --skip-ui

# Watch mode (auto-reloads backend on code edits)
.\run.ps1 -s -w

# Full interactive dev mode (Vite dev server + .NET watch concurrently in separate windows)
.\run.ps1 --dev

# Reset database (deletes API/pet.db to force clean schema migration and re-seeding)
.\run.ps1 -s -r

# Display help and options
.\run.ps1 -h
```

---

## Runner Script Flags & Options Reference

All three scripts (`run.sh`, `run.bat`, `run.ps1`) support the exact same flags:

| Short Flag | Long Flag | Description |
| :--- | :--- | :--- |
| `-s` | `--skip-ui` | Skip building the React SPA bundle (starts backend immediately). |
| `-w` | `--watch` | Run backend with `dotnet watch` for live code reloading. |
| `-d` | `--dev` | Launch full interactive development mode (Vite HMR dev server + .NET watch concurrently). |
| `-u` | `--ui-only` | Only build frontend SPA assets into `API/wwwroot` and exit without running the server. |
| `-r` | `--reset-db` | Delete local `pet.db` SQLite file to re-create tables and re-seed default data on startup. |
| `-h` | `--help` | Show usage instructions, supported flags, and examples. |

---

## Project Structure

```text
PET/
├── API/                        # ASP.NET Core Web API host
│   ├── Controllers/            # REST API endpoints (Protocols, Labs, AI, Quizzes)
│   ├── Extensions/             # Middleware & pipeline configuration (SPA serving)
│   ├── Properties/             # launchSettings.json (Port 5000)
│   ├── wwwroot/                # Compiled frontend SPA distribution files (auto-generated)
│   └── appsettings.json        # API configuration and database connection string
├── Application/                # MediatR handlers, queries, commands, and localization extensions
├── Domain/                     # Core domain entities & localized translation tables
├── Persistence/                # EF Core DatabaseContext, migrations, and bilingual seed data
├── client-app/                 # React 19 + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/         # Shared UI, Navbar (language switcher), Sidebar, ThemeProvider
│   │   ├── features/           # Interactive simulation labs, QC checklists, quiz runners
│   │   ├── locales/            # Translation catalogs (en.json, fa.json)
│   │   └── pages/              # Routed pages (Dashboard, Protocols, Labs, AI, Quizzes)
│   └── vite.config.ts          # Configured to build into API/wwwroot with proxy to port 5000
├── run.sh                      # Unified runner script for Linux & macOS
├── run.bat                     # Unified runner script for Windows Command Prompt
├── run.ps1                     # Unified runner script for Windows PowerShell
└── openspec/                   # OpenSpec capabilities, specifications, and change archives
```

---

## Localization & Internationalization

- **Language Switcher**: Located in the top navigation bar. Allows toggling between **English** and **فارسی (Persian)**.
- **RTL & Typography**: When switching to Persian, the interface automatically applies `dir="rtl"`, swaps font families to **Vazirmatn**, and updates alignment across tables, forms, and charts.
- **Database Fallback**: Domain content (protocols, criteria, quizzes, scenarios) queries accept an `Accept-Language` header or `?lang=fa|en` parameter. If a translation is not found in Persian, it automatically falls back to English.

---

## License

This project is developed for educational, clinical quality assurance, and medical physics simulation purposes.
