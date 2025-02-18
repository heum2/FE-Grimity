import Head from "next/head";
import Script from "next/script";
import { InitialPageMetaProps } from "./MetaData.type";
import { serviceUrl } from "@/constants/serviceurl";

export function InitialPageMeta({ title, url }: InitialPageMetaProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url ?? serviceUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content="그림쟁이들을 위한 그림 커뮤니티, 그리미티" />
        <meta
          name="twitter:image"
          content="https://avatars.githubusercontent.com/u/194518500?s=200&v=4"
        />
        <meta name="twitter:url" content={url ?? "https://www.grimity.com"} />
        <meta name="naver-site-verification" content="ad68cc7c7ab33fa1b5958b47805c1fc3009f5488" />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-315CM7P7E5"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-315CM7P7E5');
          `,
          }}
        />
      </Head>
    </>
  );
}
