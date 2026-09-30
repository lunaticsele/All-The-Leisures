@echo off
setlocal enableextensions
title All The Leisures - Server Update
cd /d "%~dp0"

rem ============================================================
rem  All The Leisures - server updater launcher (Windows)
rem
rem  HOW TO USE
rem    1. Put the whole "update-scripts" folder into your server
rem       folder, the one that contains "mods", "config",
rem       "server.properties" and your start script.
rem    2. Run "update-server.bat" BEFORE starting the server.
rem
rem  It uses the SERVER branch of the pack, so client-only files
rem  (kubejs\client_scripts, shader/menu configs, ...) are skipped.
rem  Needs Windows PowerShell. Java is not needed for updating.
rem ============================================================

set "PS1=%~dp0..\packwiz-update.ps1"

echo ============================================================
echo   All The Leisures - server updater
echo ============================================================
echo.

if not exist "%PS1%" goto nops1

where powershell >nul 2>nul
if errorlevel 1 goto nops

echo Syncing server pack files. This may take a while the first time.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -Server %*
set "RC=%ERRORLEVEL%"
echo.
if not "%RC%"=="0" goto failed
echo Server files are up to date. Now start the server.
echo.
pause
exit /b 0

:failed
echo Update did not finish completely.
echo Try again from a command line, optionally with a proxy:
echo    update-server.bat -Proxy https://ghfast.top
echo.
pause
exit /b 1

:nops1
echo [ERROR] Cannot find the updater script:
echo         %PS1%
echo Make sure the "update-scripts" folder was copied completely.
echo.
pause
exit /b 1

:nops
echo [ERROR] Windows PowerShell was not found.
echo         Windows 10/11 normally has it. Otherwise copy the pack
echo         files to the server manually.
echo.
pause
exit /b 1
