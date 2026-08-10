try {
    # 1. Login
    $loginBody = '{"username":"admin","senha":"admin123"}'
    $loginResp = Invoke-RestMethod -Uri 'http://localhost:3030/api/auth/login' -Method POST -ContentType 'application/json' -Body $loginBody
    $token = $loginResp.token
    Write-Output "LOGIN OK: token=$($token.Substring(0,20))..."

    $headers = @{ Authorization = "Bearer $token" }

    # 2. Upload test (JPEG)
    $tmpFile = Join-Path $env:TEMP "test_photo.jpg"
    $bytes = [byte[]](0xFF,0xD8,0xFF,0xE0,0x00,0x10,0x4A,0x46,0x49,0x46,0x00,0x01,0x01,0x00,0x00,0x01,0x00,0x01,0x00,0x00)
    [System.IO.File]::WriteAllBytes($tmpFile, $bytes)
    $uploadResp = Invoke-RestMethod -Uri 'http://localhost:3030/api/upload' -Method POST -Headers $headers -InFile $tmpFile -ContentType 'image/jpeg'
    Write-Output "UPLOAD OK: $($uploadResp | ConvertTo-Json -Compress)"

    # 3. Check actuador health (showSystemInfo fix)
    $health = Invoke-RestMethod -Uri 'http://localhost:3030/actuator/health' -Headers $headers
    Write-Output "HEALTH OK: status=$($health.status)"

    # 4. Check OS listing (N+1 fix - should work)
    $osPage = Invoke-RestMethod -Uri 'http://localhost:3030/api/ordens-servico?page=0&size=5' -Headers $headers
    Write-Output "OS OK: total=$($osPage.totalElements)"

    # 5. Check manutencao listing
    $manPage = Invoke-RestMethod -Uri 'http://localhost:3030/api/manutencoes?page=0&size=5' -Headers $headers
    Write-Output "MAN OK: total=$($manPage.totalElements)"

    Write-Output "`nALL TESTS PASSED"
} catch {
    Write-Output "ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Output "BODY: $($reader.ReadToEnd())"
    }
}
