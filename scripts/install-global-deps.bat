@echo off
setlocal

:: Get current Node version
for /f "delims=" %%i in ('node -v 2^>nul') do (
    set "NODE_VERSION=%%i"
)

:: Check Node version
if "%NODE_VERSION%"=="" (
    echo ERROR: Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

:: Remove 'v' prefix
set "NODE_VERSION=%NODE_VERSION:~1%"

echo Current Node.js version: %NODE_VERSION%

:: Get major version
for /f "tokens=1 delims=." %%a in ("%NODE_VERSION%") do (
    set "MAJOR_VERSION=%%a"
)

echo Major version: %MAJOR_VERSION%

if "%MAJOR_VERSION%"=="" (
    echo ERROR: Cannot parse Node.js version.
    pause
    exit /b 1
)

if "%MAJOR_VERSION%"=="16" (
    echo Installing dependencies for Node.js v16.x.x...
    npm install -g @vue/cli@5.0.8 lerna@6.6.2 nrm@2.1.0 pnpm@8.15.9 rimraf@5.0.5 typescript@5.2.2 vite@4.5.3 webpack@5.91.0 yarn@1.22.22
) else if "%MAJOR_VERSION%"=="18" (
    echo Installing dependencies for Node.js v18.x.x...
    npm install -g @vue/cli@5.0.8 lerna@8.1.8 nrm@2.1.0 pnpm@9.10.0 rimraf@5.0.5 typescript@5.5.4 vite@5.4.8 webpack@5.96.1 yarn@1.22.22
) else if "%MAJOR_VERSION%"=="20" (
    echo Installing dependencies for Node.js v20.x.x...
    pm install -g @vue/cli@5.0.8 lerna@8.2.0 nrm@2.1.0 pnpm@10.8.0 rimraf@6.0.1 typescript@5.8.3 vite@6.0.5 webpack@5.97.1 yarn@1.22.22
) else (
    echo ERROR: Unsupported Node.js version: %NODE_VERSION%
    pause
    exit /b 1
)

echo Dependencies installed successfully!
pause
endlocal