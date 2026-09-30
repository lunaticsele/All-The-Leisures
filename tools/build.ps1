<#
=====================================================================
 build.ps1  -  整合包索引重建脚本
---------------------------------------------------------------------
 用途：每次你修改了 config / kubejs / scripts 里的内容后，运行本脚本，
       它会重新计算所有文件哈希，更新 index.toml（客户端）和
       index-server.toml（服务端）。

 用法（在整合包根目录，也就是有 pack.toml 的那一层）：
       pwsh -File tools\build.ps1

 参数：
       -PackwizPath <路径>   指定 packwiz 可执行文件（默认自动查找）
       -NoServer             只重建客户端索引

 重要：改完文件一定要跑一次本脚本，否则玩家的更新器检测不到变化，
       会认为"已经是最新"，你的修改就不会被下发。
=====================================================================
#>
[CmdletBinding()]
param(
    [string]$PackwizPath,
    [switch]$NoServer
)

$ErrorActionPreference = 'Stop'

function Write-Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "    $msg" -ForegroundColor Green }
function Write-Warn2($msg){ Write-Host "    $msg" -ForegroundColor Yellow }

# ---------------------------------------------------------------
# 0. 定位整合包根目录（含 pack.toml 的目录）
# ---------------------------------------------------------------
$root = $null
$candidate = $PSScriptRoot
while ($candidate -and (Test-Path (Join-Path $candidate 'pack.toml'))) {
    $root = $candidate
    $candidate = Split-Path $candidate -Parent
}
if (-not $root) {
    # 退回到脚本的上一级目录
    $maybe = Split-Path $PSScriptRoot -Parent
    if (Test-Path (Join-Path $maybe 'pack.toml')) { $root = $maybe }
}
if (-not $root) {
    throw "找不到 pack.toml。请在整合包根目录下运行：pwsh -File tools\build.ps1"
}
Set-Location $root
Write-Step "整合包根目录：$root"

# ---------------------------------------------------------------
# 1. 定位 packwiz 可执行文件
# ---------------------------------------------------------------
if (-not $PackwizPath) {
    $names = if ($IsWindows -or $env:OS -eq 'Windows_NT') { @('packwiz.exe', 'packwiz') } else { @('packwiz') }
    foreach ($n in $names) {
        $p = Join-Path $root $n
        if (Test-Path $p) { $PackwizPath = $p; break }
    }
    if (-not $PackwizPath) {
        $cmd = Get-Command packwiz -ErrorAction SilentlyContinue
        if ($cmd) { $PackwizPath = $cmd.Source }
    }
}
if (-not $PackwizPath -or -not (Test-Path $PackwizPath)) {
    throw "找不到 packwiz。请把 packwiz.exe 放到整合包根目录，或用 -PackwizPath 指定路径。"
}
Write-Step "packwiz：$PackwizPath"

# ---------------------------------------------------------------
# packwiz refresh 要求索引文件必须已存在；不存在就写一个最小骨架
function Ensure-IndexSkeleton {
    param([string]$IndexFile)
    if (-not (Test-Path $IndexFile)) {
        [System.IO.File]::WriteAllText((Join-Path $root $IndexFile), "hash-format = `"sha256`"`n", (New-Object System.Text.UTF8Encoding($false)))
        Write-Warn2 "已创建索引骨架：$IndexFile"
    }
}

# ---------------------------------------------------------------
# 3. 客户端索引
# ---------------------------------------------------------------
Write-Step "步骤 1/2：重建客户端索引 index.toml"
Ensure-IndexSkeleton -IndexFile 'index.toml'
$out = & $PackwizPath refresh 2>&1
$exit = $LASTEXITCODE
$out | Where-Object { $_ -notmatch 'Refreshing index' } | ForEach-Object { Write-Host "    $_" }
if ($exit -ne 0) { throw "packwiz refresh 失败（客户端索引），退出码 $exit" }
Write-Ok "index.toml 已更新"

# ---------------------------------------------------------------
# 4. 服务端索引（把 server.packwizignore 临时追加到 .packwizignore）
# ---------------------------------------------------------------
if (-not $NoServer) {
    Write-Step "步骤 2/2：重建服务端索引 index-server.toml"
    $ignoreFile = Join-Path $root '.packwizignore'
    $serverIgnore = Join-Path $root 'server.packwizignore'
    $backup = $null

    try {
        $backup = [System.IO.File]::ReadAllText($ignoreFile)
        if (Test-Path $serverIgnore) {
            $extra = [System.IO.File]::ReadAllText($serverIgnore)
            $combined = ($backup.TrimEnd() + "`n`n# ==== 以下来自 server.packwizignore ====`n" + $extra)
            [System.IO.File]::WriteAllText($ignoreFile, $combined, (New-Object System.Text.UTF8Encoding($false)))
            Write-Ok "已临时合并 server.packwizignore"
        } else {
            Write-Warn2 "没有 server.packwizignore，服务端索引将与客户端相同"
        }

        Ensure-IndexSkeleton -IndexFile 'index-server.toml'
        $out = & $PackwizPath refresh --pack-file server-pack.toml 2>&1
        $exit = $LASTEXITCODE
        $out | Where-Object { $_ -notmatch 'Refreshing index' } | ForEach-Object { Write-Host "    $_" }
        if ($exit -ne 0) { throw "packwiz refresh 失败（服务端索引），退出码 $exit" }
        Write-Ok "index-server.toml 已更新"
    }
    finally {
        if ($backup -ne $null) {
            [System.IO.File]::WriteAllText($ignoreFile, $backup, (New-Object System.Text.UTF8Encoding($false)))
            Write-Ok ".packwizignore 已还原"
        }
    }
}

# ---------------------------------------------------------------
# 5. 汇总
# ---------------------------------------------------------------
function Get-IndexCount {
    param([string]$IndexFile)
    if (-not (Test-Path $IndexFile)) { return 0 }
    return (Select-String -LiteralPath $IndexFile -Pattern '^file = ' -AllMatches).Count
}

Write-Host ""
Write-Host "==================== 完成 ====================" -ForegroundColor Cyan
Write-Host ("  客户端文件数 : {0}" -f (Get-IndexCount 'index.toml'))
if (-not $NoServer) {
    Write-Host ("  服务端文件数 : {0}" -f (Get-IndexCount 'index-server.toml'))
}

# 列出本次改动（git 用户能看到改了哪些文件）
if (Test-Path (Join-Path $root '.git')) {
    $changed = & git status --short 2>$null
    if ($changed) {
        Write-Host ""
        Write-Host "  本次有改动的文件：" -ForegroundColor Yellow
        $changed | Select-Object -First 40 | ForEach-Object { Write-Host "    $_" }
        if (($changed | Measure-Object).Count -gt 40) {
            Write-Host ("    ... 还有 {0} 个" -f (($changed | Measure-Object).Count - 40))
        }
    } else {
        Write-Host "  （没有检测到改动）" -ForegroundColor DarkGray
    }
}
Write-Host ""
Write-Host "下一步：在 VS Code 的源代码管理面板里 Commit + Push 即可。" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
