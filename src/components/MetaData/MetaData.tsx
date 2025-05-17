import Head from "next/head";
import { InitialPageMetaProps } from "./MetaData.type";
import { serviceUrl } from "@/constants/serviceurl";
import { DEFAULT_THUMBNAIL_GRIMITY } from "@/constants/imageUrl";

export function InitialPageMeta({ title, url }: InitialPageMetaProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="그림쟁이들을 위한 그림 커뮤니티, 그리미티" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content="그림쟁이들을 위한 그림 커뮤니티, 그리미티" />
        <meta property="og:image" content={DEFAULT_THUMBNAIL_GRIMITY} />
        <meta property="og:url" content={url ?? serviceUrl} />
        <meta property="og:type" content="website" />
        <meta
          name="keywords"
          content="그림, 커뮤니티, 그리미티, grimity, 일러스트, 일러스트레이터, 갤러리"
        />
        <meta name="author" content="그리미티" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content="그림쟁이들을 위한 그림 커뮤니티, 그리미티" />
        <meta name="twitter:image" content={DEFAULT_THUMBNAIL_GRIMITY} />
        <meta name="twitter:url" content={url ?? "https://www.grimity.com"} />
        <meta name="naver-site-verification" content="ad68cc7c7ab33fa1b5958b47805c1fc3009f5488" />
      </Head>
    </>
  );
}
