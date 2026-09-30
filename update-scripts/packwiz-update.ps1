# =====================================================================
#  All The Leisures - 原生更新器 (PowerShell)
# ---------------------------------------------------------------------
#  作用：直接读取 GitHub 上的 pack.toml + index.toml，对比本地文件哈希，
#        只下载"变化的文件"，并删除已被整合包移除的文件。
#
#  为什么不用 packwiz-installer？
#        官方 packwiz-installer-bootstrap.jar 会去 comp500/packwiz-installer
#        找 release，而那里没有 release，因此它本身无法工作。
#        这个脚本不依赖任何第三方启动器/Java 更新流程，只需要 Windows 自带的
#        PowerShell 和 .NET 哈希，能离线判断、增量下载。
#
#  用法（玩家）：
#        双击 update-scripts\client\更新整合包.bat
#        或手动： powershell -ExecutionPolicy Bypass -File <本文件> --server
#
#  用法（服务端）：
#        --server   使用 server 分支的服务端索引（剔除纯客户端文件）
#        --url      自定义 pack.toml 地址
#        --dest     自定义目标目录（默认是本脚本所在目录的"整合包目录"）
#        --proxy    下载代理前缀，例如 https://ghfast.top/
# =====================================================================

[CmdletBinding()]
param(
    [string]$Url  = 'https://raw.githubusercontent.com/lunaticsele/All-The-Leisures/main/pack.toml',
    [string]$Dest,
    [switch]$Server,
    [string]$Proxy = '',
    [switch]$Prune
)

$ErrorActionPreference = 'Stop'
$ProgressPreference    = 'SilentlyContinue'

# ---------------------------------------------------------------------
# 让本脚本在本机以 UTF-8 显示中文（不改变系统设置）
# ---------------------------------------------------------------------
try { [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false) } catch { }

function Say  ($m) { Write-Host $m }
function Ok   ($m) { Write-Host "  [OK]   $m"   -ForegroundColor Green }
function Skip ($m) { Write-Host "  [跳过] $m"   -ForegroundColor DarkGray }
function Warn ($m) { Write-Host "  [警告] $m"   -ForegroundColor Yellow }
function Fail ($m) { Write-Host "  [失败] $m"   -ForegroundColor Red }

# ---------------------------------------------------------------------
# 默认参数
# ---------------------------------------------------------------------
if ($Server) {
    $Url = 'https://raw.githubusercontent.com/lunaticsele/All-The-Leisures/server/pack.toml'
}
$Proxy = $Proxy.TrimEnd('/')

# 允许直接传本地路径（本机测试用）
if ($Url -notmatch '^[a-zA-Z][a-zA-Z0-9+.-]*://') {
    $Url = ([uri](Resolve-Path -LiteralPath $Url).Path).AbsoluteUri
}

# 目标目录：本脚本固定放在 <整合包目录>\update-scripts\ 下，
# 所以往上两层就是整合包目录（含 mods / config / kubejs 的那一层）。
if (-not $Dest) {
    $scriptDir = Split-Path -Parent $PSCommandPath          # ...\update-scripts
    $Dest = Split-Path -Parent $scriptDir                   # ...\  (整合包目录)
    if (-not (Test-Path -LiteralPath $Dest)) { $Dest = $scriptDir }
}
if (-not (Test-Path -LiteralPath $Dest)) { New-Item -ItemType Directory -Force -Path $Dest | Out-Null }
$Dest = (Resolve-Path -LiteralPath $Dest).Path
$registryPath = Join-Path $Dest '.atl-pack-managed.json'

Say ''
Say '============================================================'
Say '  All The Leisures - 整合包更新器'
Say '============================================================'
Say "  更新源   : $Url"
Say "  整合包目录: $Dest"
if ($Proxy) { Say "  代理     : $Proxy" }
Say ''

