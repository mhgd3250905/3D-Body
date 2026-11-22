# iOS Build5 真机更新（2026-10-13）

用户明确连接真机并要求更新。已将本轮L43对齐源码的Release/AOT开发签名版安装到连接的 iPhone 16 Pro / iOS26.5；没有卸载或重置App。安装后设备重读确认 **1.0.0（5）**，安装前后原偏好完整一致，训练记录和设置保留。

## 用户验收与版本保存

2026-10-13用户明确回复：“我已经看到更新了 验证通过 你可以保存做个版本管理吧”。据此将本次 **iOS L43 / 1.0.0（5）更新**记为用户真机验收通过。Agent已有证据为签名验包、设备安装/启动、进程存活和原记录/设置保留；用户实际画面和更新验看作为用户报告记录，不冒称Agent观察了完整功能矩阵。

固定产品源为 `b78164210a8c59d3374da5d9c3840afc44e5e5cf`，本机IPA和归档原样保留，哈希再次回读一致。没有修改生产源码、递增Build或重新构建。本地注释标签 **`ios-build5-accepted-20261013`** 指向本次验收文档保存提交；该提交只补文档，可通过 `git rev-parse ios-build5-accepted-20261013^{commit}` 定位。标签注释记录产品源、版本/Build、IPA哈希和用户确认，标签与提交未push。

本机受限目录另存 `acceptance.json`，绑定版本、产品源、验收保存提交与标签。长期计时、旧机性能、完整14语和真实系统回收等专项仍沿用待验收台账；本次用户确认不自动关闭未独立测试的专项。商店S4保持独立历史候选，未操作Apple平台。

## 安装身份

| 项目 | 实际结果 |
| --- | --- |
| 产品源 | `b78164210a8c59d3374da5d9c3840afc44e5e5cf`，`ios/main`；基线主线`4e7aaed` |
| 版本 / Bundle ID | `1.0.0 (5)` / `dev.mhgd.flare` |
| 安装前 | 手机旧版本`1.0.0 (3)` |
| 构建 | Flutter3.44.7 / Dart3.12.2 / Xcode26.6；Release/AOT，非Debug程序 |
| 签名 | 本机现有Apple Development身份和包含此设备的未过期缓存profile，导出`method=debugging`；`get-task-allow=true`，用于开发签名直接安装 |
| IPA字节数 / SHA-256 | 89161167 / `50843be45592747abcd220759353c0a9e624a1531def0a9e6b14cc0d1cce2a05` |
| 验包 | `codesign --verify --deep --strict`通过，arm64、版本/Build/Bundle匹配、4份隐私清单可解析，设备包含及profile有效期检查通过 |
| 安装 | `devicectl device install app`成功；`device info apps`重读Build5 |
| 数据保留 | 安装前私密复制旧偏好；安装后启动前逐项比较完整plist相同；未写入/删除用户记录 |
| 启动 | 首次命令被系统以`Locked / FBSOpenApplicationErrorDomain=7`拒绝，手机尚未解锁；不是App崩溃。用户解锁后再次启动成功，系统重读确认该进程仍运行；启动后旧训练/学习记录和原设置逐项相同，仅新增language设置及正常更新动作位置。此前画面与新功能待用户验看；用户随后明确确认看到更新并表示“验证通过”，见下方验收记录 |

本机产物与受限证据目录：`/Users/shengkai/ios-release-artifacts/flare-build5-20261013`。归档为`Flare-Build5.xcarchive`，IPA在`export/flare.ipa`；签名配置、设备标识、原偏好和完整安装/启动日志仅保存在该私密目录，不写Git或聊天。

## 实际流程与边界

1. 只读预检确认工作区干净、源提交、Build5、同Bundle ID、USB连接且Developer Mode启用；上轮130项回归、20组布局、3项Simulator原生集成与静态分析证据见[对齐记录](ios-l43-rebase-2026-10-13.md)，本轮产品源码未变，未重复全量测试。
2. `flutter build ios --release --no-codesign --no-pub --target=lib/main.dart`成功；`xcodebuild archive`和`-exportArchive`用已有本机缓存签名成功。未传`-allowProvisioningUpdates`，未注册/下载证书或profile，未修改Apple门户。
3. 验包通过后直接覆盖安装同Bundle ID，未卸载；设备安装查询和私密偏好比较通过。首次启动遇系统锁屏；用户确认解锁后再次启动成功，后续进程存活及原记录/设置保留检查通过。新版本只新增language设置，动作位置随播放正常更新。

本轮只授权连接设备更新。没有push、上传App Store Connect、TestFlight分发、取消/重提审核或公开发布；原商店S4 `1.0.0 (3)`及其文件保持，未刷新平台审核状态。Build5包含14语及原51正式视频，94项新人体素材未自动选入。长期计时、旧机性能、全14语及完整真机矩阵仍待验收，安装成功不代表这些项目已通过。
