import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { InitialPageMeta } from "@/components/MetaData/MetaData";
import Ranking from "@/components/RankingPage";

import { serviceUrl } from "@/constants/serviceurl";

import { useScrollRestoration } from "@/hooks/useScrollRestoration";

function RankingPage() {
  const router = useRouter();
  const [OGTitle] = useState("그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  const { restoreScrollPosition } = useScrollRestoration("popular-scroll");

  useEffect(() => {
    setOGUrl(`${serviceUrl}/${router.asPath}`);
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
      <Ranking />
    </>
  );
}

export default RankingPage;
