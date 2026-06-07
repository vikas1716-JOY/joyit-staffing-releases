# JoyIT Staffing Suite - Windows Setup
# Run this once to create desktop shortcut

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Setting up JoyIT Staffing Suite..." -ForegroundColor Cyan

# Create desktop shortcut
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\JoyIT Staffing Suite.lnk")
$Shortcut.TargetPath = "$ScriptDir\Launch-JoyIT.bat"
$Shortcut.WorkingDirectory = $ScriptDir
$Shortcut.Description = "JoyIT Staffing Intelligence Suite"
$Shortcut.IconLocation = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe,0"
$Shortcut.Save()

# Create Start Menu shortcut
$StartMenu = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs"
$Shortcut2 = $WshShell.CreateShortcut("$StartMenu\JoyIT Staffing Suite.lnk")
$Shortcut2.TargetPath = "$ScriptDir\Launch-JoyIT.bat"
$Shortcut2.WorkingDirectory = $ScriptDir
$Shortcut2.Description = "JoyIT Staffing Intelligence Suite"
$Shortcut2.Save()

Write-Host "Done! Shortcut created on your Desktop." -ForegroundColor Green
Write-Host "Double-click 'JoyIT Staffing Suite' on your Desktop to launch the app." -ForegroundColor Green
Read-Host "Press Enter to close"
