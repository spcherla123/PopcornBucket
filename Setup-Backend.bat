@echo off
echo [PROCESS] Checking Node.js availability...

:: Search for the node binary in the PATH
where node >nul 2>&1

if %errorlevel% neq 0 (
    echo [ERROR] Node.js is NOT installed or NOT in the system PATH.
    echo [HELP] Download from https://nodejs.org
) else (
    echo [SUCCESS] Node.js detected.
    node -v
)

echo Node.js found. Initializing project...
cd Private 
call npm.cmd init -y
call npm.cmd install express better-sqlite3 bcrypt
echo Setup complete. Starting server...
node server.js
pause
