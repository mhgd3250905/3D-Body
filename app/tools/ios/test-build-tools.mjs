// Offline regression checks for safe iOS build entry points. All mutations
// happen in this test's disposable repository; no SDK or signing is required.
import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const source = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const fixture = mkdtempSync(join(tmpdir(), 'flare-ios-tools-'));
const app = join(fixture, 'app');
const bin = join(fixture, 'bin');
const calls = join(fixture, 'flutter-calls');
const dirty = 'include: package:flutter_lints/flutter.yaml\n# Local, uncommitted setting\n';

function run(command, args, env = {}) {
  return spawnSync(command, args, {
    cwd: fixture, encoding: 'utf8',
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, FLUTTER_BIN: join(bin, 'project-flutter'), IOS_TOOL_CALLS: calls, ...env },
  });
}
function executable(name, body) {
  writeFileSync(join(bin, name), `#!/usr/bin/env bash\n${body}\n`, { mode: 0o755 });
}
function preserved() {
  assert.equal(readFileSync(join(app, 'analysis_options.yaml'), 'utf8'), dirty);
  assert.match(run('git', ['status', '--short']).stdout, /analysis_options.yaml/);
}

try {
  mkdirSync(bin);
  for (const file of ['tools/ios/build.sh', 'tools/ios/doctor.sh', 'tools/ios/ExportOptions.plist', 'ios/Runner/Info.plist', 'ios/Runner/PrivacyInfo.xcprivacy', 'ios/Runner.xcodeproj/project.pbxproj', 'assets/scene/index.html']) {
    mkdirSync(dirname(join(app, file)), { recursive: true });
    copyFileSync(join(source, file), join(app, file));
  }
  writeFileSync(join(app, 'analysis_options.yaml'), 'include: package:flutter_lints/flutter.yaml\n');
  assert.equal(run('git', ['-c', 'init.defaultBranch=main', 'init', '-q']).status, 0);
  assert.equal(run('git', ['add', 'app/analysis_options.yaml']).status, 0);
  assert.equal(run('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'Fixture baseline']).status, 0);
  writeFileSync(join(app, 'analysis_options.yaml'), dirty);
  writeFileSync(calls, '');
  executable('project-flutter', `printf '%s\\n' "$*" >> "$IOS_TOOL_CALLS"
if [[ "$1" == "--version" ]]; then echo 'Flutter 3.47.6 • channel stable'; fi
if [[ "$1 $2" == "pub get" && "\${IOS_TOOL_FAIL:-0}" == "1" ]]; then exit 75; fi`);
  executable('uname', "echo Darwin");
  executable('sw_vers', "echo 26.6");
  executable('xcodebuild', "echo 'Xcode 26.6'");
  executable('xcrun', "echo 'iOS 26.5 (available)'");
  executable('plutil', 'exit 0');

  assert.equal(run('bash', ['app/tools/ios/build.sh', 'check']).status, 0);
  preserved();
  assert.equal(run('bash', ['app/tools/ios/build.sh', 'check'], { IOS_TOOL_FAIL: '1' }).status, 75);
  preserved();
  assert.equal(run('bash', ['app/tools/ios/build.sh', 'unknown']).status, 1);
  preserved();
  assert.equal(run('bash', ['app/tools/ios/doctor.sh']).status, 0);
  preserved();
  assert.equal(run('bash', ['app/tools/ios/doctor.sh'], { IOS_TOOL_FAIL: '1' }).status, 1);
  preserved();

  const beforeDevice = readFileSync(calls, 'utf8');
  assert.notEqual(run('bash', ['app/tools/ios/build.sh', 'device']).status, 0);
  assert.equal(readFileSync(calls, 'utf8'), beforeDevice);
  assert.equal(run('bash', ['app/tools/ios/build.sh', 'device', 'fixture-device']).status, 0);
  assert.match(readFileSync(calls, 'utf8'), /run --release --target=lib\/main\.dart -d fixture-device/);
  assert.equal(run('bash', ['app/tools/ios/build.sh', 'sim']).status, 0);
  assert.match(readFileSync(calls, 'utf8'), /build ios --simulator --debug --target=lib\/main\.dart/);
  assert.notEqual(run('bash', ['app/tools/ios/build.sh', 'ipa']).status, 0);
  preserved();
  console.log('PASS: configuration changes survive success, dependency failure, and invalid usage; explicit SDK and device selection work; placeholder signing is refused.');
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
