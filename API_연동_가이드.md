# 퍼컬(PerCol) — 프론트엔드 API 연동 가이드

> 백엔드(NestJS) → 프론트엔드(percol-web) 연동 문서. 모든 엔드포인트·요청/응답·인증 흐름을 정리한다.
> 기계용 스펙은 같은 폴더의 **`openapi.json`** 참고(타입/클라이언트 자동생성 가능).

- **상태**: 백엔드 전 기능 구현 완료 (Auth / User / Diagnosis / Product / Bookmark / Post)
- **Base URL**: `http://localhost:3000/api/v1` (개발) · 배포 시 도메인만 교체
- **정적 파일(업로드 이미지)**: `http://localhost:3000/uploads/<filename>` (prefix 없음)
- **Swagger UI**: `http://localhost:3000/api/docs` — 브라우저에서 직접 테스트 가능

---

## 0. 백엔드 로컬 실행 방법

```bash
cd percol-server
docker compose up -d        # PostgreSQL (최초 1회/재부팅 시)
npm install
npm run seed                # 더미 상품 16개 + admin 계정 + 시즌 태깅
npm run start:dev           # http://localhost:3000
```

> CORS는 `.env`의 `FRONTEND_URL`(기본 `http://localhost:5173`)만 허용. 프론트 포트가 다르면 백엔드 `.env` 수정.

---

## 1. 공통 규약

### 1.1 성공 응답 — 항상 이 형태로 감싸짐
```jsonc
{ "success": true, "data": { /* 실제 데이터 */ } }
```
목록(페이지네이션)일 때만 `meta` 추가:
```jsonc
{
  "success": true,
  "data": [ /* 배열 */ ],
  "meta": { "page": 1, "limit": 20, "total": 134 }
}
```
> 프론트에서는 `res.data`만 꺼내 쓰면 됨. 권장: axios 인터셉터에서 `response.data.data`를 반환하도록 언래핑.

### 1.2 에러 응답
```jsonc
{
  "success": false,
  "error": { "code": "AUTH_REQUIRED", "message": "로그인이 필요합니다.", "statusCode": 401 }
}
```
주요 `code`: `VALIDATION_ERROR`(400) · `AUTH_REQUIRED`(401) · `FORBIDDEN`(403) · `NOT_FOUND`(404) · `CONFLICT`(409) · `INTERNAL_ERROR`(500)

### 1.3 페이지네이션 (목록 공통 쿼리)
`?page=1&limit=20` — `page` 기본 1, `limit` 기본 20·최대 50.

### 1.4 인증 헤더
보호 라우트는 헤더 필요:
```
Authorization: Bearer <accessToken>
```

### 1.5 Enum 값
| Enum | 값 |
|---|---|
| `Season` | `SPRING` `SUMMER` `FALL` `WINTER` |
| `Tone` | `WARM` `COOL` |
| `Method` | `PHOTO` `SELF_TEST` |
| `Role` | `USER` `ADMIN` |
| `Provider` | `KAKAO` `NAVER` `GOOGLE` |

---

## 2. 인증 (Auth)

### 2.1 소셜 로그인 흐름 (리다이렉트 방식)
1. 프론트에서 **브라우저를 이동**시킴 (fetch 아님, `window.location.href`):
   - `GET /api/v1/auth/google`
   - `GET /api/v1/auth/kakao`
   - `GET /api/v1/auth/naver`
2. 사용자가 소셜 로그인/동의 → 백엔드 콜백 처리(신규면 자동 가입)
3. 백엔드가 **프론트로 리다이렉트**:
   ```
   {FRONTEND_URL}/auth/callback?accessToken=xxx&refreshToken=yyy
   ```
4. 프론트의 `/auth/callback` 페이지에서 쿼리의 토큰을 꺼내 저장(localStorage 등) 후 홈으로 이동.

> 신규 가입 시 닉네임은 임시값(`google_a1b2c3d4`)이 부여됨 → 온보딩에서 `PATCH /users/me`로 변경 유도.

