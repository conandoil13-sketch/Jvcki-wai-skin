import { useState } from "react";

function AssetThumb({ src, label, className = "", locked = false }) {
  const [failed, setFailed] = useState(false);
  const text = label?.slice(0, 2) || "?";

  return (
    <div className={`asset-thumb ${className} ${failed || !src ? "is-fallback" : ""} ${locked ? "is-locked" : ""}`}>
      {src && !failed ? <img src={src} alt="" onError={() => setFailed(true)} /> : <span>{text}</span>}
      {locked ? <b>LOCKED</b> : null}
    </div>
  );
}

export default AssetThumb;
