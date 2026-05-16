# JACKI SKIN COMBINE

모바일 우선 React + Vite 웹앱입니다. 다크 네이비 배경, 금색 라인, 청록 포인트, 전리품 조합 흐름을 사용해 판타지 MOBA 상점/전리품 UI의 구조와 분위기를 참고했습니다. 공식 자산은 사용하지 않습니다.

## 실행

```bash
npm install
npm run dev
```

## GitHub Pages 배포

이 프로젝트는 `https://conandoil13-sketch.github.io/Jvcki-wai-skin/` 경로 기준으로 빌드되도록 `vite.config.js`의 `base`가 설정되어 있습니다.

배포는 `.github/workflows/deploy.yml`의 GitHub Actions가 담당합니다. `main` 브랜치에 push하면 자동으로 `npm ci`, `npm run build` 후 GitHub Pages에 `dist`를 배포합니다.

GitHub 저장소 Settings에서 `Pages`의 Source를 `GitHub Actions`로 선택하세요.

## 페이지

- `Home`: 상점 홈, 대표 배너, 주요 진입 버튼
- `Combine`: 파편 3개 선택, 가중치 조합, 획득 모달, 컬렉션 저장
- `Collection`: 획득 수/희귀도별 개수, 보유 스킨, 미획득 실루엣 옵션
- `AdminReview`: 스킨 데이터 검수, 카드/리스트 보기, 임시 저장, export/reset

## 데이터 수정

스킨 데이터는 `src/data/skins.json`에서 관리합니다.

```json
{
  "id": "skin_001",
  "name": "재",
  "rarity": "common",
  "image": "/images/skins/skin_001.png",
  "description": "재키와이 4인조설의 첫 번째 멤버",
  "tags": ["meme", "letter", "jae"],
  "reviewed": false,
  "enabled": true
}
```

파편 데이터는 `src/data/shards.json`에서 관리합니다. 파편 `tags`와 스킨 `tags`가 많이 겹칠수록 조합 당첨 확률이 올라갑니다.

## 이미지 넣는 법

- 스킨 이미지는 `public/images/skins/`에 넣고 `image` 값을 `/images/skins/파일명.png`로 맞춥니다.
- 파편 이미지는 `public/images/shards/`에 넣고 `image` 값을 `/images/shards/파일명.png`로 맞춥니다.
- 이미지가 없거나 깨지면 UI가 자동으로 텍스트 fallback 박스를 보여줍니다.

## 설정

`src/data/config.json`에서 기본 동작을 조절합니다.

- `duplicateShardsAllowed`: 같은 파편 중복 선택 허용
- `adminReviewEnabled`: 검수 모드 노출 여부. GitHub Pages 등 공개 배포 전 `false`로 바꾸면 홈 버튼/하단 탭에서 숨겨지고 `/admin` 직접 접근도 홈으로 돌려보냅니다.
- `onlyReviewedSkinsInGame`: `enabled=true`이고 `reviewed=true`인 스킨만 조합/컬렉션 게임 풀에 반영
- `showUnownedInCollection`: 미획득 스킨을 실루엣으로 컬렉션에 표시
- `rarityOdds`: 조합 희귀도 확률

AdminReview의 `승인만 반영` 토글은 localStorage 설정으로 저장되어 런타임에서 우선 적용됩니다.

## 검수 흐름

1. `AdminReview`에서 스킨명, 희귀도, 설명, 이미지 경로, 태그 연결을 확인합니다.
2. 필요한 경우 이름/희귀도/설명/이미지 경로를 바로 수정합니다.
3. 운영 반영할 항목은 `enabled`를 켜고, 검수 완료 항목은 `reviewed`를 체크합니다.
4. `승인만 반영`을 켜면 `enabled=true` 및 `reviewed=true` 스킨만 게임에 등장합니다.
5. `임시 저장`으로 localStorage에 저장해 앱에서 즉시 테스트합니다.
6. 최종 데이터는 `JSON 내보내기`로 export한 뒤 `src/data/skins.json`에 반영합니다.
7. `sample import`는 번들 샘플 데이터를 다시 불러오고, `reset`은 localStorage의 draft/collection/settings를 초기화합니다.
