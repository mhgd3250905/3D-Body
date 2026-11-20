enum FlareDemoOrientation { bilateral, left }

/// The trainer's default mirrors a right-side clip for the left phase.
/// These baked demonstrations need a different rule.
const flareDemoOrientationOverrides = {
  't-step-jack-arm-circles': FlareDemoOrientation.bilateral,
  't-neck-wrist-finger-wakeup': FlareDemoOrientation.bilateral,
  't-wide-side-squat-shift': FlareDemoOrientation.bilateral,
  't-standing-neck-side-stretch': FlareDemoOrientation.bilateral,
  't-side-lying-straight-leg-abduction': FlareDemoOrientation.left,
};

bool flareDemoMirrored(String mediaActionId, bool sdkMirrored) =>
    switch (flareDemoOrientationOverrides[mediaActionId]) {
      FlareDemoOrientation.bilateral => false,
      FlareDemoOrientation.left => !sdkMirrored,
      null => sdkMirrored,
    };