# ---------------------------------------------------------------------
# 下载 / 读取
# ---------------------------------------------------------------------
function Get-TextResource {
    param([string]$Uri)
    if ($Uri -like 'file:*') {
        $p = ([uri]$Uri).LocalPath
        return [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
    }
    $targets = @($Uri)
    if ($Proxy) { $targets += ($Proxy + '/' + $Uri) }

    $lastErr = $null
    foreach ($t in $targets) {
        for ($attempt = 1; $attempt -le 3; $attempt++) {
            try {
                $resp = Invoke-WebRequest -Uri $t -UseBasicParsing -TimeoutSec 60
                $bytes = $resp.Content
                if ($bytes -is [string]) { return $bytes }
                return [System.Text.Encoding]::UTF8.GetString($bytes)
            } catch {
                $lastErr = $_.Exception.Message
                Start-Sleep -Milliseconds (400 * $attempt)
            }
        }
    }
    throw "无法下载 $Uri`n  最后一次错误：$lastErr"
}

function Save-Resource {
    param([string]$Uri, [string]$Path)
    $parent = Split-Path -Parent $Path
    if ($parent -and -not (Test-Path $parent)) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
    if ($Uri -like 'file:*') {
        $p = ([uri]$Uri).LocalPath
        Copy-Item -LiteralPath $p -Destination $Path -Force
        return
    }
    $targets = @($Uri)
    if ($Proxy) { $targets += ($Proxy + '/' + $Uri) }

    $lastErr = $null
    foreach ($t in $targets) {
        for ($attempt = 1; $attempt -le 3; $attempt++) {
            try {
                Invoke-WebRequest -Uri $t -OutFile $Path -UseBasicParsing -TimeoutSec 300
                if ((Get-Item -LiteralPath $Path).Length -eq 0) { throw '下载到的文件是空的' }
                return
            } catch {
                $lastErr = $_.Exception.Message
                Start-Sleep -Milliseconds (500 * $attempt)
            }
        }
    }
    throw "无法下载 $Uri`n  最后一次错误：$lastErr"
}

function Get-Sha256 {
    param([string]$Path)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $fs = [System.IO.File]::OpenRead($Path)
        try   { return ([BitConverter]::ToString($sha.ComputeHash($fs)) -replace '-', '').ToLower() }
        finally { $fs.Dispose() }
    } finally { $sha.Dispose() }
}

# 从 TOML 文本里粗略取出 [index] 段（pack.toml）
function Get-IndexLocation {
    param([string]$PackText)
    $m = [regex]::Match($PackText, '(?ms)^\s*\[index\]\s*$(.*?)(?=^\s*\[|\z)')
    if (-not $m.Success) { throw 'pack.toml 里找不到 [index] 段' }
    $file = [regex]::Match($m.Groups[1].Value, '(?m)^\s*file\s*=\s*"(.*?)"').Groups[1].Value
    $hash = [regex]::Match($m.Groups[1].Value, '(?m)^\s*hash\s*=\s*"(.*?)"').Groups[1].Value
    if (-not $file) { throw 'pack.toml 的 [index] 段里没有 file' }
    return [pscustomobject]@{ File = $file; Hash = $hash }
}

