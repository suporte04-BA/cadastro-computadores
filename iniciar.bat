@echo off
echo ==========================================
echo   Inventario de TI - http://localhost:3030
echo ==========================================
echo.
echo   Login: admin / admin123
echo   Para parar: feche esta janela ou Ctrl+C
echo ==========================================
echo.
cd /d "%~dp0backend"
java -Xms128m -Xmx384m -XX:TieredStopAtLevel=1 -jar target\cadastro-computadores-2.0.0.jar
