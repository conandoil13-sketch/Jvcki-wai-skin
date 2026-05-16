import { getRarityClass } from "../../utils/rarity";
import { getRarityLabel } from "../../utils/rarity";
import AssetThumb from "../common/AssetThumb";

function SkinCard({ skin, compact = false }) {
  return (
    <article className={`skin-card ${getRarityClass(skin.rarity)} ${skin.locked ? "locked-card" : ""} ${compact ? "compact" : ""}`}>
      <span className="rarity-badge">{getRarityLabel(skin.rarity)}</span>
      <AssetThumb src={skin.image} label={skin.name} className="skin-thumb" locked={skin.locked} />
      <div className="skin-meta">
        <strong>{skin.locked ? "미획득 스킨" : skin.name}</strong>
        <span>{getRarityLabel(skin.rarity)}{skin.ownedCount ? ` · x${skin.ownedCount}` : " · 미획득"}</span>
      </div>
    </article>
  );
}

export default SkinCard;
