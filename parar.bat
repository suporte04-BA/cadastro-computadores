@echo off
taskkill /F /IM java.exe /T >nul 2>&1
if %errorlevel% equ 0 (echo Servidor parado!) else (echo Nenhum servidor rodando.)
timeout /t 2 >nul
