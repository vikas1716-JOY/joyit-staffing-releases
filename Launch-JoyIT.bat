@echo off
title JoyIT Staffing Suite
set "APP_DIR=%~dp0"
set "HTML_FILE=%APP_DIR%index.html"

:: Try Edge first (built into Windows 10/11)
set "EDGE=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if exist "%EDGE%" (
    start "" "%EDGE%" --app="file:///%HTML_FILE:\=/%" --window-size=1280,820
    exit
)

:: Try Chrome
set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
if exist "%CHROME%" (
    start "" "%CHROME%" --app="file:///%HTML_FILE:\=/%" --window-size=1280,820
    exit
)

:: Fallback - open in default browser
start "" "%HTML_FILE%"
