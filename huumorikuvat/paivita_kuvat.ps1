# Menee kuvat-kansioon, hakee tiedostot ja tallentaa ne JSON-muodossa
$kuvat = Get-ChildItem -Path "kuvat" -File | Select-Object -ExpandProperty Name | ConvertTo-Json
$kuvat | Out-File -Encoding utf8 "kuvat.json"
Write-Host "JSON päivitetty onnistuneesti!" -ForegroundColor Green
Start-Sleep -Seconds 2