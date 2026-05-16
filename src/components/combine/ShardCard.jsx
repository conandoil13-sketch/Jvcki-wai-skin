import AssetThumb from "../common/AssetThumb";

function ShardCard({ shard, selectedCount, disabled, onClick }) {
  return (
    <button
      className={`shard-card ${selectedCount > 0 ? "selected" : ""}`}
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {selectedCount > 0 ? <span className="selected-badge">x{selectedCount}</span> : null}
      <AssetThumb src={shard.image} label={shard.name} className="shard-gem" />
      <strong>{shard.name}</strong>
      <small>{shard.tags.join(" · ")}</small>
    </button>
  );
}

export default ShardCard;
