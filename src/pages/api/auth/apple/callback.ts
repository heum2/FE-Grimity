import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { error } = req.query;

  if (error) {
    console.error("Apple login error:", error);
    return res.redirect(`/?error=${error}`);
  }

  // 성공한 경우
  // usePopup:true 모드에서는 호출되지 않지만, 이 엔드포인트가 팝업 창에서 호출되고
  // Apple SDK가 자동으로 처리

  // 간단한 성공 페이지 HTML 반환
  return res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>애플 로그인 처리 중...</title>
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
          // usePopup 모드에서는 Apple SDK가 자동으로 팝업을 닫습니다
          // 필요한 경우 여기서 추가 처리 가능
        </script>
      </body>
    </html>
  `);
}
