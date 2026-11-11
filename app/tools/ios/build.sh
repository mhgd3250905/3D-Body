#!/usr/bin/env bash
# Flare iOS 构建入口（在 Mac 上运行）
#   bash app/tools/ios/build.sh check        # analyze + 单元测试（与 Android 相同）
#   bash app/tools/ios/build.sh sim          # 模拟器 Debug 构建（不需要签名）
#   bash app/tools/ios/build.sh smoke <设备>  # 设备/模拟器上跑 3D 冒烟测试
#   bash app/tools/ios/build.sh device <设备> # 编译 Release 并装到指定 iPhone（需签名）
#   bash app/tools/ios/build.sh ipa          # 需签名；EXPORT_OPTIONS_PLIST 指向本机导出配置
# 可用 FLUTTER_BIN 指定独立 SDK，不改变系统默认 Flutter。
# COACH_CONFIG_FILE 指向本机私有 JSON；ipa 默认要求 AI，专用无 AI 包须显式 IOS_REQUIRE_AI=0。
set -euo pipefail
cd "$(dirname "$0")/../.."   # -> app/
flutter_bin="${FLUTTER_BIN:-flutter}"
coach_config="${COACH_CONFIG_FILE:-}"
default_require_ai=0
[[ "${1:-}" != ipa ]] || default_require_ai=1
require_ai="${IOS_REQUIRE_AI:-$default_require_ai}"
[[ "$require_ai" == 0 || "$require_ai" == 1 ]] || { echo "IOS_REQUIRE_AI 必须为 0 或 1"; exit 1; }
if [[ -n "$coach_config" ]]; then
  [[ -f "$coach_config" ]] || { echo "COACH_CONFIG_FILE 指定的本机配置不存在"; exit 1; }
  # Report only validity; never print configuration values or pass a token in argv.
  python3 - "$coach_config" <<'PY'
import json
import sys

try:
    with open(sys.argv[1], encoding='utf-8') as source:
        config = json.load(source)
    valid = isinstance(config, dict) and any(
        isinstance(config.get(name), str) and config[name].strip()
        for name in ('UGK_COACH_API_KEY', 'UGK_COACH_RELAY_TOKEN')
    )
except (OSError, ValueError):
    valid = False
if not valid:
    sys.exit('AI 配置必须是含非空 App API key 或 relay token 的 JSON 对象')
PY
elif [[ "$require_ai" == 1 ]]; then
  echo "本次要求 AI 功能，请先设置 COACH_CONFIG_FILE；未开始构建"
  exit 1
fi

build_flutter() {
  if [[ -n "$coach_config" ]]; then
    "$flutter_bin" "$@" "--dart-define-from-file=$coach_config"
  else
    "$flutter_bin" "$@"
  fi
}
case "${1:-}" in
  check)
    "$flutter_bin" pub get
    "$flutter_bin" analyze --no-pub
    "$flutter_bin" test --no-pub ;;
  sim)
    build_flutter build ios --simulator --debug --target=lib/main.dart ;;
  smoke)
    dev="${2:?用法: build.sh smoke <device-id>（flutter devices 查看）}"
    build_flutter test integration_test/ios_smoke_test.dart -d "$dev" ;;
  device)
    dev="${2:?用法: build.sh device <device-id>（flutter devices 查看）}"
    build_flutter run --release --target=lib/main.dart -d "$dev" ;;
  ipa)
    export_options="${EXPORT_OPTIONS_PLIST:-tools/ios/ExportOptions.plist}"
    [[ -f "$export_options" ]] || { echo "EXPORT_OPTIONS_PLIST 指定的文件不存在"; exit 1; }
    grep -q "__TEAM_ID__" "$export_options" && { echo "请用 EXPORT_OPTIONS_PLIST 指定填写完成的本机导出配置；不要提交签名信息"; exit 1; }
    build_number="${IOS_BUILD_NUMBER:?请先查 App Store Connect 最大构建号，再指定更大的 IOS_BUILD_NUMBER；已上传 Build 8}"
    [[ "$build_number" =~ ^[0-9]+$ && "$build_number" -gt 8 ]] || { echo "IOS_BUILD_NUMBER 必须大于已记录上传 Build 8，且须重新核对线上最大值"; exit 1; }
    build_flutter build ipa --release --target=lib/main.dart --build-number="$build_number" --export-options-plist="$export_options"
    ls -la build/ios/ipa/ ;;
  *) sed -n '2,9p' "$0"; exit 1 ;;
esac
