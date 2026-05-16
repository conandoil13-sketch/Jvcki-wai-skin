export function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const SKINS_DRAFT_KEY = "jacki-skins-draft";
export const OWNED_SKINS_KEY = "jacki-owned-skins";
export const GAME_SETTINGS_KEY = "jacki-game-settings";

export function addOwnedSkin(skinId) {
  const owned = readStorage(OWNED_SKINS_KEY, {});
  const previousCount = owned[skinId] ?? 0;
  const next = { ...owned, [skinId]: previousCount + 1 };
  writeStorage(OWNED_SKINS_KEY, next);

  return {
    owned: next,
    isDuplicate: previousCount > 0,
    count: next[skinId]
  };
}

export function readGameSettings(config) {
  return {
    duplicateShardsAllowed: config.duplicateShardsAllowed,
    onlyReviewedSkinsInGame: config.onlyReviewedSkinsInGame,
    showUnownedInCollection: config.showUnownedInCollection,
    rarityOdds: config.rarityOdds,
    ...readStorage(GAME_SETTINGS_KEY, {})
  };
}

export function clearRuntimeStorage() {
  localStorage.removeItem(SKINS_DRAFT_KEY);
  localStorage.removeItem(OWNED_SKINS_KEY);
  localStorage.removeItem(GAME_SETTINGS_KEY);
}