# 解析 index.toml 的 [[files]] 列表
function Get-IndexEntries {
    param([string]$IndexText)
    $entries = New-Object System.Collections.ArrayList
    foreach ($block in [regex]::Matches($IndexText, '(?ms)^\s*\[\[files\]\]\s*$(.*?)(?=^\s*\[\[|\z)')) {
        $b = $block.Groups[1].Value
        $file    = [regex]::Match($b, '(?m)^\s*file\s*=\s*"(.*?)"').Groups[1].Value
        $hash    = [regex]::Match($b, '(?m)^\s*hash\s*=\s*"(.*?)"').Groups[1].Value
        $metafile= [regex]::Match($b, '(?m)^\s*metafile\s*=\s*true').Success
        if ($file -and $hash -and -not $metafile) {
            [void]$entries.Add([pscustomobject]@{ File = ($file -replace '/', '\'); Hash = $hash.ToLower() })
        }
    }
    return $entries
}

# ---------------------------------------------------------------------
# 1. 读取远端 pack.toml 与 index.toml
# ---------------------------------------------------------------------
Say '[1/4] 读取远端整合包信息...'
try {
    $packText = Get-TextResource -Uri $Url
} catch {
    Fail $_.Exception.Message
    Say ''
    Say '  GitHub 直连失败。可以改用国内代理，例如：'
    Say '    powershell -ExecutionPolicy Bypass -File <本脚本> -Proxy https://ghfast.top'
    exit 1
}

$indexLoc  = Get-IndexLocation -PackText $packText
if ($Url -like 'file:*') {
    $baseUri = ($Url -replace '[^/\\]+$', '')          # pack.toml 所在目录
} else {
    $baseUri = ($Url -replace '[^/]+$', '')
}
$indexUri  = $baseUri + $indexLoc.File
Ok "索引文件：$($indexLoc.File)"

try {
    $indexText = Get-TextResource -Uri $indexUri
} catch {
    Fail "无法下载索引：$($_.Exception.Message)"
    exit 1
}

$entries = Get-IndexEntries -IndexText $indexText
if ($entries.Count -eq 0) { Fail '索引里没有任何文件，可能选错了分支（客户端用 main，服务端用 server）'; exit 1 }
Ok "远端共有 $($entries.Count) 个文件"

# ---------------------------------------------------------------------
# 2. 对比本地，找出需要下载的文件
# ---------------------------------------------------------------------
Say ''
Say '[2/4] 对比本地文件...'

$toDownload = New-Object System.Collections.ArrayList
$current    = New-Object System.Collections.Generic.HashSet[string]
$same = 0

foreach ($e in $entries) {
    [void]$current.Add($e.File)
    $local = Join-Path $Dest $e.File
    if (Test-Path -LiteralPath $local -PathType Leaf) {
        if ((Get-Sha256 -Path $local) -eq $e.Hash) { $same++; continue }
        [void]$toDownload.Add($e)
    } else {
        [void]$toDownload.Add($e)
    }
}

# 读取上次的记录，用于删除"已从整合包移除"的文件
$previous = @()
if (Test-Path -LiteralPath $registryPath) {
    try   { $previous = (Get-Content -Raw -LiteralPath $registryPath | ConvertFrom-Json) } catch { $previous = @() }
}
$toDelete = New-Object System.Collections.ArrayList
foreach ($p in @($previous)) {
    if ($p -and -not $current.Contains($p)) {
        $local = Join-Path $Dest $p
        if (Test-Path -LiteralPath $local) { [void]$toDelete.Add($p) }
    }
}

Ok "本地已是最新：$same 个"
Ok "需要下载/覆盖：$($toDownload.Count) 个"
if ($toDelete.Count -gt 0) { Ok "需要删除（已从整合包移除）：$($toDelete.Count) 个" }

# ---------------------------------------------------------------------
# 3. 下载
# ---------------------------------------------------------------------
if ($toDownload.Count -gt 0) {
    Say ''
    Say '[3/4] 下载更新...'
    $i = 0; $failed = New-Object System.Collections.ArrayList
    foreach ($e in $toDownload) {
        $i++
        $local = Join-Path $Dest $e.File
        $pct = [int](($i / $toDownload.Count) * 100)
        Write-Host ("`r  [{0,3}%] {1}/{2}  {3}" -f $pct, $i, $toDownload.Count, $e.File.PadRight(60).Substring(0, [Math]::Min(60, $e.File.Length))) -NoNewline
        try {
            Save-Resource -Uri ($baseUri + ($e.File -replace '\\', '/')) -Path $local
        } catch {
            [void]$failed.Add($e.File)
        }
    }
    Write-Host ''
    if ($failed.Count -gt 0) {
        Say ''
        Fail "$($failed.Count) 个文件下载失败："
        $failed | Select-Object -First 10 | ForEach-Object { Say "      $_" }
        Say '  请重试；若一直失败，加 -Proxy https://ghfast.top 再试。'
    } else {
        Ok '全部下载完成'
    }
} else {
    Say ''
    Say '[3/4] 没有需要下载的文件'
}

# ---------------------------------------------------------------------
# 4. 删除 + 记录
# ---------------------------------------------------------------------
Say ''
Say '[4/4] 收尾...'
foreach ($d in $toDelete) {
    $local = Join-Path $Dest $d
    try {
        Remove-Item -LiteralPath $local -Force
        # 顺手清理空目录
        $dir = Split-Path -Parent $local
        while ($dir -and $dir.StartsWith($Dest) -and $dir -ne $Dest) {
            if ((Get-ChildItem -LiteralPath $dir -Force | Measure-Object).Count -eq 0) {
                Remove-Item -LiteralPath $dir -Force
                $dir = Split-Path -Parent $dir
            } else { break }
        }
    } catch { Warn "删除失败：$d" }
}
if ($toDelete.Count -gt 0) { Ok "已删除 $($toDelete.Count) 个旧文件" }

$currentArray = @($current)
[System.IO.File]::WriteAllText($registryPath,
    ($currentArray | ConvertTo-Json -Compress),
    (New-Object System.Text.UTF8Encoding($false)))
Ok "已记录文件清单：$registryPath"

Say ''
Say '============================================================'
if ($failed.Count -gt 0) {
    Say '  更新未完全成功，请重跑本脚本。' -ForegroundColor Yellow
    Say '============================================================'
    exit 2
}
Say '  更新完成，可以启动游戏了！' -ForegroundColor Green
Say '============================================================'
exit 0