### 2.2 토큰 정책
- **accessToken**: 15분, 모든 보호 요청 헤더에 사용
- **refreshToken**: 7일, 재발급 전용. **회전(rotation)** — 재발급하면 이전 refresh는 즉시 무효

### 2.3 토큰 재발급
`POST /api/v1/auth/refresh`
```jsonc
// req body
{ "refreshToken": "yyy" }
// res data
{ "accessToken": "새 access", "refreshToken": "새 refresh" }
```
> access 401 발생 시 → refresh로 1회 재발급 → 실패하면 로그인 페이지로. (이전 refresh 재사용은 401)

### 2.4 기타
| 메서드 | 경로 | 인증 | 설명 |
|---|---|---|---|
| GET | `/auth/me` | 🔒 | 현재 사용자 요약 `{id,email,name,nickname,image,role}` |
| POST | `/auth/logout` | 🔒 | body `{refreshToken?}` (생략 시 내 모든 토큰 폐기) |

### 2.5 🧪 개발용 로그인 (소셜 없이 테스트)
`POST /api/v1/auth/dev-login` *(운영에선 비활성)*
```jsonc
// req body
{ "nickname": "tester", "role": "USER" }
// res data — 바로 쓸 수 있는 토큰
{ "accessToken": "...", "refreshToken": "...", "userId": "..." }
```
> 프론트 개발 초기에 소셜 연동 전이라도 이걸로 토큰 받아 보호 라우트 개발 가능.

---

## 3. 사용자 (User)

| 메서드 | 경로 | 인증 | 설명 |
|---|---|---|---|
| GET | `/users/me` | 🔒 | 내 정보 + `latestDiagnosis`(대표 진단 요약) |
| PATCH | `/users/me` | 🔒 | `{ nickname?, bio?, image? }` 수정 (닉네임 중복 시 409) |
| GET | `/users/me/page` | 🔒 | `{ postCount, bookmarkCount, diagnosisCount }` |
| GET | `/users/:nickname` | 🟡 | 공개 프로필 `{ id, nickname, image, bio, createdAt, postCount }` |

```jsonc
// GET /users/me → data
{
  "id": "ck...", "email": null, "name": "홍길동",
  "nickname": "가을사람", "image": null, "bio": "가을웜",
  "role": "USER", "createdAt": "2026-06-09T...",
  "latestDiagnosis": { "id":"...", "season":"FALL", "tone":"WARM", "subType":null, "createdAt":"..." }
}
```

---

## 4. 진단 (Diagnosis) — 핵심

진단은 **3가지 방식**. 비로그인도 진단 가능하나 **결과 저장은 로그인 시에만**(비로그인은 `id:null`로 결과만 반환).

### 4.1 셀프테스트 — 텍스트 문항 / 색 카드 두 모드

**① 단계 세트 조회**
`POST /api/v1/diagnosis/self-test/start?mode=question` (기본) 또는 `?mode=color`

```jsonc
// mode=question → data
{
  "mode": "QUESTION",
  "stages": [
    { "stage": 1, "title": "햇볕에 오래 있으면 피부는?",
      "choices": [ { "id": "tan_brown", "label": "갈색으로 그을린다" }, { "id": "red_then_back", "label": "빨개졌다 돌아온다" } ] },
    /* ... 9단계 */
  ]
}

// mode=color → data  ("Click a color!" 색 휠 UI용)
{
  "mode": "COLOR",
  "stages": [
    { "stage": 1, "title": "Click a color!", "hint": "얼굴이 가장 화사해 보이는 색을 고르세요.",
      "colors": [   // 단계당 24색 휠 (warm/cool 교차 배치 — 그대로 방사형으로 펼치면 됨)
        { "id": "s1_spring_0", "hex": "#ff8d7a" }, { "id": "s1_summer_0", "hex": "#aec6cf" },
        { "id": "s1_fall_0", "hex": "#7a5230" },   { "id": "s1_winter_0", "hex": "#1f3a5f" },
        /* ... 총 24색 */
      ] },
    /* ... 9단계, 단계마다 다른 색 구간 */
  ]
}
```
> **색 휠 UI 합성은 프론트 담당**: 사용자가 올린 얼굴 사진을 원형으로 중앙에 두고 24색을 방사형(부채꼴)으로 펼쳐 보여줌(첨부 "Click a color!" 화면). 사용자가 고른 색의 `id`를 제출하면 그 색의 시즌에 1표. `colors`는 이미 warm/cool 교차 순서라 받은 순서대로 휠에 배치하면 됨. 백엔드는 색만 내려주고 투표 집계로 채점.

