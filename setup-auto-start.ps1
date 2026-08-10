# setup-auto-start.ps1
# Executar como ADMINISTRADOR para configurar auto-start no boot

$taskName = "CadastroComputadores-Servidor"
$projectPath = "C:\Users\usuario\Documents\cadastro-computadores"
$batPath = "$projectPath\iniciar-rede.bat"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Configurando Auto-Start no Boot" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se esta rodando como admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[ERRO] Execute este script como ADMINISTRADOR!" -ForegroundColor Red
    Write-Host "Botao direito -> Executar como Administrador" -ForegroundColor Yellow
    pause
    exit 1
}

# Remover tarefa antiga se existir
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

# Criar a tarefa agendada
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$batPath`"" -WorkingDirectory $projectPath
$trigger = New-ScheduledTaskTrigger -AtStartup
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit (New-TimeSpan -Days 365)
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Servidor Cadastro de Computadores - Auto-start no boot"

Write-Host ""
Write-Host "[OK] Tarefa criada com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Configuracao:" -ForegroundColor Yellow
Write-Host "  - Nome: $taskName"
Write-Host "  - Executa: Ao ligar o PC (boot)"
Write-Host "  - Roda como: SYSTEM (sem precisar logar)"
Write-Host "  - Reinicia: Ate 3 vezes se crashar"
Write-Host ""
Write-Host "Para testar agora:" -ForegroundColor Cyan
Write-Host "  start-scheduledtask -taskname '$taskName'"
Write-Host ""
Write-Host "Para remover depois:" -ForegroundColor Yellow
Write-Host "  Unregister-ScheduledTask -taskname '$taskName'"
Write-Host ""
pause
