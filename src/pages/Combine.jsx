import { useMemo, useState } from "react";
import CombineSlot from "../components/combine/CombineSlot";
import ResultModal from "../components/combine/ResultModal";
import ShardCard from "../components/combine/ShardCard";
import config from "../data/config.json";
import shards from "../data/shards.json";
import skinsData from "../data/skins.json";
import { combineShards } from "../utils/combineLogic";
import { isGameReadySkin } from "../utils/skins";
import { addOwnedSkin, readGameSettings, readStorage, SKINS_DRAFT_KEY } from "../utils/storage";

function Combine() {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [isCombining, setIsCombining] = useState(false);
  const settings = useMemo(() => readGameSettings(config), []);
  const skins = useMemo(() => readStorage(SKINS_DRAFT_KEY, skinsData).filter((skin) => isGameReadySkin(skin, settings)), [settings]);
  const selectedCounts = useMemo(
    () =>
      selected.reduce((counts, shard) => {
        counts[shard.id] = (counts[shard.id] ?? 0) + 1;
        return counts;
      }, {}),
    [selected]
  );
  const allowDuplicateShards = settings.duplicateShardsAllowed;

  const handleSelect = (shard) => {
    const isAlreadySelected = Boolean(selectedCounts[shard.id]);

    if (!allowDuplicateShards && isAlreadySelected) {
      setSelected((current) => current.filter((item) => item.id !== shard.id));
      return;
    }

    if (selected.length < 3) {
      setSelected((current) => [...current, shard]);
    }
  };

  const handleCombine = () => {
    if (selected.length < 3 || isCombining) {
      return;
    }

    setIsCombining(true);

    window.setTimeout(() => {
      const nextResult = combineShards(selected, skins, settings.rarityOdds);

      if (nextResult?.skin) {
        const ownership = addOwnedSkin(nextResult.skin.id);
        setResult({ ...nextResult, ...ownership });
        setSelected([]);
      }

      setIsCombining(false);
    }, 850);
  };

  return (
    <div className={`page-stack combine-page ${isCombining ? "is-combining" : ""}`}>
      <section className="loot-title-panel">
        <span className="eyebrow">ARCANE LOOT</span>
        <h1>전리품 조합</h1>
        <p>파편 3개를 제단에 올려 재키와이 스킨을 획득합니다.</p>
      </section>

      <section className="altar-panel">
        <div className="section-heading">
          <span>파편 제단</span>
          <strong>{selected.length}/3</strong>
        </div>
        <div className="slot-row">
          {[0, 1, 2].map((index) => (
            <CombineSlot
              key={index}
              index={index}
              shard={selected[index]}
              onRemove={() => setSelected((current) => current.filter((_, itemIndex) => itemIndex !== index))}
            />
          ))}
        </div>
      </section>

      <section className="panel grow-panel">
        <div className="section-heading">
          <span>보유 파편</span>
          <strong>{shards.length} ITEMS</strong>
        </div>
        <div className="shard-grid">
          {shards.map((shard) => (
            <ShardCard
              key={shard.id}
              shard={shard}
              selectedCount={selectedCounts[shard.id] ?? 0}
              disabled={selected.length >= 3}
              onClick={() => handleSelect(shard)}
            />
          ))}
        </div>
      </section>

      <button className="primary-button sticky-action" type="button" disabled={selected.length < 3 || isCombining} onClick={handleCombine}>
        {isCombining ? "조합 중..." : "조합하기"}
      </button>

      <ResultModal result={result} onClose={() => setResult(null)} />
    </div>
  );
}

export default Combine;
