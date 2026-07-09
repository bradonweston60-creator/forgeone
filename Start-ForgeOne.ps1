$ErrorActionPreference = "Continue"

$appRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 4173
$url = "http://127.0.0.1:$port/"

$existing = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if (-not $existing) {
  Start-Process -FilePath python -ArgumentList @("-m", "http.server", "$port", "--bind", "127.0.0.1") -WorkingDirectory $appRoot -WindowStyle Hidden
  Start-Sleep -Seconds 2
}

Start-Process $url
