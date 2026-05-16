import { Download, Eye, Grid2X2, List, RotateCcw, Save, Search, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import AssetThumb from "../components/common/AssetThumb";
import config from "../data/config.json";
import skinsData from "../data/skins.json";
import { getRarityClass, getRarityLabel } from "../utils/rarity";
import { clearRuntimeStorage, GAME_SETTINGS_KEY, readGameSettings, readStorage, SKINS_DRAFT_KEY, writeStorage } from "../utils/storage";

function AdminReview() {
  const [skins, setSkins] = useState(() => readStorage(SKINS_DRAFT_KEY, skinsData));
  const [query, setQuery] = useState("");
  const [rarity, setRarity] = useState("all");
  const [onlyUnreviewed, setOnlyUnreviewed] = useState(false);
  const [viewMode, setViewMode] = useState("card");
  const [settings, setSettings] = useState(() => readGameSettings(config));
  const [previewSkin, setPreviewSkin] = useState(null);
  const [savedMessage, setSavedMessage] = useState("");

  const rows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return skins
      .filter((skin) => {
        const searchable = [skin.name, skin.rarity, skin.description, skin.image, ...skin.tags].join(" ").toLowerCase();
        const matchesText = !normalized || searchable.includes(normalized);
        const matchesRarity = rarity === "all" || skin.rarity === rarity;
        const matchesReview = !onlyUnreviewed || !skin.reviewed;
        return matchesText && matchesRarity && matchesReview;
      })
      .sort((a, b) => Number(a.reviewed) - Number(b.reviewed) || a.id.localeCompare(b.id));
  }, [query, rarity, onlyUnreviewed, skins]);

  const updateSkin = (skinId, field, value) => {
    setSkins((current) => current.map((skin) => (skin.id === skinId ? { ...skin, [field]: value } : skin)));
  };

  const saveDraft = () => {
    writeStorage(SKINS_DRAFT_KEY, skins);
    writeStorage(GAME_SETTINGS_KEY, settings);
    setSavedMessage("localStorage에 임시 저장됨");
    window.setTimeout(() => setSavedMessage(""), 1800);
  };

  const importSample = () => {
    setSkins(skinsData);
    setSavedMessage("샘플 데이터 불러옴");
    window.setTimeout(() => setSavedMessage(""), 1800);
  };

  const resetStorage = () => {
    clearRuntimeStorage();
    setSkins(skinsData);
    setSettings(readGameSettings(config));
    setSavedMessage("localStorage 초기화됨");
    window.setTimeout(() => setSavedMessage(""), 1800);
  };

  const updateSetting = (field, value) => {
    setSettings((current) => {
      const next = { ...current, [field]: value };
      writeStorage(GAME_SETTINGS_KEY, next);
      return next;
    });
  };

  const exportJson = () => {
    const json = JSON.stringify(skins, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "skins.reviewed.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-stack">
      <section className="admin-toolbar">
        <label className="search-box">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="스킨명, 태그, 이미지 경로 검색" />
        </label>
        <select value={rarity} onChange={(event) => setRarity(event.target.value)} aria-label="희귀도 필터">
          {config.rarities.map((item) => (
            <option key={item} value={item}>
              {getRarityLabel(item)}
            </option>
          ))}
        </select>
        <label className="check-chip">
          <input type="checkbox" checked={onlyUnreviewed} onChange={(event) => setOnlyUnreviewed(event.target.checked)} />
          <span>미검수만</span>
        </label>
        <label className="check-chip">
          <input
            type="checkbox"
            checked={settings.onlyReviewedSkinsInGame}
            onChange={(event) => updateSetting("onlyReviewedSkinsInGame", event.target.checked)}
          />
          <span>승인만 반영</span>
        </label>
        <div className="segmented-control" aria-label="보기 방식">
          <button type="button" className={viewMode === "card" ? "active" : ""} onClick={() => setViewMode("card")} aria-label="카드 보기">
            <Grid2X2 size={16} />
          </button>
          <button type="button" className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")} aria-label="리스트 보기">
            <List size={16} />
          </button>
        </div>
        <button className="utility-button" type="button" onClick={importSample}>
          <Upload size={16} />
          sample import
        </button>
        <button className="utility-button" type="button" onClick={saveDraft}>
          <Save size={16} />
          임시 저장
        </button>
        <button className="utility-button danger-button" type="button" onClick={resetStorage}>
          <RotateCcw size={16} />
          reset
        </button>
        <button className="utility-button" type="button" onClick={exportJson}>
          <Download size={16} />
          JSON 내보내기
        </button>
      </section>

      {savedMessage ? <p className="save-toast">{savedMessage}</p> : null}

      <section className={`review-list ${viewMode === "list" ? "list-mode" : "card-mode"}`}>
        {rows.map((skin) => (
          <article
            key={skin.id}
            className={`review-card ${getRarityClass(skin.rarity)} ${skin.enabled ? "" : "disabled-card"}`}
            onClick={() => setPreviewSkin(skin)}
          >
            <div className="review-card-head">
              <AssetThumb src={skin.image} label={skin.name} className="review-thumb" />
              <div className="review-title">
                <strong>{skin.id}</strong>
                <span>{skin.image}</span>
              </div>
              <button className="icon-button small" type="button" onClick={(event) => {
                event.stopPropagation();
                setPreviewSkin(skin);
              }} aria-label="상세 미리보기">
                <Eye size={16} />
              </button>
            </div>

            <div className="review-fields" onClick={(event) => event.stopPropagation()}>
              <label>
                <span>name</span>
                <input value={skin.name} onChange={(event) => updateSkin(skin.id, "name", event.target.value)} />
              </label>
              <label>
                <span>rarity</span>
                <select value={skin.rarity} onChange={(event) => updateSkin(skin.id, "rarity", event.target.value)}>
                  {config.rarities.filter((item) => item !== "all").map((item) => (
                    <option key={item} value={item}>
                      {getRarityLabel(item)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="wide-field">
                <span>description</span>
                <textarea value={skin.description} onChange={(event) => updateSkin(skin.id, "description", event.target.value)} />
              </label>
              <label className="wide-field">
                <span>image</span>
                <input value={skin.image} onChange={(event) => updateSkin(skin.id, "image", event.target.value)} />
              </label>
            </div>

            <div className="tag-row">
              {skin.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className="review-switches" onClick={(event) => event.stopPropagation()}>
              <label className="toggle-line">
                <span>reviewed</span>
                <input type="checkbox" checked={skin.reviewed} onChange={(event) => updateSkin(skin.id, "reviewed", event.target.checked)} />
              </label>
              <label className="toggle-line">
                <span>enabled</span>
                <input type="checkbox" checked={skin.enabled} onChange={(event) => updateSkin(skin.id, "enabled", event.target.checked)} />
              </label>
            </div>
          </article>
        ))}
      </section>

      {previewSkin ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setPreviewSkin(null)}>
          <section className="preview-modal" role="dialog" aria-modal="true" aria-label="스킨 상세 미리보기" onClick={(event) => event.stopPropagation()}>
            <AssetThumb src={previewSkin.image} label={previewSkin.name} className={`preview-art ${getRarityClass(previewSkin.rarity)}`} />
            <div className="preview-copy">
              <span className="eyebrow">{getRarityLabel(previewSkin.rarity)}</span>
              <h2>{previewSkin.name}</h2>
              <p>{previewSkin.description}</p>
              <code>{previewSkin.image}</code>
              <div className="tag-row">
                {previewSkin.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <dl>
                <div>
                  <dt>reviewed</dt>
                  <dd>{previewSkin.reviewed ? "true" : "false"}</dd>
                </div>
                <div>
                  <dt>enabled</dt>
                  <dd>{previewSkin.enabled ? "true" : "false"}</dd>
                </div>
              </dl>
            </div>
            <button className="primary-button" type="button" onClick={() => setPreviewSkin(null)}>
              닫기
            </button>
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default AdminReview;