**② 채점**
`POST /api/v1/diagnosis/self-test` 🟡
```jsonc
// req body — mode 생략 시 QUESTION
{ "mode": "COLOR", "answers": [ { "stage": 1, "choice": "s1_winter_0" }, /* 단계별 고른 색 id */ ] }
```
```jsonc
// res data (공통 결과 형태)
{
  "id": "ck... | null",          // 로그인 시 저장된 id, 비로그인 null
  "method": "SELF_TEST",
  "season": "WINTER", "tone": "COOL",
  "subType": null, "confidence": 0.78,
  "extractedColors": { /* 모드별 원본: 문항 축점수 또는 색 투표 */ },
  "recommendPalette": ["#1f3a5f", "#c0392b", "..."],
  "sisterPalette": "SUMMER",     // 자매 시즌(살짝 변형 OK)
  "avoidPalette": "SPRING"       // 회피 시즌
}
```

### 4.2 사진 자동분석
`POST /api/v1/diagnosis/photo` 🟡 — **multipart/form-data**, 필드명 `image`
- 형식: jpeg/png/webp, 최대 10MB
- **얼굴 사진은 분석 후 즉시 폐기**(저장 안 함)
```jsonc
// res data
{
  "id": "... | null", "method": "PHOTO",
  "season": "FALL", "tone": "WARM", "confidence": 0.78,
  "extractedColors": { "skinHex": "#d8b48a", "lab": { "L":75, "a":12, "b":22 } },
  "recommendPalette": ["#7a5230", "..."], "sisterPalette": "SPRING", "avoidPalette": "SUMMER"
}
```

### 4.3 진단 기록 (로그인)
| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/diagnosis?page&limit` | 내 기록 목록 |
| GET | `/diagnosis/:id` | 상세 |
| PATCH | `/diagnosis/:id` | `{ memo?, nickname? }` 수정 |
| DELETE | `/diagnosis/:id` | 삭제 |
> 남의 기록 접근 시 403.

---

## 5. 상품 (Product)

| 메서드 | 경로 | 인증 | 설명 |
|---|---|---|---|
| GET | `/products` | | 목록(필터/검색/정렬/페이지) |
| GET | `/products/:id` | | 상세(+시즌 태그) |
| GET | `/products/recommend` | 🔒 | 내 진단 기반 추천 |

**GET /products 쿼리**
```
?season=FALL&tone=WARM&category=상의&keyword=니트
&minPrice=10000&maxPrice=80000
&sort=recent|price_asc|price_desc&page=1&limit=20
```
```jsonc
// data[] 항목
{ "id":"...", "name":"머스타드 니트", "brand":"코어", "category":"상의",
  "price":39000, "imageUrl":"https://...", "productUrl":"https://...",
  "colorName":"머스타드", "colorHex":"#c9962f",
  "seasonTags":[ { "season":"SPRING", "tone":"WARM" } ] }
```

**GET /products/recommend** → 진단 없으면 400 (진단 먼저 안내)
```jsonc
// data
{
  "basis": { "season": "SPRING", "tone": "WARM" },
  "items": [ { "score": 0.94, "product": { /* 상품 */ } }, ... ]   // 카테고리 고루 섞임
}
```

> 상품 데이터는 추후 Python 크롤러가 같은 테이블에 적재. 지금은 시드 더미 16개로 동작.

---

## 6. 북마크 (Bookmark) — 🔒

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/bookmarks?page&limit` | 내 북마크 목록(상품 포함) |
| POST | `/bookmarks` | body `{ productId }` (멱등 — 중복 추가 OK) |
| DELETE | `/bookmarks/:productId` | 해제(없으면 404) |

