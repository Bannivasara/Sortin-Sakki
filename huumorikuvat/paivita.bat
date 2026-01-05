@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "paivita_kuvat.ps1"
pause