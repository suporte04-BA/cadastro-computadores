@echo off
echo ==========================================
echo   Parando servidor...
echo ==========================================

for /f "tokens=2" %%a in ('tasklist /fi "imagename eq java.exe" /fo list ^| findstr "PID"') do (
    wmic process where "ProcessId=%%a" get CommandLine 2>nul | findstr "cadastro-computadores" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo   Parando processo Java (PID: %%a^)...
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo ==========================================
echo   Servidor parado com sucesso!
echo ==========================================
timeout /t 3 >nul
