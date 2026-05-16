import { X } from "lucide-react";

function CombineSlot({ shard, index, onRemove }) {
  return (
    <div className="combine-slot">
      {shard ? (
        <>
          <button type="button" className="slot-remove" onClick={onRemove} aria-label="파편 제거">
            <X size={14} />
          </button>
          <div className="slot-core">{shard.name.slice(0, 2)}</div>
          <span>{shard.tags[0] ?? "shard"}</span>
        </>
      ) : (
        <>
          <div className="slot-core empty">{index + 1}</div>
          <span>파편 슬롯</span>
        </>
      )}
    </div>
  );
}

export default CombineSlot;
