import 'package:flare/trainer/flare_demo_orientation.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('the bundled demonstrations keep their recorded side orientation', () {
    for (final id in [
      't-step-jack-arm-circles',
      't-neck-wrist-finger-wakeup',
      't-wide-side-squat-shift',
      't-standing-neck-side-stretch',
      't-kneeling-wrist-pushup',
      't-kneeling-fist-plank',
      't-prone-t-w',
      't-straight-arm-side-plank-switch',
      't-planche-lean-hold',
      't-pseudo-planche-pushup-v2',
      't-floor-tuck-hold',
      't-supine-straddle-open-close',
      't-standing-clasp-chest-opener',
    ]) {
      expect(flareDemoMirrored(id, false), isFalse);
      expect(flareDemoMirrored(id, true), isFalse);
    }
    expect(flareDemoMirrored('t-forearm-side-plank', true), isFalse);
    expect(flareDemoMirrored('t-forearm-side-plank', false), isTrue);
    expect(
      flareDemoMirrored('t-standing-wrist-flexor-stretch', false),
      isFalse,
    );
    expect(flareDemoMirrored('t-standing-wrist-flexor-stretch', true), isTrue);
    expect(
      flareDemoMirrored('t-side-lying-straight-leg-abduction', false),
      isTrue,
    );
    expect(
      flareDemoMirrored('t-side-lying-straight-leg-abduction', true),
      isFalse,
    );
  });
}
