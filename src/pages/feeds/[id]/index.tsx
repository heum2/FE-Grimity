import Detail from "@/components/Detail/Detail";
import { InitialPageMeta } from "@/components/MetaData/MetaData";
import { serviceUrl } from "@/constants/serviceurl";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function FeedDetail() {
  const router = useRouter();
  const [OGTitle] = useState("그림 상세 - 그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  const { restoreScrollPosition } = useScrollRestoration("details-scroll");

  useEffect(() => {
    if (sessionStorage.getItem("details-scroll") !== null) {
      restoreScrollPosition();
      sessionStorage.removeItem("details-scroll");
    }
  }, []);

  useEffect(() => {
    setOGUrl(serviceUrl + router.asPath);
  }, [router.asPath]);

  const { id } = router.query;

  if (!id) {
    return null;
  }

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <Detail id={id as string} />
    </>
  );
}
