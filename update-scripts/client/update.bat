@echo off
setlocal enableextensions
title All The Leisures - Update
cd /d "%~dp0"

rem ============================================================
rem  All The Leisures - client updater launcher (Windows)
rem
rem  HOW TO USE
rem    1. Put this folder (update-scripts) into your modpack
rem       folder, the one that contains "config", "kubejs",
rem       "scripts" and "mods".
rem    2. Double-click "update.bat" before starting the game.
rem
rem  Needs Windows PowerShell (built into Windows 10/11).
rem  Java is NOT needed for updating, only for playing.
rem ============================================================

set "PS1=%~dp0..\packwiz-update.ps1"

echo ============================================================
echo   All The Leisures - updater
echo ============================================================
echo.

if not exist "%PS1%" goto nops1

where powershell >nul 2>nul
if errorlevel 1 goto nops

echo Syncing pack files. This may take a while the first time.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" %*
set "RC=%ERRORLEVEL%"
echo.
if not "%RC%"=="0" goto failed
echo Update finished. Start the game now.
echo.
pause
exit /b 0

:failed
echo Update did not finish completely.
echo Try again. If GitHub is blocked in your region, run this file
echo from a command line with a proxy, for example:
echo    update.bat -Proxy https://ghfast.top
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
echo         Windows 10/11 normally has it. Otherwise get the pack
echo         files from your group's file sharing instead.
echo.
pause
exit /b 1
