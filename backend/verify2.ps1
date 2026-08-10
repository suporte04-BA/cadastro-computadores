try {
    $loginBody = '{"username":"admin","senha":"admin123"}'
    $loginResp = Invoke-RestMethod -Uri 'http://localhost:3030/api/auth/login' -Method POST -ContentType 'application/json' -Body $loginBody
    $token = $loginResp.token
    $headers = @{ Authorization = "Bearer $token" }

    $tmpFile = Join-Path $env:TEMP "test_photo.jpg"
    $bytes = [byte[]](0xFF,0xD8,0xFF,0xE0,0x00,0x10,0x4A,0x46,0x49,0x46,0x00,0x01,0x01,0x00,0x00,0x01,0x00,0x01,0x00,0x00)
    [System.IO.File]::WriteAllBytes($tmpFile, $bytes)

    try {
        $uploadResp = Invoke-WebRequest -Uri 'http://localhost:3030/api/upload' -Method POST -Headers $headers -InFile $tmpFile -ContentType 'image/jpeg'
        Write-Output "UPLOAD OK: $($uploadResp.StatusCode) - $($uploadResp.Content)"
    } catch {
        Write-Output "UPLOAD FAIL: $($_.Exception.Response.StatusCode.value__)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Output "UPLOAD BODY: $($reader.ReadToEnd())"
    }

    try {
        $health = Invoke-WebRequest -Uri 'http://localhost:3030/actuator/health' -Headers $headers -UseBasicParsing
        Write-Output "HEALTH OK: $($health.Content)"
    } catch {
        Write-Output "HEALTH FAIL: $($_.Exception.Response.StatusCode.value__)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Output "HEALTH BODY: $($reader.ReadToEnd())"
    }
} catch {
    Write-Output "ERROR: $($_.Exception.Message)"
}
