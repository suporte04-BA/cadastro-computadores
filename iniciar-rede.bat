@echo off
title Cadastro Computadores - Servidor
echo ============================================
echo   Cadastro de Computadores - Inventario TI
echo   Servidor iniciando...
echo ============================================
echo.

REM Verificar se Java esta instalado
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Java nao encontrado! Instale o JDK 17+ primeiro.
    pause
    exit /b 1
)

REM Verificar se PM2 esta instalado
pm2 --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Instalando PM2...
    call npm install -g pm2
)

REM Parar processo anterior se existir
pm2 delete cadastro-computadores >nul 2>&1

REM Iniciar com PM2
echo [OK] Iniciando servidor com PM2 (auto-restart habilitado)...
cd /d "%~dp0"
pm2 start ecosystem.config.js

REM Salvar configuracao PM2 para auto-start
pm2 save

REM Instalar auto-start no Windows
pm2-startup install >nul 2>&1

echo.
echo ============================================
echo   Servidor rodando em:
echo   http://192.168.0.247:3030
echo.
echo   Acessado por qualquer PC na rede!
echo.
echo   Comandos uteis:
echo     pm2 status    - Ver status
echo     pm2 logs      - Ver logs
echo     pm2 restart all - Reiniciar
echo     pm2 stop all  - Parar
echo ============================================
echo.
echo Pressione Ctrl+C para ver logs, ou feche esta janela.
pm2 logs
