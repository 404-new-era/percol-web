import type { NextConfig } from "next";

/**
 * 백엔드 오리진 (서버 사이드 env). 기본값은 배포 서버.
 * 로컬 백엔드로 붙이려면 BACKEND_ORIGIN=http://localhost:3000 설정.
 */
const BACKEND_ORIGIN =
  process.env.BACKEND_ORIGIN ?? "http://43.201.8.235:3000";

const nextConfig: NextConfig = {
  /**
   * 같은 출처(/api/v1, /uploads)로 들어온 요청을 백엔드로 프록시.
   * → 브라우저는 same-origin 호출이라 CORS가 발생하지 않음.
   */
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${BACKEND_ORIGIN}/api/v1/:path*` },
      { source: "/uploads/:path*", destination: `${BACKEND_ORIGIN}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
