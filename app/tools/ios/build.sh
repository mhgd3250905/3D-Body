#!/usr/bin/env bash
# Flare iOS 构建入口（在 Mac 上运行）
#   bash app/tools/ios/build.sh check        # analyze + 单元测试（与 Android 相同）
#   bash app/tools/ios/build.sh sim          # 模拟器 Debug 构建（不需要签名）
#   bash app/tools/ios/build.sh smoke <设备>  # 设备/模拟器上跑 3D 冒烟测试
#   bash app/tools/ios/build.sh device       # 编译 Release 并装到已连接的 iPhone（需签名）
#   bash app/tools/ios/build.sh ipa          # App Store / TestFlight 用 IPA（需签名 + ExportOptions 填 teamID）
set -euo pipefail
cd "$(dirname "$0")/../.."   # -> app/
restore() { git checkout -q -- analysis_options.yaml 2>/dev/null || true; }
trap restore EXIT
case "${1:-}" in
  check)
    flutter pub get
    dart analyze lib test test_screens integration_test
    flutter test --no-pub ;;
  sim)
    flutter build ios --simulator --debug ;;
  smoke)
    dev="${2:?用法: build.sh smoke <device-id>（flutter devices 查看）}"
    flutter test integration_test/ios_smoke_test.dart -d "$dev" ;;
  device)
    flutter run --release ;;
  ipa)
    grep -q "__TEAM_ID__" tools/ios/ExportOptions.plist && { echo "先在 tools/ios/ExportOptions.plist 填 teamID"; exit 1; }
    flutter build ipa --release --export-options-plist=tools/ios/ExportOptions.plist
    ls -la build/ios/ipa/ ;;
  *) sed -n '2,8p' "$0"; exit 1 ;;
esac
