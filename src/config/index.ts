export const CONFIG = {
  // API 및 서비스 도메인 관련
  ENV: {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "",
    IMAGE_URL: process.env.NEXT_PUBLIC_IMAGE_URL || "",
    SERVICE_URL: process.env.NEXT_PUBLIC_SERVICE_URL || "",
  },

  // 서드파티 인증 (Social Login)
  AUTH: {
    KAKAO_APP_KEY: process.env.NEXT_PUBLIC_KAKAO_APP_KEY || "",
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  },

  // 분석 및 광고 (Marketing)
  MARKETING: {
    GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID || "",
    ADSENSE_CLIENT_ID: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",
    AD_SLOTS: {
      BOARD_DETAIL_VERTICAL: "2474324282", // 게시판 상세 - 수직형
      BOARD_DETAIL_HORIZONTAL: "8521923544", // 게시판 상세 - 수평형
    },
  },
} as const;
