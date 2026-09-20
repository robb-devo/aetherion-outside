$ErrorActionPreference = "SilentlyContinue"
$port = 8088
$url = "http://127.0.0.1:$port/?app=1"
$root = $PSScriptRoot

function Test-Harbour {
  try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:$port/" -UseBasicParsing -TimeoutSec 1
    return $r.StatusCode -ge 200
  } catch {
    return $false
  }
}

if (-not (Test-Harbour)) {
  $serve = Join-Path $root "serve.ps1"
  Start-Process -FilePath "powershell.exe" -WindowStyle Hidden -ArgumentList @(
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-File", $serve
  ) | Out-Null
  $tries = 0
  while (-not (Test-Harbour) -and $tries -lt 50) {
    Start-Sleep -Milliseconds 150
    $tries++
  }
}

if (-not (Test-Harbour)) {
  Add-Type -AssemblyName PresentationFramework
  [System.Windows.MessageBox]::Show(
    "Could not start the harbour server.`nTry 'Aetherion Outside.bat' instead.",
    "Aetherion Outside"
  ) | Out-Null
  exit 1
}

function Find-Browser {
  $candidates = @(
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LocalAppData\Google\Chrome\Application\chrome.exe"
  )
  foreach ($c in $candidates) {
    if ($c -and (Test-Path $c)) { return $c }
  }
  return $null
}

function Install-DesktopShortcut {
  $desktop = [Environment]::GetFolderPath("Desktop")
  if (-not $desktop) { return }
  $lnkPath = Join-Path $desktop "Aetherion Outside.lnk"
  $target = Join-Path $root "Play Aetherion Outside.vbs"
  try {
    $w = New-Object -ComObject WScript.Shell
    $s = $w.CreateShortcut($lnkPath)
    $s.TargetPath = $target
    $s.WorkingDirectory = $root
    $s.WindowStyle = 1
    $s.Description = "Aetherion Outside — Harbour of Dusk"
    $s.Save()
  } catch {
    # Shortcut is convenience only; the VBS still launches the game.
  }
}

Install-DesktopShortcut

$browser = Find-Browser
if ($browser) {
  Start-Process -FilePath $browser -ArgumentList @(
    "--app=$url",
    "--window-size=1680,945",
    "--disable-features=Translate,MediaRouter"
  )
} else {
  Start-Process $url
}
