# 골목대장 데모 앱

걸은 골목만큼 안개가 걷히는 동네 산책 앱의 **폰에 설치되는 데모**예요.
코드 하나로 **Android(APK)** 와 **iPhone** 둘 다 만들어요.

- Node.js·Mac·Android Studio 없이, **GitHub 웹사이트만으로** 설치 파일을 만들어요 (무료).
- Android 친구 → `golmok.apk` 링크만 보내면 설치 끝.
- iPhone → `golmok-unsigned.ipa`를 내 PC의 **Sideloadly**로 설치 (무료 Apple ID, 7일마다 갱신).

---

## 0. 이 데모에서 되는 것

| 실제로 동작 | 예시(가짜) 데이터 |
|---|---|
| GPS로 산책 경로 기록, 걸은 곳 안개 걷기 (50m 칸) | 카카오·Apple·Google 로그인 (버튼만) |
| 산책 중 스티커 + 사진 + 메모 기록 | 리더보드의 이웃들, 피드의 다른 사람 글 |
| 내 지도 / 기록 목록 / 상세·삭제 | 스티커 팩 결제 (누르면 무료로 받아짐) |
| 카톡·인스타 등으로 공유 | 가게 QR 인증 (버튼 누르면 인증) |
| 스탬프 투어: 실제 40m 안에서만 도장 | 스탬프 장소 (처음 산책한 곳 주변에 자동 배치) |
| 쿠폰 받기·사용, 앱 껐다 켜도 데이터 유지 | |

데이터는 **그 폰 안에만** 저장돼요 (서버 없음). 지도는 OpenStreetMap 기반이라 **지도 API 키가 필요 없어요.**

---

## 1. 처음 한 번: GitHub에 올리기 (15분)

1. https://github.com 가입 (무료)
2. 오른쪽 위 **+** → **New repository**
   - Repository name: `golmok-app`
   - **Public** 선택 (공개여야 빌드가 완전 무료이고, 친구가 로그인 없이 APK를 받을 수 있어요)
   - 나머지는 그대로 두고 **Create repository**
3. 만들어진 페이지에서 **uploading an existing file** 링크 클릭
4. 압축 푼 `golmok-app` 폴더를 열고, GitHub 웹은 한 번에 100개까지만 올라가서 **두 번에 나눠** 올려요.
   - **1차:** `assets` 폴더 하나만 끌어다 놓기 → 아래 **Commit changes**
   - **2차:** 다시 **Add file → Upload files** → `assets`를 뺀 **나머지 전부**(`.github` 폴더 포함)를 끌어다 놓기 → **Commit changes**
   - `.github` 폴더가 안 보이면: Windows 탐색기 → 보기 → **숨긴 항목** 체크
5. 저장소 위쪽 **Actions** 탭 → 초록 버튼(**I understand… enable**)이 보이면 눌러서 켜기
   → **Build app**이 자동으로 돌기 시작해요. 안 돌면 **Build app → Run workflow** 클릭.
6. 기다리기: Android 약 15분, iPhone 약 25분.
   끝나면 저장소 오른쪽 **Releases**에 `골목대장 데모 빌드 N`이 생기고, 그 안에 `golmok.apk`, `golmok-unsigned.ipa`가 있어요.

> `.github` 폴더가 끝까지 안 올라가면: **Add file → Create new file** → 파일 이름 칸에 `.github/workflows/build.yml` 입력 → 압축 파일 안의 같은 파일 내용을 복사해 붙여넣고 Commit.

**빌드가 빨간 X로 실패하면** 그 빌드를 눌러 빨간 단계의 로그를 캡처해서 Claude에게 보내 주세요. 고친 파일을 드릴게요.

---

## 2. Android 설치 (친구에게 보내기)

1. 저장소의 **Releases** 페이지 주소를 친구에게 보내요
   (예: `https://github.com/내아이디/golmok-app/releases/latest`)
2. 친구가 폰에서 링크 열기 → **golmok.apk** 누르기 → 다운로드
3. 설치 → "출처를 알 수 없는 앱" 허용 → 설치
   - "Play 프로텍트: 확인되지 않은 개발자" 경고가 뜨면 **세부정보 → 그래도 설치**
4. 앱 열고 위치 권한 **허용**

새 버전이 나오면 같은 방법으로 다시 설치하면 덮어써져요 (기록 유지).

---

## 3. iPhone 설치 (내 폰, Windows PC 기준)

준비물: Windows PC, iPhone, USB 케이블, Apple ID
(Apple ID 비밀번호가 Sideloadly를 거쳐 Apple로 가요. 걱정되면 **테스트용 Apple ID를 새로 만들어** 쓰세요.)

1. PC에 **iTunes**, **iCloud**를 Apple 홈페이지에서 받은 버전으로 설치
   (Microsoft Store 버전이 깔려 있으면 지우고 Apple 사이트 버전으로)
2. https://sideloadly.io 에서 **Sideloadly** 설치
3. Releases에서 `golmok-unsigned.ipa`를 PC로 다운로드
4. iPhone을 USB로 연결 → 폰에 "이 컴퓨터를 신뢰하겠습니까?" → **신뢰**
5. Sideloadly 실행 → ipa 파일을 창에 끌어다 놓기 → Apple ID 입력 → **Start**
   (이중 인증 코드를 물어보면 폰에 뜬 6자리 입력)
6. iPhone 설정
   - **설정 → 개인정보 보호 및 보안 → 개발자 모드 → 켜기** (재시동 후 "켜기" 한 번 더)
   - **설정 → 일반 → VPN 및 기기 관리 → 내 Apple ID → 신뢰**
7. 홈 화면의 **골목대장** 실행 → 위치 권한 허용

