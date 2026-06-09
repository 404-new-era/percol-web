# percol-web (프론트엔드)

퍼컬(PerCol) 프론트엔드. 백엔드 API 연동 자료가 준비되어 있습니다.

## 백엔드 연동 자료
- **[API_연동_가이드.md](./API_연동_가이드.md)** — 인증 흐름·전체 엔드포인트·요청/응답 예시 (먼저 읽기)
- **[openapi.json](./openapi.json)** — OpenAPI 스펙(타입/클라이언트 자동생성용)

## 빠른 시작
```bash
# 1) 백엔드 먼저 띄우기 (percol-server)
cd ../percol-server && docker compose up -d && npm run start:dev
# → API: http://localhost:3000/api/v1 , Swagger: http://localhost:3000/api/docs

# 2) 개발 중 토큰이 필요하면 (소셜 연동 전)
curl -X POST http://localhost:3000/api/v1/auth/dev-login \
  -H 'Content-Type: application/json' -d '{"nickname":"tester"}'
```

## 핵심 메모
- Base URL: `http://localhost:3000/api/v1` · 업로드 이미지: `http://localhost:3000/uploads/<file>`
- 모든 응답은 `{ success, data, meta? }`로 감싸짐 → `data`만 사용
- 보호 라우트: `Authorization: Bearer <accessToken>`
- 소셜 로그인은 리다이렉트 방식 → `/auth/callback?accessToken=&refreshToken=`에서 토큰 수신
- 진단 2종(텍스트 문항 / 색 카드) + 사진 자동분석 — 색 카드의 얼굴-색 합성은 **프론트** 담당
- CORS 허용 출처는 백엔드 `.env`의 `FRONTEND_URL` (기본 `http://localhost:5173`)
