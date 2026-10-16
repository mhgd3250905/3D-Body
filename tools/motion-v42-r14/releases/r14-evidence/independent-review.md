# R14 independent geometry and continuity review

Two actual candidate GLBs were compared to frozen R12 with AnimationMixer at 1,081 phases, including all 541 authored keys and their midpoints. Bone measurements match between the two character meshes. No source files were changed by this review.

Candidate identities:

- coach: `364faba82bb68d1d6a40f5cb53003d4ff721912445474c404548632a93e5921d`
- training: `1b65dfa69ef674ad968a1534e0e0d6e7fa1a28b07c4ca0d9132d36282f324e68`

## Plane and preserved quantities

The plane is independently reconstructed each sample from bilateral shoulders and supporting wrist. During full-weight plateaus, free elbow/wrist residuals are at most 0.0317 mm, including interpolation midpoints. At authored keys they are within floating-point tolerance. The supporting elbow inherits R12's slightly bent support arm and can remain about 3.81 mm off this plane; it was intentionally not changed.

Non-arm bones and both shoulder origins have exactly zero position change; protected quaternion comparisons remain below 0.00000342 degrees numerical noise. Outside each side's edit window, the largest position difference is 0.000095 mm at an interpolated boundary sample. Loop position seam is zero, quaternion seam is numerical noise.

| Quantity | Left | Right |
| --- | ---: | ---: |
| Maximum wrist displacement | 205.82 mm | 353.35 mm |
| Maximum elbow displacement | 282.46 mm | 366.62 mm |
| Maximum upper-arm world swing | 66.74° | 91.10° |
| Maximum hand world rotation | 46.73° | 64.35° |
| Segment-length difference | 0.09723 mm | 0.06848 mm |
| Shoulder-wrist reach difference | 0.01699 mm | 0.04783 mm |
| Elbow flexion difference | 0.01909° | 0.02805° |

The small length/reach/flexion residuals include linear interpolation between authored transforms. This is a substantial free-arm route change, especially right 60–74%, rather than a wrist-preserving pole edit.

At left 15.3704% the wrist moves 37.94 mm and elbow 161.50 mm. At right 87.5926%, the wrist moves 128.66 mm and elbow 145.12 mm, with near-zero authored plane residual.

## Ground and continuity

Actual skinned vertices were sampled at every phase: >0.5 hand-bone influence, >0.5 combined arm-bone influence, and the arm-weighted elbow neighborhood within 80 mm of the rest elbow. The two meshes share this geometry. There are no newly sampled hand vertices below y=0 or the existing visual floor y=-0.014 m. Active-window hand surface minima are left 62.81 mm and right 18.76 mm above y=0. Active elbow-neighborhood minima are 250.00 / 188.68 mm above y=0. These groups do not represent every mesh vertex or every possible surface pair.

Boundary checks around start/full/hold/end do not show a discontinuous pose or branch flip. Bend-direction maximum adjacent steps decreased relative to R12. Some intended route changes are faster: left peak elbow speed 6.793 versus 5.982 m/s; left sampled acceleration 733.62 versus 543.48 m/s², near 40% during exit. Right peak arm rotation velocity 1618 versus 1158 degrees/s, near 66.2%. Right elbow acceleration peak remains the inherited approximately 1409 m/s² near 51%. These are comparative authored-motion measurements, not biomechanical safety limits.

The 91-degree right upper-arm change warrants visual review of shoulder skin and the 60–74% movement. No shoulder collision or complete skin-distortion clearance is claimed by these bone/ground checks.

## Hand–leg near-distance screen

A separate actual-GLB scan checked both Hand origins against both Thigh and Shin line segments throughout 1,081 phases, with extra reporting for 60–74%.

- Right Hand → right Shin: closest 221.21 mm at 67.1296%, compared with R12's global closest 275.20 mm.
- Right Hand → right Thigh: closest 190.43 mm at 65.5556%, compared with R12 287.91 mm.
- Left Hand → either leg: closest 247.91 mm.
- No combination falls below the requested 70 mm trigger for further triangle-level inspection. Therefore no hand/shin mesh intersection test was performed.

The frontal overlap near 67% can be a projection overlap; this line-distance screen neither demonstrates collision nor certifies all surfaces collision-free.

## Conclusion

No blocking plane, preservation, ground-contact or boundary-continuity defect was found in these samples. Visual/user approval remains necessary for the deliberately changed bilateral route, shoulder skin, and faster exit/mid-transfer sections. Full measurements and executable review scripts are preserved alongside this note; they do not alter R12, App assets, or historical batches.
