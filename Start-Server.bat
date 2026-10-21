
@echo off
title Popcorn Bucket Server

cd /d "%~dp0"

echo Starting Popcorn Bucket server...

if not exist "Private\server.js" (
    echo ERROR: Could not find Private\server.js
    echo Make sure this file is in your main PopcornBucket folder.
    pause
    exit /b 1
)

cd /d "Private"

echo Starting server...
start "" /min cmd /c "node server.js"

echo Waiting for server to start...
timeout /t 3 /nobreak >nul

echo Opening Popcorn Bucket in your browser...
start "" "http://localhost:3000"

echo.
echo Popcorn Bucket should now be open!
echo Keep the server running while you use the website.
pause
