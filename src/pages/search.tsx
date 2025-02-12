import { InitialPageMeta } from "@/components/MetaData/MetaData";
import SearchPage from "@/components/SearchPage/SearchPage";
import { serviceUrl } from "@/constants/serviceurl";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function search() {
  const router = useRouter();
  const [OGTitle] = useState("검색 결과 - 그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  const { restoreScrollPosition } = useScrollRestoration("search-scroll");

  useEffect(() => {
    setOGUrl(serviceUrl + router.asPath);
  }, [router.asPath]);

  useEffect(() => {
    if (sessionStorage.getItem("search-scroll") !== null) {
      restoreScrollPosition();
      sessionStorage.removeItem("search-scroll");
    }
  }, []);

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <SearchPage />
    </>
  );
}
