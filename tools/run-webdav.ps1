param(
  [string] $Dir = "${PSScriptRoot}\..\storage",
  [int] $Port = 8080,
  [string] $Bind = '127.0.0.1',
  [string] $User = 'webdav',
  [string] $Pass = 'webdav',
  [string] $Account = ''
)

$fullDir = (Resolve-Path -Path $Dir).Path
if ($Account -ne '') {
  $fullDir = Join-Path $fullDir "accounts\$Account"
}

if (-not (Test-Path $fullDir)) {
  Write-Error "Directory not found: $fullDir"
  exit 2
}

Write-Host "Serving WebDAV from: $fullDir"
Write-Host "Bind: $Bind:$Port  User: $User"

$argsList = @('serve','webdav', $fullDir, '--addr', "$Bind`:$Port", '--user', $User, '--pass', $Pass, '--vfs-cache-mode', 'writes')
Start-Process -NoNewWindow -Wait -FilePath 'rclone' -ArgumentList $argsList
