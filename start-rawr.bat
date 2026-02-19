@echo off
:: §.RAWR.§ — Backend Auto-Start
:: Levanta el Memory Bridge API con notificación visual

title §.RAWR.§ Memory Bridge

:: Notificación visual: MCP Activo
powershell -Command "[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms') | Out-Null; [System.Windows.Forms.MessageBox]::Show('§.RAWR.§ Memory Bridge activo en localhost:8000', '🦖 MCP Activo', 'OK', 'Information')" &

:: Color verde para la terminal
color 0A
echo.
echo   ╔══════════════════════════════════════╗
echo   ║     §.RAWR.§ Memory Bridge API      ║
echo   ║     http://localhost:8000            ║
echo   ║     MCP Server: ACTIVO              ║
echo   ╚══════════════════════════════════════╝
echo.

cd /d "D:\Appz\-RAWR-\backend"
python main.py
