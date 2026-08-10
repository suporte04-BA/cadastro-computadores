@echo off
title Inventario de TI - Servidor
echo ==========================================
echo   Inventario de TI - http://localhost:3030
echo ==========================================
echo.
echo   Para parar: feche esta janela ou Ctrl+C
echo ==========================================
echo.

where java >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERRO: Java nao encontrado! Instale o Java JDK 21+ e adicione ao PATH.
    pause
    exit /b 1
)

cd /d "%~dp0backend"

if not exist "target\cadastro-computadores-2.0.0.jar" (
    echo ERRO: JAR nao encontrado! Execute 'mvn clean package -DskipTests' na pasta backend.
    pause
    exit /b 1
)

java -Xms256m -Xmx512m -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:TieredStopAtLevel=1 -Dfile.encoding=UTF-8 -jar target\cadastro-computadores-2.0.0.jar
