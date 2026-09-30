#!/usr/bin/env bash
# =====================================================================
#  All The Leisures - server updater (Linux)
# ---------------------------------------------------------------------
#  用法：
#     1. 把整个 update-scripts 目录放进服务端根目录（含 mods、config、
#        server.properties 的那一层）
#     2. chmod +x update-scripts/server/update-server.sh
#     3. 开服前执行：  ./update-scripts/server/update-server.sh
#
#  依赖：bash + curl。更新不需要 Java。
#  可选：设置代理前缀，例如
#        PROXY=https://ghfast.top ./update-scripts/server/update-server.sh
# =====================================================================
set -euo pipefail

PACK_URL="${PACK_URL:-https://raw.githubusercontent.com/lunaticsele/All-The-Leisures/server/pack.toml}"
PROXY="${PROXY:-}"
PROXY="${PROXY%/}"

# 脚本目录 -> update-scripts -> 服务端根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$DEST"

echo "============================================================"
echo "  All The Leisures - server updater"
echo "============================================================"
echo "  更新源    : $PACK_URL"
echo "  服务端目录: $DEST"
[ -n "$PROXY" ] && echo "  代理      : $PROXY"
echo ""

fetch() {
    # $1 = 相对/绝对 URL， $2 = 输出文件（空则输出到 stdout）
    local url="$1" out="${2:-}"
    local targets=("$url")
    [ -n "$PROXY" ] && targets+=("$PROXY/$url")

    for t in "${targets[@]}"; do
        for attempt in 1 2 3; do
            if [ -n "$out" ]; then
                if curl -fsSL --retry 2 --connect-timeout 20 --max-time 600 -o "$out" "$t"; then
                    return 0
                fi
            else
                if curl -fsSL --retry 2 --connect-timeout 20 --max-time 120 "$t"; then
                    return 0
                fi
            fi
            sleep 1
        done
    done
    return 1
}

echo "[1/4] 读取远端整合包信息..."
if ! PACK_TEXT="$(fetch "$PACK_URL")"; then
    echo "  [失败] 无法下载 pack.toml，检查网络或用 PROXY 变量指定代理。" >&2
    exit 1
fi

INDEX_FILE="$(printf '%s\n' "$PACK_TEXT" | awk '
    /^\[index\]/ { inidx=1; next }
    /^\[/        { inidx=0 }
    inidx && $1 == "file" { gsub(/[" ]/, "", $2); print $2; exit }')"

[ -n "$INDEX_FILE" ] || { echo "  [失败] pack.toml 里没有 index.file" >&2; exit 1; }
BASE_URL="${PACK_URL%/*}"
echo "  [OK]   索引文件：$INDEX_FILE"

if ! INDEX_TEXT="$(fetch "$BASE_URL/$INDEX_FILE")"; then
    echo "  [失败] 无法下载索引文件。" >&2
    exit 1
fi

REGISTRY="$DEST/.atl-pack-managed.txt"
TMP_NEW="$(mktemp)"; TMP_REG="$(mktemp)"
trap 'rm -f "$TMP_NEW" "$TMP_REG"' EXIT

printf '%s\n' "$INDEX_TEXT" | awk '
    /^\[\[files\]\]/ { f=""; h=""; next }
    $1 == "file" { gsub(/[" ]/, "", $2); f=$2 }
    $1 == "hash" { gsub(/[" ]/, "", $2); h=$2 }
    f != "" && h != "" { print h "\t" f; f=""; h="" }
' > "$TMP_NEW"

TOTAL="$(wc -l < "$TMP_NEW" | tr -d ' ')"
[ "$TOTAL" -gt 0 ] || { echo "  [失败] 索引里没有文件，选错分支了？" >&2; exit 1; }
echo "  [OK]   远端共有 $TOTAL 个文件"

# ---------------------------------------------------------------------
echo ""
echo "[2/4] 对比本地文件..."
NEED=0; SAME=0
: > "$TMP_REG"
while IFS=$'\t' read -r hash file; do
    printf '%s\n' "$file" >> "$TMP_REG"
    if [ -f "$DEST/$file" ]; then
        local_hash="$(sha256sum "$DEST/$file" | awk '{print $1}')"
        if [ "$local_hash" = "$hash" ]; then SAME=$((SAME+1)); continue; fi
    fi
    NEED=$((NEED+1))
done < "$TMP_NEW"
echo "  [OK]   本地已是最新：$SAME 个"
echo "  [OK]   需要下载/覆盖：$NEED 个"

# ---------------------------------------------------------------------
echo ""
echo "[3/4] 下载更新..."
DONE=0; FAILED=0
while IFS=$'\t' read -r hash file; do
    target="$DEST/$file"
    if [ -f "$target" ] && [ "$(sha256sum "$target" | awk '{print $1}')" = "$hash" ]; then
        continue
    fi
    DONE=$((DONE+1))
    mkdir -p "$(dirname "$target")"
    if fetch "$BASE_URL/$file" "$target.tmp"; then
        mv -f "$target.tmp" "$target"
        printf '\r  [%3d%%] %d/%d  %s' "$((DONE*100/NEED))" "$DONE" "$NEED" "$file"
    else
        rm -f "$target.tmp"
        echo ""
        echo "  [失败] $file"
        FAILED=$((FAILED+1))
    fi
done < "$TMP_NEW"
[ "$NEED" -gt 0 ] && echo ""

# ---------------------------------------------------------------------
echo ""
echo "[4/4] 收尾..."
DELETED=0
if [ -f "$REGISTRY" ]; then
    while IFS= read -r old; do
        [ -n "$old" ] || continue
        if ! grep -qxF "$old" "$TMP_REG"; then
            if [ -f "$DEST/$old" ]; then
                rm -f "$DEST/$old"
                DELETED=$((DELETED+1))
            fi
        fi
    done < "$REGISTRY"
fi
[ "$DELETED" -gt 0 ] && echo "  [OK]   已删除 $DELETED 个旧文件"
cp -f "$TMP_REG" "$REGISTRY"
echo "  [OK]   已记录文件清单：$REGISTRY"

echo ""
echo "============================================================"
if [ "$FAILED" -gt 0 ]; then
    echo "  有 $FAILED 个文件失败，请重跑本脚本。"
    echo "============================================================"
    exit 2
fi
echo "  更新完成，可以开服了！"
echo "============================================================"
