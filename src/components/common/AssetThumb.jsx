import { useState } from "react";

function resolveAssetPath(src) {
  if (!src || src.startsWith("http") || src.startsWith("data:")) {
    return src;
  }

  const base = import.meta.env.BASE_URL;
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanSrc = src.startsWith("/") ? src : `/${src}`;

  return `${cleanBase}${cleanSrc}`;
}

function AssetThumb({ src, label, className = "", locked = false }) {
  const [failed, setFailed] = useState(false);
  const text = label?.slice(0, 2) || "?";
  const resolvedSrc = resolveAssetPath(src);

  return (
    <div className={`asset-thumb ${className} ${failed || !src ? "is-fallback" : ""} ${locked ? "is-locked" : ""}`}>
      {resolvedSrc && !failed ? <img src={resolvedSrc} alt="" onError={() => setFailed(true)} /> : <span>{text}</span>}
      {locked ? <b>LOCKED</b> : null}
    </div>
  );
}

export default AssetThumb;
