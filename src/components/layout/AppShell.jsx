import { Coins, Gem } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import config from "../../data/config.json";
import BottomNav from "./BottomNav";

const pageTitles = {
  "/": "상점",
  "/combine": "전리품",
  "/collection": "보유 스킨",
  "/admin": "검수 모드"
};

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] ?? config.appName;
  const canGoBack = location.pathname !== "/";

  return (
    <div className="app-shell">
      <header className="top-bar">
        <button
          className="icon-button"
          type="button"
          onClick={() => (canGoBack ? navigate(-1) : navigate("/"))}
          aria-label={canGoBack ? "뒤로가기" : "홈"}
        >
          {canGoBack ? "‹" : "J"}
        </button>
        <div className="top-title">
          <span>{title}</span>
          <strong>{config.appName}</strong>
        </div>
        <div className="currency-stack" aria-label="재화">
          <span>
            <Gem size={13} />
            {config.currencies.essence}
          </span>
          <span>
            <Coins size={13} />
            {config.currencies.coin}
          </span>
        </div>
      </header>

      <main className="screen">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}

export default AppShell;
