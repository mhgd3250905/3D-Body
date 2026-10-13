# iOS L44 Build6 真机更新（2026-10-13）

用户再次连接真机并要求更新。已将L44 **1.0.1（6）Release/AOT开发签名版**保留数据安装到 iPhone16 Pro / iOS26.5，旧版为已验收的1.0.0（5）。安装成功后设备重读版本/Build一致，启动前完整偏好plist与安装前完全相同。未卸载、重置或写入用户训练记录。

## 固定安装身份

| 项目 | 实际结果 |
| --- | --- |
| 产品源 | `0e6185fdeb0020b54a4c73892051277944080373`，`ios/main`，L44主线基线`441dfa681c4bbf14c9ac3037d48bca086e93b558` |
| 版本 / Bundle ID | `1.0.1 (6)` / `dev.mhgd.flare` |
| 旧安装 | `1.0.0 (5)`，原验收标签和IPA保留 |
| 构建 | Flutter3.44.7 / Dart3.12.2 / Xcode26.6，Release/AOT；先config-only准备Release配置，再实际Xcode archive编译归档，避免重复构建 |
| 签名 / 导出 | 现有Apple Development与目标设备已包含的未过期缓存profile，自动选择本机缓存；`method=debugging` / `get-task-allow=true`用于开发直接安装，不是Debug运行程序 |
| IPA字节数 / SHA-256 | 68267481 / `7bb5bcb72d900e4760bee40e6d64ee880d8e2a298058f0debf6a1d2c99da846c` |
| 验包 | 严格深度codesign通过，arm64、身份、目标设备/有效期及4份隐私清单可解析 |
| 包内新资产 | 51视频＋51封面逐项SHA与L44清单一致；新清单及collarfix领口模型与已验证源码一致 |
| 安装 / 数据 | `devicectl device install app`成功；安装后设备重读Build6，原偏好plist完整相同，记录与设置保留 |
| 启动 | 安装后只读lockState仍为锁屏，已请用户解锁；未将启动或完整新功能真机验看记为通过 |

本机归档、IPA、签名配置、私密偏好备份及设备标识日志保存在受限目录 `/Users/shengkai/ios-release-artifacts/flare-build6-20261013`，不进Git。固定归档为`Flare-Build6.xcarchive`，IPA为`export/flare.ipa`，身份与状态见私密`install-manifest.json`。

## 检查与范围

只读预检通过，起点工作区干净，当前用户设备iOS26.5、Developer Mode启用；现有签名缓存可用。源码自上轮[对齐验证](ios-l44-rebase-2026-10-13.md)未变，154项相关回归、4项Simulator实际WKWebView集成、分析和构建的已取得结果保持，未重复全量测试。

新版带入“更多 → 设置 → 托马斯形象”可保存的卡通教练/训练人台选择、领口修复及51项新视频。旧数据默认原教练；切换的暂停帧/详情/质量与偏好保存已有Simulator证据。此处安装验证只证明精确Build6上机与数据保留，不能当作用户已认可新版全部观感或28项素材QA提示全部解决。

未传`-allowProvisioningUpdates`，没有注册/下载证书、更新Apple门户、push、上传App Store Connect、分发TestFlight、重提审核或公开发布；S4 1.0.0（3）及已验收Build5归档/IPA/标签保持。长期计时、旧机/完整14语/读屏与真实系统回收等专项仍在[实施路线](development-roadmap.md)。