**7일 제한:** 무료 Apple ID로 설치한 앱은 7일 뒤 안 열려요. 다시 5번만 하면 기록은 그대로 두고 7일 연장돼요.
Sideloadly의 자동 갱신(Auto-refresh)을 켜 두면 PC가 켜져 있고 같은 Wi-Fi일 때 알아서 갱신해요.

다른 친구의 iPhone에 깔려면, 그 친구가 **자기 PC + 자기 Apple ID**로 3번 과정을 해야 해요.
(링크 하나로 아이폰 여러 대에 깔려면 유료 Apple 개발자 계정 + TestFlight가 필요해요.)

---

## 4. 코드를 고치면?

GitHub 저장소에서 파일을 열고 연필 아이콘(✏️)으로 고친 뒤 **Commit changes** → 자동으로 다시 빌드돼서 Releases에 새 번호로 올라와요.
Android는 새 APK를 다시 설치, iPhone은 새 ipa로 Sideloadly를 다시 하면 돼요.

자주 고칠 만한 곳:

| 바꾸고 싶은 것 | 파일 |
|---|---|
| 앱 색깔 | `src/lib/theme.ts` |
| 스티커 팩·이웃·피드·스탬프 장소·제휴 가게 | `src/lib/content.ts` |
| 스티커 이름 | `src/lib/stickers.ts` |
| 안개 칸 크기·밝혀지는 반경 | `src/lib/geo.ts`의 `CELL_M`, `REVEAL_M` |
| 앱 이름·버전 | `app.json`의 `name`, `version` |
| 각 화면 문구·배치 | `src/app/` (예: 상점 → `src/app/(tabs)/shop.tsx`) |

스티커 **이미지**를 바꾼 경우 지도 마커용 작은 이미지도 다시 만들어야 해요 (`python3 scripts/gen_thumbs.py`). 이건 Claude에게 부탁해도 돼요.

### (선택) 고치면서 폰에서 바로 보기 — Expo Go
빠르게 화면을 고쳐 보고 싶을 때만. PC에 Node.js가 필요해요.
```bash
npm install
npx expo start      # 터미널 QR을 폰의 Expo Go 앱으로 찍기 (같은 Wi-Fi, 안 되면 --tunnel)
```
iPhone은 App Store의 Expo Go, Android는 https://expo.dev/go 에서 **SDK 54**용 Expo Go를 받아요.

---

## 5. 시연 팁

- **실내 시연:** 산책 시작 → 지도 오른쪽 위 위치 버튼 아래 **✨ 버튼** → 가상으로 1초에 12m씩 걸어요. 안개가 걷히는 걸 보여주기 좋아요.
- **로그인:** 소셜 버튼 아무거나 → 가입 4단계. 빨리 보려면 "로그인 없이 둘러보기".
- **스탬프 투어** (상점 탭 → 초록 배너): 시연용 "거리 무시" 스위치가 있어요.
- **로그아웃:** 내 지도 탭 → 톱니바퀴 → "로그아웃". 기록은 폰에 남고, 같은 소셜 버튼으로 다시 들어오면 가입 없이 그 계정으로 돌아와요.
- **처음부터 다시:** 내 지도 탭 → 톱니바퀴 → "데모 데이터 초기화".
- 위치 기록은 **앱이 화면에 켜져 있을 때만** 돼요.
- 지도 타일은 인터넷으로 받아요 (Wi-Fi/데이터 필요).

## 6. 화면 흐름

```
온보딩 → 로그인 → 약관 → 닉네임 → 캐릭터 → 위치 권한 → 동네 선택 → 가입 완료
① 산책 탭: 산책 시작 (GPS, 안개 걷기)
② 산책 중 "여기에 스티커" → 스티커·사진·메모
③ 산책 종료 → 요약 → 내 지도 탭
④ 공유 (골목 피드 / 카톡·인스타)
⑤ 동네 탭: 이번 주 리더보드 + 골목 피드
⑥ 상점 탭: 스티커 팩
⑦ 기관 스탬프 투어 / 제휴 가게 방문 → 쿠폰
```

## 7. 폴더 구조

```
.github/workflows/build.yml   GitHub에서 APK·ipa를 만드는 설정
src/app/                      화면 (파일 하나 = 화면 하나)
  (tabs)/                     walk 산책 · mymap 내 지도 · town 동네 · shop 상점
  signup/                     가입 단계들
  record, walk-summary, spot/[id], share, campaign, stores, settings ...
src/components/FogMap.tsx     안개 지도 (WebView + Leaflet)
src/lib/
  mapHtml.ts                  지도 안에서 도는 코드 (안개 그리기, 마커)
  store.tsx                   앱 상태 + 폰 저장
  geo.ts                      격자·거리 계산
  content.ts                  예시 데이터
  stickers.ts / stickerThumbs.ts / leafletAssets.ts (자동 생성)
assets/stickers               스티커 이미지 55종
scripts/                      자동 생성 파일 만드는 스크립트
```

## 8. 실제 서비스로 갈 때
- **지도:** 데모는 OpenStreetMap 공식 지도 타일(키 없음, 데모·소량 사용만 허용)을 써요. 실제 서비스나 사용자가 많아지면 카카오맵·네이버 지도 등 정식 지도 API로 바꾸는 걸 권장해요 (`src/lib/mapHtml.ts`의 타일 주소 부분).
- **로그인:** `src/app/login.tsx` → 카카오/Apple/Google 실제 로그인 연동
- **저장:** `src/lib/store.tsx`의 액션을 서버 API 호출로 교체
- **스토어 출시:** Google Play 등록비(1회), Apple 개발자 프로그램(연회비)이 필요해요.

기술: Expo SDK 54 · React Native 0.81 · Expo Router 6 · TypeScript · Leaflet 1.9 (지도)
지도 데이터·타일 © OpenStreetMap contributors
