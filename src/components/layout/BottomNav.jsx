import { Boxes, Hammer, ShieldCheck, Store } from "lucide-react";
import { NavLink } from "react-router-dom";
import config from "../../data/config.json";

const tabs = [
  { to: "/", label: "상점", icon: Store },
  { to: "/combine", label: "조합", icon: Hammer },
  { to: "/collection", label: "스킨", icon: Boxes },
  { to: "/admin", label: "검수", icon: ShieldCheck }
].filter((tab) => config.adminReviewEnabled || tab.to !== "/admin");

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="하단 탭">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} end={to === "/"} className="bottom-tab">
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;
