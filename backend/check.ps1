Start-Sleep -Seconds 12
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:3030/api/computadores/status' -UseBasicParsing -TimeoutSec 5
    Write-Output "Server UP: $($r.StatusCode)"
} catch {
    Write-Output "Server DOWN: $($_.Exception.Message)"
}
