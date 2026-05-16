export const rarityOrder = {
  common: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
  mythic: 5
};

export const rarityLabels = {
  all: "전체",
  common: "일반",
  rare: "희귀",
  epic: "에픽",
  legendary: "전설",
  mythic: "신화"
};

export function getRarityClass(rarity) {
  return `rarity-${rarityOrder[rarity] ?? 0}`;
}

export function getRarityLabel(rarity) {
  return rarityLabels[rarity] ?? rarity;
}

export function sortByRarity(items) {
  return [...items].sort((a, b) => (rarityOrder[b.rarity] ?? 0) - (rarityOrder[a.rarity] ?? 0));
}
