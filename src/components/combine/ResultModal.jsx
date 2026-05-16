import { X } from "lucide-react";
import SkinCard from "../collection/SkinCard";
import { getRarityClass, getRarityLabel } from "../../utils/rarity";

function ResultModal({ result, onClose }) {
  if (!result) {
    return null;
  }

  const { skin, isDuplicate, count } = result;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className={`result-modal obtain-modal rarity-burst ${getRarityClass(skin.rarity)}`} role="dialog" aria-modal="true" aria-label="조합 결과">
        <button className="modal-close" type="button" onClick={onClose} aria-label="닫기">
          <X size={18} />
        </button>
        <span className="eyebrow">{isDuplicate ? "중복 획득" : "컬렉션에 추가됨"}</span>
        <h2>{skin.name}</h2>
        <div className="result-rarity">{getRarityLabel(skin.rarity)}</div>
        <SkinCard skin={skin} />
        <p>{skin.description}</p>
        <code>{skin.image}</code>
        <strong className="owned-count">보유 수량 x{count}</strong>
        <button className="primary-button" type="button" onClick={onClose}>
          확인
        </button>
      </section>
    </div>
  );
}

export default ResultModal;
