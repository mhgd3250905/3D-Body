#!/usr/bin/env bash
# Flare iOS 构建入口（在 Mac 上运行）
#   bash app/tools/ios/build.sh check        # analyze + 单元测试（与 Android 相同）
#   bash app/tools/ios/build.sh sim          # 模拟器 Debug 构建（不需要签名）
#   bash app/tools/ios/build.sh smoke <设备>  # 设备/模拟器上跑 3D 冒烟测试
#   bash app/tools/ios/build.sh device <设备> # 编译 Release 并装到指定 iPhone（需签名）
#   bash app/tools/ios/build.sh ipa          # 需签名；EXPORT_OPTIONS_PLIST 指向本机导出配置
# 可用 FLUTTER_BIN 指定独立 SDK，不改变系统默认 Flutter。
set -euo pipefail
cd "$(dirname "$0")/../.."   # -> app/
flutter_bin="${FLUTTER_BIN:-flutter}"
case "${1:-}" in
  check)
    "$flutter_bin" pub get
    "$flutter_bin" analyze --no-pub
    "$flutter_bin" test --no-pub ;;
  sim)
    "$flutter_bin" build ios --simulator --debug --target=lib/main.dart ;;
  smoke)
    dev="${2:?用法: build.sh smoke <device-id>（flutter devices 查看）}"
    "$flutter_bin" test integration_test/ios_smoke_test.dart -d "$dev" ;;
  device)
    dev="${2:?用法: build.sh device <device-id>（flutter devices 查看）}"
    "$flutter_bin" run --release --target=lib/main.dart -d "$dev" ;;
  ipa)
    export_options="${EXPORT_OPTIONS_PLIST:-tools/ios/ExportOptions.plist}"
    [[ -f "$export_options" ]] || { echo "EXPORT_OPTIONS_PLIST 指定的文件不存在"; exit 1; }
    grep -q "__TEAM_ID__" "$export_options" && { echo "请用 EXPORT_OPTIONS_PLIST 指定填写完成的本机导出配置；不要提交签名信息"; exit 1; }
    "$flutter_bin" build ipa --release --target=lib/main.dart --export-options-plist="$export_options"
    ls -la build/ios/ipa/ ;;
  *) sed -n '2,9p' "$0"; exit 1 ;;
esac
