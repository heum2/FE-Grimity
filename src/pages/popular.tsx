import { InitialPageMeta } from "@/components/MetaData/MetaData";
import Popular from "@/components/PopularPage/PopularPage";
import { serviceUrl } from "@/constants/serviceurl";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PopularPage() {
  const router = useRouter();
  const [OGTitle] = useState("그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  const { restoreScrollPosition } = useScrollRestoration("popular-scroll");

  useEffect(() => {
    setOGUrl(serviceUrl + router.asPath);
  }, [router.asPath]);

  useEffect(() => {
    if (sessionStorage.getItem("popular-scroll") !== null) {
      restoreScrollPosition();
      sessionStorage.removeItem("popular-scroll");
    }
  }, []);

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <Popular />
    </>
  );
}
