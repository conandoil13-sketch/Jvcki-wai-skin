export function isGameReadySkin(skin, settings) {
  if (!skin.enabled) {
    return false;
  }

  if (settings.onlyReviewedSkinsInGame && !skin.reviewed) {
    return false;
  }

  return true;
}
