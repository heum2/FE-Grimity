import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { error } = req.query;

  if (error) {
    console.error("Apple login error:", error);
    return res.redirect(`/?error=${error}`);
  }

  // 성공한 경우
  // usePopup:true 에서는 호출되지 않지만, 이 엔드포인트가 팝업 창에서 호출되고
  // Apple SDK가 자동으로 처리

  // 간단한 성공 페이지 HTML 반환
  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>애플 로그인 처리 중...</title>
        <script type="text/javascript" src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"></script>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
        </style>
      </head>
      <body>
        <p>애플 로그인 처리 중...</p>
        <script>
          // Apple SDK가 자동으로 팝업을 닫고 부모 창으로 인증 데이터를 전달합니다
          console.log("Apple callback page loaded");
        </script>
      </body>
    </html>
  `);
}
