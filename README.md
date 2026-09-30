# All The Leisures · 整合包更新仓库

这个仓库是整合包 **All The Leisures**（Minecraft 1.21.1 / NeoForge 21.1.241）的
**配置与脚本分发仓库**。它同时承担三件事：

| 你的需求 | 本仓库怎么实现 |
| --- | --- |
| 随时把 `config` / `kubejs` / `scripts` 的改动推到 GitHub | 用 Git 管理这些文件夹，`tools/build.ps1` 自动重算索引 |
| 通过 VS Code 推送 | 仓库已初始化好 Git，VS Code 的「源代码管理」面板直接 Commit + Push |
| 玩家能从 GitHub 拉取更新 | 客户端读 `main` 分支的 `pack.toml`；服务端读自动生成的 `server` 分支 |

分发机制使用 [packwiz](https://packwiz.infra.link/) 的开放格式：仓库根目录下
`pack.toml` + `index.toml` 是**清单**，`index.toml` 里记录了每个文件的 SHA256。
更新器只要比对哈希，就能做到 **只下载变化的文件**，而不是每次全量重下。

---

## 一、目录结构

```
atl_lib/
├─ config/                     ← 你的配置（会被分发给玩家）
├─ kubejs/                     ← 你的 KubeJS 脚本与资源
├─ scripts/                    ← 你的脚本
├─ pack.toml                   ← 客户端清单入口（玩家读这个）
├─ index.toml                  ← 客户端文件索引（自动生成，勿手改）
├─ server-pack.toml            ← 服务端清单模板
├─ index-server.toml           ← 服务端文件索引（自动生成，勿手改）
├─ .packwizignore              ← 哪些文件【不】分发给玩家（语法同 .gitignore）
├─ server.packwizignore        ← 服务端【额外】排除的文件
├─ .gitattributes              ← 关键！禁止 Git 改换行符，否则哈希全错
├─ .gitignore                  ← 哪些文件不进 Git
├─ packwiz.exe                 ← 打包工具（不进 Git，只在你本机用）
├─ tools/
│  └─ build.ps1                ← 【推送前必须运行】重建两个索引
├─ update-scripts/             ← 给玩家/服务端用的更新脚本（整包发给玩家）
│  ├─ packwiz-update.ps1       ← 更新器本体（哈希比对 + 增量下载）
│  ├─ client/update.bat        ← 玩家双击这个
│  └─ server/
│     ├─ update-server.bat     ← 服务端（Windows）双击
│     └─ update-server.sh      ← 服务端（Linux）执行
├─ docs/                       ← 说明文档
└─ .github/workflows/
   └─ build-server.yml         ← 自动构建并推送 server 分支
```

---

## 二、你的日常工作流（改内容 → 推送）

> **每次改完 `config` / `kubejs` / `scripts`，都要先重建索引，再推送。**
> 不重建索引，玩家的更新器会认为「已是最新」，你的改动不会下发。

1. **改文件**：用 VS Code 直接编辑 `config/`、`kubejs/`、`scripts/` 里的内容。
2. **重建索引**：在仓库根目录打开 PowerShell，运行

   ```powershell
   powershell -ExecutionPolicy Bypass -File tools\build.ps1
   ```

   成功后会打印客户端/服务端文件数，并列出本次改动的文件。
   （想只更新客户端索引就加 `-NoServer`。）

3. **推送**：打开 VS Code 左侧「源代码管理」（Ctrl+Shift+G），
   填写提交信息 → **提交** → **同步更改 / 推送**。

推送完成后：
- 玩家下次运行 `update.bat` 就会收到更新；
- GitHub Actions 会自动重建 `server` 分支（约 1 分钟），服务端随后也能更新。

### 用命令行推送也可以

```powershell
git add -A
git commit -m "调整了 xx 配置"
git push
```

---

## 三、首次发布：把仓库传上 GitHub

本地仓库已经初始化好了，你只需要建一个远程仓库并推上去。

**推荐：用 VS Code 图形界面**

1. 打开 VS Code → `文件` → `打开文件夹` → 选择本目录 `atl_lib`。
2. 左下角「发布到 GitHub」按钮（或源代码管理面板里的 `Publish Branch`）。
3. 仓库名填 `All-The-Leisures`，**建议设为 Public**（私有仓库的 raw 链接无法给玩家直连下载）。
4. 发布后，确认地址是 `https://github.com/lunaticsele/All-The-Leisures`。
   **如果仓库名不一样**，请全局替换下面这些地方：

   | 文件 | 需要改的内容 |
   | --- | --- |
   | `update-scripts/packwiz-update.ps1` | 两处默认 `$Url` |
   | `update-scripts/client/update.bat` | 提示文字里的地址（可选） |
   | `update-scripts/server/update-server.bat` | 提示文字里的地址（可选） |
   | `update-scripts/server/update-server.sh` | 默认 `PACK_URL` |

**或者用命令行**

```powershell
git remote add origin https://github.com/lunaticsele/All-The-Leisures.git
git push -u origin main
```

> 本机 Git 身份已配置为 `lunaticsele <664509384@qq.com>`，如需修改：
> `git config --global user.name "你的名字"` / `git config --global user.email "你的邮箱"`

---

## 四、玩家怎么更新（客户端）

打包给玩家的是 **`update-scripts` 整个文件夹**，解压到整合包目录
（也就是含 `mods`、`config`、`kubejs` 的那一层，和 `.minecraft` 同级关系要对）。

> 已经帮你打好了现成的压缩包：[`dist/All-The-Leisures-update.zip`](dist/All-The-Leisures-update.zip)，
> 解压后就是 `update-scripts\`。你可以把它上传到群文件 / 网盘直接发给玩家。
> `dist/` 已在 `.gitignore` 中，不会进 Git 仓库；脚本改动后重新打包即可
> （把 `update-scripts` 文件夹重新压缩一次，注意压缩包内顶层是 `update-scripts`）。

玩家只需要 **双击 `update-scripts\client\update.bat`**，脚本会：

1. 从 `main` 分支下载 `pack.toml` 和 `index.toml`；
2. 逐个比对本地文件的 SHA256；
3. 只下载变化的文件，并删除整合包里已移除的文件；
4. 本地被误改的配置文件会被**自动修复**回官方版本（这是特性，不是 bug）。

更新器用 Windows 自带的 PowerShell，**不需要 Java**，也不依赖任何启动器。
PCL2 / HMCL / 官方启动器都通用：**先更新，再用启动器启动游戏**。

国内网络直连 GitHub 经常失败，此时用代理：

```bat
update.bat -Proxy https://ghfast.top
```

详细图文说明见 [`docs/玩家更新说明.md`](docs/玩家更新说明.md)。

> 也可以选择官方 `packwiz-installer` 路线（MultiMC/Prism 预启动命令），
> 但**注意**：官方 `packwiz-installer-bootstrap.jar` 内部指向的是
> `comp500/packwiz-installer`，而那里并没有发布任何 release，
> 所以它现在无法自行下载安装器。这也是本仓库自带原生更新器的原因。

---

## 五、服务端怎么更新

服务端**不要**用客户端索引：客户端索引包含 `kubejs/client_scripts`、
菜单/光影配置等纯客户端文件，推到服务端只会增加体积甚至报错。

因此仓库用 **`server` 分支** 单独分发服务端内容：

- 你 push 到 `main` 后，[`.github/workflows/build-server.yml`](.github/workflows/build-server.yml)
  会自动读取 `server.packwizignore`、重建服务端索引，并强制推送到 `server` 分支；
- 服务端脚本默认读 `server` 分支：

  ```
  https://raw.githubusercontent.com/lunaticsele/All-The-Leisures/server/pack.toml
  ```

- 目前服务端会自动剔除：`kubejs/client_scripts/`、`kubejs/assets/`、
  `config/**/*-client.toml` 以及一批纯客户端 mod 的配置目录
  （清单见 [`server.packwizignore`](server.packwizignore)，随时可增删）。

**服务端操作**

- Windows：把 `update-scripts` 放进服务端根目录，**开服前**双击
  `update-scripts\server\update-server.bat`。
- Linux：

  ```bash
  chmod +x update-scripts/server/update-server.sh
  ./update-scripts/server/update-server.sh          # 可加 PROXY=https://ghfast.top
  ```

也可以把它接进开服脚本，实现「每次开服自动同步」：

```bash
#!/usr/bin/env bash
./update-scripts/server/update-server.sh || { echo "更新失败，已中止开服"; exit 1; }
java -Xmx8G @user_jvm_args.txt @libraries/net/neoforged/neoforge/21.1.241/unix_args.txt nogui
```

---

## 六、几条必须知道的规矩

1. **`.gitattributes` 里的 `* -text` 不要删。**
   packwiz 用 SHA256 校验文件，只要换行符被 Git 改过一次，所有人的哈希都会对不上，
   更新器就会反复重下同一个文件。
2. **`index.toml` / `index-server.toml` 不要手动编辑。**
   要改就改文件本身，然后重跑 `tools\build.ps1`。
3. **不要把 `mods/`、`shaderpacks/`、`resourcepacks/` 直接放进这个仓库。**
   mod 体积大，应该用 `packwiz modrinth add <名字>` / `packwiz curseforge add <名字>`
   生成 `.pw.toml` 元数据（只存下载地址和哈希，仓库几乎不增大）。
   本仓库目前只管理 `config` / `kubejs` / `scripts` 三类文件。
4. **新增「不该发给玩家」的文件**（比如新的说明文档、截图目录），
   请加进 [`.packwizignore`](.packwizignore)。
5. **玩家会覆盖本地改动。** KubeJS/配置属于服务端统一下发的内容，
   想留个性化设置请放到游戏目录里不受管理的文件（或提前和玩家说明）。

---

## 七、常见问题

**Q：我改了文件也推送了，玩家那边没变化？**
A：99% 是忘了跑 `tools\build.ps1`。索引没变，更新器就认为没更新。
推送前请确认 `index.toml` 也出现在本次提交里。

**Q：玩家报 `Invoke-WebRequest` 下载失败 / 超时？**
A：GitHub raw 域名在国内不稳定。让玩家加代理参数：
`update.bat -Proxy https://ghfast.top`。

**Q：GitHub Actions 里 `server` 分支没更新？**
A：打开仓库的 `Actions` 标签页看 `构建服务端更新分支 (server)` 的运行日志；
也可以在 `Actions` 里手动点 `Run workflow` 触发一次。

**Q：想换代理前缀？**
A：改脚本开头的 `$Proxy` 默认值，或让玩家在命令行传 `-Proxy`。

**Q：以后想加 mod 怎么办？**
A：在仓库根目录运行 `packwiz modrinth add 搜索关键词`，
它会生成 `mods/xxx.pw.toml`，然后照常 `tools\build.ps1` + 推送。
