import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:description" content="그림쟁이들을 위한 그림 커뮤니티, 그리미티" />
        <meta property="og:image" content="/image/grimity.png" />
        <meta property="og:type" content="website" />
        <meta
          name="keywords"
          content="그림, 커뮤니티, 그리미티, grimity, 일러스트, 일러스트레이터, 갤러리"
        />
        <meta name="author" content="grimity" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="그리미티" />
        <meta name="twitter:description" content="그림쟁이들을 위한 그림 커뮤니티, 그리미티" />
        <meta
          name="twitter:image"
          content="https://avatars.githubusercontent.com/u/194518500?s=200&v=4"
        />
        <meta name="twitter:url" content="https://www.grimity.com" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "그리미티",
              description: "그림쟁이들을 위한 그림 커뮤니티, 그리미티",
              url: "https://www.grimity.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "서울특별시",
                addressCountry: "KR",
              },
              image: "/favicon/android-chrome-192x192.png",
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
