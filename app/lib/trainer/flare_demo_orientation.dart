enum FlareDemoOrientation { bilateral, left }

/// The trainer's default mirrors a right-side clip for the left phase.
/// These baked demonstrations need a different rule.
const flareDemoOrientationOverrides = {
  't-step-jack-arm-circles': FlareDemoOrientation.bilateral,
  't-neck-wrist-finger-wakeup': FlareDemoOrientation.bilateral,
  't-wide-side-squat-shift': FlareDemoOrientation.bilateral,
  't-standing-neck-side-stretch': FlareDemoOrientation.bilateral,
  't-side-lying-straight-leg-abduction': FlareDemoOrientation.left,
  't-kneeling-wrist-pushup': FlareDemoOrientation.bilateral,
  't-kneeling-fist-plank': FlareDemoOrientation.bilateral,
  't-prone-t-w': FlareDemoOrientation.bilateral,
  't-straight-arm-side-plank-switch': FlareDemoOrientation.bilateral,
  't-planche-lean-hold': FlareDemoOrientation.bilateral,
  't-pseudo-planche-pushup-v2': FlareDemoOrientation.bilateral,
  't-floor-tuck-hold': FlareDemoOrientation.bilateral,
  't-supine-straddle-open-close': FlareDemoOrientation.bilateral,
  't-standing-clasp-chest-opener': FlareDemoOrientation.bilateral,
  't-forearm-side-plank': FlareDemoOrientation.left,
  't-9090-back-knee-lift': FlareDemoOrientation.left,
};

bool flareDemoMirrored(String mediaActionId, bool sdkMirrored) =>
    switch (flareDemoOrientationOverrides[mediaActionId]) {
      FlareDemoOrientation.bilateral => false,
      FlareDemoOrientation.left => !sdkMirrored,
      null => sdkMirrored,
    };