---

## 7. 이미지 업로드 (Upload) — 🔒

`POST /api/v1/uploads/image` — **multipart/form-data**, 필드명 `image`
- jpeg/png/webp/gif, 최대 10MB
```jsonc
// res data
{ "url": "http://localhost:3000/uploads/<uuid>.jpg", "filename": "<uuid>.jpg" }
```
> 게시물/프로필 이미지는 **먼저 여기로 업로드 → 받은 `url`을 게시물 작성/프로필 수정에 사용**.
> (진단용 얼굴 사진은 여기 말고 `/diagnosis/photo`로 — 저장 안 됨)

---

## 8. 코디 게시물 (Post)

| 메서드 | 경로 | 인증 | 설명 |
|---|---|---|---|
| POST | `/posts` | 🔒 | 작성 |
| GET | `/posts?season&page&limit` | 🟡 | 피드(시즌 필터, `liked` 포함) |
| GET | `/posts/:id` | 🟡 | 상세 |
| PATCH | `/posts/:id` | 🔒 | 본인 수정 |
| DELETE | `/posts/:id` | 🔒 | 본인 삭제(이미지/태그/댓글/좋아요 cascade) |
| POST | `/posts/:id/like` | 🔒 | 좋아요 토글 |
| GET | `/posts/:id/comments` | | 댓글 목록 |
| POST | `/posts/:id/comments` | 🔒 | 댓글 작성 `{ content }` |
| DELETE | `/comments/:id` | 🔒 | 본인 댓글 삭제 |

**POST /posts — body**
```jsonc
{
  "content": "가을웜 데일리룩",
  "season": "FALL", "tone": "WARM",
  "images": ["http://localhost:3000/uploads/xxx.jpg"],   // 업로드로 받은 URL
  "productIds": ["prod_1", "prod_2"]                      // 태그할 상품
}
```
**게시물 응답 형태**
```jsonc
{
  "id":"...", "content":"...", "season":"FALL", "tone":"WARM", "createdAt":"...",
  "user": { "id":"...", "nickname":"poster", "image":null },
  "images": [ { "url":"...", "order":0 } ],
  "productTags": [ { "product": { /* 상품 */ } } ],
  "likeCount": 3, "commentCount": 1,
  "liked": true   // 현재 로그인 사용자의 좋아요 여부(비로그인 false)
}
```
**좋아요 토글 응답**: `{ "liked": true, "likeCount": 4 }`

> 수정 시 `images` 또는 `productIds`를 보내면 **전체 교체**(부분 추가 아님).

---

## 9. openapi.json 활용 (권장)

같은 폴더 `openapi.json`으로 타입/클라이언트 자동 생성:
```bash
# 예: TypeScript 타입 생성
npx openapi-typescript openapi.json -o src/api/schema.d.ts
# 예: 타입세이프 클라이언트(openapi-fetch) 등과 조합
```
> 백엔드 변경 시 `curl http://localhost:3000/api/docs-json -o openapi.json`으로 갱신.

---

## 10. 프론트 연동 체크리스트

- [ ] axios 인스턴스: baseURL `/api/v1`, 응답 인터셉터로 `data.data` 언래핑 + 에러 `data.error` 처리
- [ ] 요청 인터셉터: accessToken 헤더 자동 첨부
- [ ] 401 → refresh 1회 재시도 → 실패 시 로그인 이동
- [ ] `/auth/callback` 페이지: 쿼리 토큰 저장 후 라우팅
- [ ] 소셜 로그인 버튼: `window.location.href = '{API}/auth/{provider}'`
- [ ] 진단 2종 UI: 텍스트 문항 / 색 카드(얼굴 합성은 프론트) + 사진 업로드
- [ ] 이미지: 업로드(`/uploads/image`) → 받은 url을 게시물/프로필에 사용
- [ ] 개발 중엔 `/auth/dev-login`으로 토큰 받아 보호 화면 개발
```
