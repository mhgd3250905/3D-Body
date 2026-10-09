#!/usr/bin/env bash
# Flare iOS 环境自检（在 Mac 上运行）：bash app/tools/ios/doctor.sh
# 只读检查 + flutter pub get；不改签名、不装证书。
set -u
cd "$(dirname "$0")/../.."   # -> app/
ok=0; bad=0
pass() { printf '  \033[32m✔\033[0m %s\n' "$1"; ok=$((ok+1)); }
fail() { printf '  \033[31m✘\033[0m %s\n' "$1"; bad=$((bad+1)); }

echo "Flare iOS doctor  ($(pwd))"
[[ "$(uname)" == "Darwin" ]] && pass "macOS $(sw_vers -productVersion)" || { fail "需要 macOS"; exit 1; }

if xcodebuild -version >/dev/null 2>&1; then
  xv=$(xcodebuild -version | head -1 | awk '{print $2}')
  [[ ${xv%%.*} -ge 16 ]] && pass "Xcode $xv" || fail "Xcode $xv（需要 ≥ 16，App Store 上传要求最新正式版 SDK）"
else fail "未找到 Xcode（App Store 安装后运行 sudo xcode-select -s /Applications/Xcode.app）"; fi

want=3.47.6
if command -v flutter >/dev/null; then
  fv=$(flutter --version 2>/dev/null | head -1 | awk '{print $2}')
  [[ "$fv" == "$want" ]] && pass "Flutter $fv" || fail "Flutter $fv（项目基线 $want：flutter version / fvm use $want）"
else fail "未找到 flutter"; fi

xcrun simctl list runtimes 2>/dev/null | grep -q "iOS" && pass "iOS 模拟器运行时已安装" || fail "没有 iOS 模拟器运行时（Xcode > Settings > Components）"

for f in ios/Runner/Info.plist ios/Runner/PrivacyInfo.xcprivacy tools/ios/ExportOptions.plist; do
  plutil -lint "$f" >/dev/null 2>&1 && pass "plist OK: $f" || fail "plist 无效: $f"
done
grep -q "IPHONEOS_DEPLOYMENT_TARGET = 15.0" ios/Runner.xcodeproj/project.pbxproj && pass "最低 iOS 15.0" || fail "部署目标不是 15.0"
[[ -f assets/scene/index.html ]] && pass "3D 场景构建产物在 assets/scene/（无需 Node）" || fail "缺 assets/scene/index.html"

if flutter pub get >/dev/null 2>&1; then pass "flutter pub get"; else fail "flutter pub get 失败（国内网络可设 PUB_HOSTED_URL=https://pub.flutter-io.cn）"; fi
git checkout -q -- analysis_options.yaml 2>/dev/null || true

echo; echo "设备："; flutter devices 2>/dev/null | sed 's/^/  /'
echo; [[ $bad -eq 0 ]] && echo "全部通过（$ok 项）" || { echo "$bad 项未通过，先按提示处理"; exit 1; }
