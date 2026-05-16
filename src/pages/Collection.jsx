import { useMemo, useState } from "react";
import SkinCard from "../components/collection/SkinCard";
import config from "../data/config.json";
import skinsData from "../data/skins.json";
import { getRarityLabel, sortByRarity } from "../utils/rarity";
import { isGameReadySkin } from "../utils/skins";
import { OWNED_SKINS_KEY, readGameSettings, readStorage, SKINS_DRAFT_KEY } from "../utils/storage";

function Collection() {
  const [rarity, setRarity] = useState("all");
  const skins = useMemo(() => readStorage(SKINS_DRAFT_KEY, skinsData), []);
  const settings = useMemo(() => readGameSettings(config), []);
  const [ownedSkins] = useState(() => readStorage(OWNED_SKINS_KEY, {}));
  const collectionList = useMemo(() => {
    const filtered = skins
      .filter((skin) => isGameReadySkin(skin, settings))
      .filter((skin) => settings.showUnownedInCollection || ownedSkins[skin.id])
      .filter((skin) => rarity === "all" || skin.rarity === rarity)
      .map((skin) => ({ ...skin, ownedCount: ownedSkins[skin.id] ?? 0, locked: !ownedSkins[skin.id] }));
    return sortByRarity(filtered).sort((a, b) => Number(a.locked) - Number(b.locked));
  }, [rarity, skins, ownedSkins, settings]);
  const totalOwned = useMemo(() => Object.values(ownedSkins).reduce((sum, count) => sum + count, 0), [ownedSkins]);
  const rarityCounts = useMemo(
    () =>
      config.rarities
        .filter((item) => item !== "all")
        .map((item) => ({
          rarity: item,
          count: skins.filter((skin) => isGameReadySkin(skin, settings) && skin.rarity === item && ownedSkins[skin.id]).length
        })),
    [ownedSkins, skins, settings]
  );

  return (
    <div className="page-stack">
      <section className="collection-summary">
        <div>
          <span>획득 수</span>
          <strong>{totalOwned}</strong>
        </div>
        {rarityCounts.map((item) => (
          <div key={item.rarity}>
            <span>{getRarityLabel(item.rarity)}</span>
            <strong>{item.count}</strong>
          </div>
        ))}
      </section>

      <section className="filter-strip" aria-label="희귀도 필터">
        {config.rarities.map((item) => (
          <button key={item} type="button" className={rarity === item ? "active" : ""} onClick={() => setRarity(item)}>
            {getRarityLabel(item)}
          </button>
        ))}
      </section>

      <section className="collection-grid">
        {collectionList.map((skin) => (
          <SkinCard key={skin.id} skin={skin} />
        ))}
      </section>

      {collectionList.length === 0 ? <p className="empty-state">아직 획득한 스킨이 없습니다. 조합에서 첫 스킨을 뽑아보세요.</p> : null}
    </div>
  );
}

export default Collection;
