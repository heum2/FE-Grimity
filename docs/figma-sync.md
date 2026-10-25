# Figma ↔ 코드 싱크 수정 계획

- 기준 Figma: [Grimity_Web](https://www.figma.com/design/chnAmV3OdNmg3K3uHMVXZu/Grimity_Web)
- 검토일: 2026-10-25
- 검토 방법: 로컬(`localhost:3000`)을 Aside 브라우저에서 1200 / 768 / 360px 폭으로 렌더링하고, 같은 텍스트끼리 Figma 텍스트 스타일과 computed style을 수치 비교
- 브랜치: `fix/figma-design-sync`

## 검증 방법

- 브라우저 확인은 **Aside**(`aside repl`)로 한다. Playwright는 사용하지 않는다.
- Aside 뷰포트는 고정(1440)이므로 같은 origin 페이지에 폭을 고정한 iframe을 띄워 반응형을 확인한다(1200 / 768 / 360).
- 각 단계 완료 조건: `npm run lint` 통과 + 해당 화면을 Aside로 렌더링해 아래 "기대값"과 computed style 일치 확인.

## 수정 단계

> 상태: ⏳ 대기 · 🔄 진행 중 · ✅ 완료 · ⏸ 보류

### Step 1. 타이포그래피 letter-spacing 단위 ✅

- 파일: `src/styles/tokens/typography/_atomic.scss`
- 현재: `$letterspacing-tight: 0.2px`, `$letterspacing-tighter: 0.8px`
- Figma: Text Style letter-spacing이 **퍼센트** — `0.2%`, `0.8%` (폰트 크기 대비)
- 기대값: `0.2%` → `0.002em`, `0.8%` → `0.008em` (12px 기준 0.096px). Caption 1 / Label 5·6이 과하게 벌어지는 문제 해소

### Step 2. 사이드바 하단 영역 (전 페이지 웹) ✅

- 파일: `src/components/common/Navigation/Sidebar/Sidebar.module.scss`
- 공지사항 / 문의: `label-3`(14px) → **Label 1** (16px SemiBold)
- 이용약관 · 개인정보처리방침 · 사업자 정보 · 저작권: `label-6`(12px) → **Label 4** (14px Medium)
- 좌측 여백: 16px → **22px** (Figma 텍스트 x=22, 아이콘 행 텍스트 x=46)
- 태블릿(아이콘형 사이드바)의 "안내/문의" Body 2 SB는 이미 일치 — 변경 금지

### Step 3. 랭킹 페이지 ✅

- 파일: `src/components/RankingPage/**`
- 안내 문구: "랭킹 40위까지 노출됩니다." → **"인기 그림은 40위까지 노출됩니다"**
- 웹 제목/콘텐츠 시작 x: 292 → **280** (사이드바 우측 기준 좌측 패딩 12px 과다)
- 모바일 주간/월간 탭: 18px Bold → **Label 3** (14px SemiBold)
- 모바일 "인기 작가" 제목: 20px → **Title 2** (24px)

### Step 4. 인기 작가 카드 (랭킹 · 팔로잉 공통) ✅

- 파일: `src/components/RankingPage/PopularUser/**`, `src/components/FollowingPage/PopularUsers/**`
- 닉네임: 14px SemiBold → **Label 2** (16px Medium)
- 팔로우 버튼 텍스트: 12px → **Label 3** (14px SemiBold)

### Step 5. 헤더 · 홈 모바일 ✅

- 모바일 헤더 "회원가입" 버튼: 12px → **Label 3** (14px) — `src/components/common/Navigation/GNB/**`
- 모바일 홈 섹션 "더보기": 16px → **Label 3** (14px) — 홈 섹션 헤더 컴포넌트 (웹은 Label 1 16px 유지)

### Step 6. 빈 상태(Empty) 반응형 · DM 헤더 ✅

웹/모바일 스타일이 뒤바뀌거나 한쪽만 적용됨.

| 화면 | 브레이크포인트 | 제목 | 설명 | 버튼 |
|---|---|---|---|---|
| 보관함 좋아요한 그림 | 웹 | Title 3 (20) | — | Label 1 (16) |
| 보관함 좋아요한 그림 | 모바일 | Subtitle 1 (18) | — | Label 3 (14) |
| 팔로잉 첫 진입 | 웹 | Title 3 (20) | Body 1 R (16) | Label 1 (16) |
| 팔로잉 첫 진입 | 모바일 | Subtitle 1 (18) | Body 2 R (14) | Label 3 (14) |
| 팔로잉 "인기 작가" 제목 | 모바일 | Title 2 (24) | | |
| DM 첫 진입 | 웹 | Title 3 (20) | Body 1 R (16) | Label 1 (16) |
| DM 첫 진입 | 모바일 | Title 3 (20) | Body 2 R (14) | Label 3 (14) |

- 현재: 보관함 웹이 모바일 값(18/14), 팔로잉·DM 모바일이 웹 값(20/16/16, 인기 작가 28)
- DM 빈 상태 제목이 "없어 / 요"로 음절 단위 줄바꿈 → `word-break: keep-all`
- DM 목록 헤더 "새 메시지" / "편집" 버튼: 12px → **Label 3** (14px SemiBold)
- 파일: `src/components/common/Empty/**`, `src/components/MyPage/LikedFeeds/**`, `src/components/FollowingPage/FollowingPage.*`, `src/components/DirectPage/**`

### Step 7. 설정 ✅

- "탈퇴하기" 색상: gray-bold → **text/gray-subtle** — `src/components/Settings/AccountSettings/**`

### Step 8. 그림 업로드 ✅

- 파일: `src/components/Upload/**`
- 웹 페이지 제목 "그림 업로드": 24px → **Title 1** (28px)
- "태그" / "앨범" 라벨: 14px Bold → **16px Bold** (Subtitle 2)
- "전체 앨범" 선택값: 14px → **Label 1** (16px SemiBold)
- 글자 수 카운터 `0 / 32`: 12px Regular → **Label 5** (12px SemiBold)
- 모바일 헤더 "업로드" 버튼: 14px → **Label 1** (16px)

### Step 9. 자유게시판 글쓰기 ✅

- 파일: `src/components/Board/BoardWrite/**`
- 웹 콘텐츠 시작 x: 310 → **350** (Figma 콘텐츠 폭 기준 정렬)
- 글자 수 카운터: Step 8과 동일하게 **Label 5**
- 모바일 헤더 "업로드" 버튼: 14px → **Label 1** (16px)

### Step 10. 토큰 미사용 하드코딩 ✅

- `/business-info`: `#23252b` 하드코딩, letter-spacing `normal` → 시맨틱 토큰 + 타이포 믹스인 — `src/pages/business-info.tsx`, `src/styles/pages/BusinessInfo.module.scss`
- 그림 상세 본문 링크: 브라우저 기본 `#0000ee` → 시맨틱 토큰 (`text/primary-normal` 등) — `src/components/Detail/**`

### Step 11. 상세 우측 컬럼(광고 + 자유게시판 최신글) 🔄

- Figma 그림 상세 1:4600 / 글 상세 1:8666 은 1200 화면에 우측 컬럼 노출
- 현재 `DetailLayout.module.scss`의 `.right`가 `position: fixed`, 1600px 이상에서만 노출 → Figma 1200 레이아웃에 맞춰 흐름 레이아웃으로 변경

### Step 12. 로그인 웹·태블릿 타이틀 🔄

- 웹(976:241257)·태블릿(976:241774): "내 그림의 모든 기록, 취향을 잇는 공간" 한 줄, Title 1
- 모바일(1:234503): 기존 "그리미티에서 / 내 그림을 뽐내보세요!" 유지

### Step 13. 설정 메뉴 🔄

- 웹·태블릿 메뉴에 "화면 테마" 추가 (순서: 내 계정 · 화면 테마 · 알림 · 이용 안내 · 문의하기) — Figma 181:287927, 303:398103, 303:396677
- 모바일 `/settings` 첫 화면을 메뉴 목록으로 — Figma 91:298000
  - Figma 모바일 목록 프레임에는 "화면 테마"가 빠져 있지만, 웹·태블릿 메뉴와 모바일 화면 테마 상세(301:256465)가 있으므로 모바일 목록에도 포함 → **Figma 모바일 목록 프레임 갱신 필요**

## 보류

| 항목 | 상태 | 비고 |
|---|---|---|
| 설정 "본인 인증" | ⏸ 보류 | 본인인증 기능 미지원 — 지원 시 재개 |
| 알림 설정 "북마크 알림" | ⏸ 보류 | 서버 API 미지원. `GET/PUT /me/subscribe`의 `SubscriptionType`이 `FOLLOW`, `FEED_LIKE`, `FEED_COMMENT`, `FEED_REPLY`, `POST_COMMENT`, `POST_REPLY` 뿐(서버 dev 브랜치 openapi.json 기준). 백엔드에 저장(북마크) 알림 타입 추가가 선행돼야 함 |
| 자유게시판 글쓰기 모바일 헤더 | 코드 유지 | 코드 "글 작성"(= Figma 웹)이 기준. **Figma 모바일 프레임(1:230267)의 "글작성" 수정 필요** |

## 참고 — 일치 확인된 항목

- 시맨틱 색상(Light/Dark), Radius, Spacing 토큰
- 텍스트 스타일의 크기 · 굵기 · 행간
- 홈(웹·태블릿), 자유게시판 목록, 검색, 프로필, DM 대화방, 팔로잉(웹), 설정 내 계정·알림(웹)
