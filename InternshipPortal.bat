@echo off
cd /d "C:\path\to\your\project"
start cmd /k "node server.js"
timeout /t 2 >nul
start "" "http://localhost:3000"
