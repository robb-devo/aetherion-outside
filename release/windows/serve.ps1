# Local static server for Aetherion Outside (Windows, no Node required).
$port = 8088
$root = Join-Path $PSScriptRoot "game"
if (-not (Test-Path $root)) {
  Write-Error "Missing game folder: $root"
  exit 1
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$port/")
try {
  $listener.Start()
} catch {
  Write-Host "Port $port is busy. Close the other harbour window, or reboot."
  exit 1
}

Write-Host "Harbour serving $root"
Write-Host "Open http://127.0.0.1:$port/  (browser should already have launched)"
Write-Host "Close this window to quit."

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".mjs"  = "text/javascript; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".json" = "application/json"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".svg"  = "image/svg+xml"
  ".wasm" = "application/wasm"
  ".hdr"  = "application/octet-stream"
  ".ico"  = "image/x-icon"
  ".woff2"= "font/woff2"
  ".map"  = "application/json"
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  $path = [Uri]::UnescapeDataString($req.Url.LocalPath.TrimStart("/"))
  if ([string]::IsNullOrWhiteSpace($path)) { $path = "index.html" }
  if ($path -eq "__shutdown") {
    $res.StatusCode = 204
    $res.Close()
    $listener.Stop()
    break
  }
  $full = [IO.Path]::GetFullPath((Join-Path $root $path))
  $rootFull = [IO.Path]::GetFullPath($root)
  if (-not $full.StartsWith($rootFull)) {
    $res.StatusCode = 403
    $res.Close()
    continue
  }
  if (-not (Test-Path $full) -or (Test-Path $full -PathType Container)) {
    $full = Join-Path $root "index.html"
  }
  try {
    $bytes = [IO.File]::ReadAllBytes($full)
    $ext = [IO.Path]::GetExtension($full).ToLowerInvariant()
    $res.ContentType = $(if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" })
    $res.ContentLength64 = $bytes.Length
    $res.AddHeader("Cache-Control", "no-cache")
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } catch {
    $res.StatusCode = 500
  }
  $res.Close()
}
