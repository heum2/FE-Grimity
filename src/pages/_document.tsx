import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="og:description" content="그림쟁이들을 위한 그림 커뮤니티, 그리미티" />
        <meta property="og:image" content="/image/grimity.png" />
        <meta property="og:type" content="website" />
        <meta
          name="keywords"
          content="그림, 커뮤니티, 그리미티, grimity, 일러스트, 일러스트레이터, 갤러리"
        />
        <meta name="author" content="grimity" />
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicon/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/favicon/android-chrome-512x512.png"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <script defer src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>
        <script defer src="https://accounts.google.com/gsi/client" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
