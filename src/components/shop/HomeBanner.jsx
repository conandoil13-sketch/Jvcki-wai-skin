function HomeBanner() {
  return (
    <section className="home-banner">
      <div className="banner-copy">
        <span className="eyebrow">오늘의 조합 제단</span>
        <h1>파편을 태워 새로운 스킨을 깨워라</h1>
        <p>세 개의 파편을 선택하면 희귀도 가중치로 결과가 결정됩니다.</p>
      </div>
      <div className="banner-crystal" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}

export default HomeBanner;
