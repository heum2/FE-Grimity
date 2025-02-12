import Head from "next/head";
import { InitialPageMetaProps } from "./MetaData.type";
import { serviceUrl } from "@/constants/serviceurl";

export function InitialPageMeta({ title, url }: InitialPageMetaProps) {
  return (
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
    </Head>
  );
}
