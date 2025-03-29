import { InitialPageMeta } from "@/components/MetaData/MetaData";
import EditFeeds from "@/components/Upload/EditFeeds/EditFeeds";
import { serviceUrl } from "@/constants/serviceurl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function FeedEditPage() {
  const router = useRouter();
  const [OGTitle] = useState("그림 수정하기 - 그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);

  useEffect(() => {
    setOGUrl(`${serviceUrl}/${router.asPath}`);
  }, [router.asPath]);

  const { id } = router.query;

  if (!id) {
    return null;
  }

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <EditFeeds id={id as string} />
    </>
  );
}
