// ID resolution for plans: Flare's own catalog ∪ the SDK shared public scope.
// Display rows only; media, playback and caching stay with the SDK.
import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../domain/catalog_models.dart';
import '../domain/dose.dart';
import 'flare_action_scope.dart';
import 'flare_public_media.dart';

/// A shared public action projected onto Flare's display row. Poster is the
/// bundled public poster; the SDK still owns details and on-demand media.
Drill? sharedDisplayDrill(uc.Catalog? shared, String id) {
  final d = shared?[id];
  if (d == null) return null;
  final dd = d.defaultDose;
  final reps = dd.mode == uc.DoseMode.reps;
  final amount = (reps ? dd.reps : dd.seconds) ?? 0;
  final unit = reps ? '次' : '秒';
  final prescription = amount > 0
      ? '${dd.sets} 组 × ${d.unilateral ? '每侧 ' : ''}$amount $unit'
      : '${dd.sets} 组';
  final hasVersionedArtwork = flareAuthorizedActionIds.contains(id);
  final coverRoot = hasVersionedArtwork
      ? FlarePublicMedia.coverRoot
      : FlarePublicMedia.posterRoot;
  final thumbnailRoot = hasVersionedArtwork
      ? FlarePublicMedia.thumbnailRoot
      : FlarePublicMedia.posterRoot;
  return Drill(
    id: id,
    groupId: d.category,
    tier: '',
    tierLabel: '',
    name: d.name.of('zh'),
    nameEn: d.name.of('en'),
    equipment: d.equipment.join('、'),
    prescription: prescription,
    cues: d.cues['zh'] ?? const [],
    mistake: '',
    why: d.purpose,
    difficulty: d.level,
    safety: d.cautions.isEmpty ? null : d.cautions.join('；'),
    imageAsset: '$coverRoot$id.webp',
    thumbnailAsset: '$thumbnailRoot$id.webp',
    dose: amount > 0
        ? Dose(
            sets: dd.sets < 1 ? 1 : dd.sets,
            perSide: d.unilateral,
            mode: reps ? DoseMode.reps : DoseMode.time,
            min: amount,
            max: amount,
            restSec: dd.restSeconds < 0 ? 0 : dd.restSeconds,
            raw: prescription,
          )
        : Dose.manual(prescription),
  );
}
