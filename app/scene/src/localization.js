export let sceneStrings = {};
export const sceneFont = 'FlareScene, FlareSceneKorean, FlareSceneArabic, FlareSceneHindi, sans-serif';

const fontLoads = new Map();
function loadFont(family, filename) {
  if (!fontLoads.has(family)) {
    const face = new FontFace(family, `url(${new URL('../fonts/' + filename, document.baseURI)})`);
    document.fonts.add(face);
    fontLoads.set(family, face.load());
  }
  return fontLoads.get(family);
}

export async function setSceneStrings(value) {
  sceneStrings = value;
  document.documentElement.lang = String(value.locale ?? 'zh').replaceAll('_', '-');
  document.documentElement.dir = value.rtl ? 'rtl' : 'ltr';
  document.body.style.fontFamily = sceneFont;
  const language = String(value.locale).split('_')[0];
  const extra = {
    ko: ['FlareSceneKorean', 'NotoSansKR.ttf'],
    ar: ['FlareSceneArabic', 'NotoSansArabic.ttf'],
    hi: ['FlareSceneHindi', 'NotoSansDevanagari.ttf'],
  }[language];
  await Promise.all([loadFont('FlareScene', 'FlareSans.ttf'), ...(extra ? [loadFont(...extra)] : [])]);
}

export function groupLabel(id, fallback) {
  if (!sceneStrings.locale || sceneStrings.locale === 'zh') return fallback;
  return sceneStrings.groups?.[id] ?? fallback;
}
