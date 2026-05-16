import { Boxes, Hammer, ShieldCheck } from "lucide-react";
import ActionTile from "../components/shop/ActionTile";
import HomeBanner from "../components/shop/HomeBanner";
import config from "../data/config.json";

function Home() {
  return (
    <div className="page-stack">
      <HomeBanner />

      <section className="panel">
        <div className="section-heading">
          <span>빠른 진입</span>
          <strong>LOOT MENU</strong>
        </div>
        <div className="action-grid">
          <ActionTile to="/combine" icon={Hammer} title="스킨 조합" text="파편 3개 투입" />
          <ActionTile to="/collection" icon={Boxes} title="보유 스킨" text="컬렉션 확인" />
          {config.adminReviewEnabled ? <ActionTile to="/admin" icon={ShieldCheck} title="검수 모드" text="데이터 리뷰" /> : null}
        </div>
      </section>
    </div>
  );
}

export default Home;
