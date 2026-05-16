import { rarityOrder } from "./rarity";

const defaultRarityRates = {
  common: 45,
  rare: 30,
  epic: 17,
  legendary: 7,
  mythic: 1
};

function pickWeighted(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let cursor = Math.random() * total;

  for (const item of items) {
    cursor -= item.weight;
    if (cursor <= 0) {
      return item.value;
    }
  }

  return items[items.length - 1]?.value ?? null;
}

function pickRarity(rarityRates) {
  // First roll: choose the result rarity using the configured global rates.
  return pickWeighted(
    Object.entries(rarityRates).map(([rarity, weight]) => ({
      value: rarity,
      weight
    }))
  );
}

function getTagWeight(skin, selectedTags) {
  const matches = skin.tags.filter((tag) => selectedTags.includes(tag)).length;

  // Base weight keeps every skin in the selected rarity obtainable.
  // Matching tags then heavily tilt the result toward related meme skins.
  return 1 + matches * matches * 4 + matches * 2;
}

export function combineShards(selectedShards, skins, rarityRates = defaultRarityRates) {
  if (selectedShards.length < 3) {
    return null;
  }

  const selectedTags = selectedShards.flatMap((shard) => shard.tags);
  const selectedRarity = pickRarity(rarityRates);
  const exactRarityPool = skins.filter((skin) => skin.rarity === selectedRarity);
  const fallbackPool = skins.filter((skin) => (rarityOrder[skin.rarity] ?? 0) > 0);
  const pool = exactRarityPool.length > 0 ? exactRarityPool : fallbackPool;

  // Second roll: within the rarity pool, tag overlap raises each skin's weight.
  const skin = pickWeighted(
    pool.map((candidate) => ({
      value: candidate,
      weight: getTagWeight(candidate, selectedTags)
    }))
  );

  return {
    skin,
    rarity: selectedRarity,
    selectedTags
  };
}
