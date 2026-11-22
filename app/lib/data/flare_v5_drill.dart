import '../domain/catalog_models.dart';
import '../domain/dose.dart';

const flareV5DrillId = 'flare-v5';
const flareV5PosterAsset = 'assets/public_posters/flare-v5.webp';

const flareV5Name = '托马斯（双腿伸直）';
const flareV5NameEn = 'Flare (Straight Legs)';
const flareV5Prescription = '1 组 × 1 次';

/// Flare owns the full movement. Its demonstration is the bundled V5 stage.
Drill buildFlareV5Drill({
  String name = flareV5Name,
  String prescription = flareV5Prescription,
}) => Drill(
  id: flareV5DrillId,
  groupId: 'obliques',
  tier: 'A',
  tierLabel: '',
  name: name,
  nameEn: flareV5NameEn,
  equipment: '徒手',
  prescription: prescription,
  cues: const [],
  mistake: '',
  why: '',
  difficulty: 3,
  imageAsset: flareV5PosterAsset,
  thumbnailAsset: flareV5PosterAsset,
  dose: Dose(
    sets: 1,
    perSide: false,
    mode: DoseMode.reps,
    min: 1,
    max: 1,
    restSec: 0,
    raw: prescription,
  ),
);

final flareV5Drill = buildFlareV5Drill();
