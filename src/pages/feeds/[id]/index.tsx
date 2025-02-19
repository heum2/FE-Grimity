import { useDetails } from "@/api/feeds/getFeedsId";
import Detail from "@/components/Detail/Detail";
import { DetailsPageMeta } from "@/components/MetaData/MetaData";
import { serviceUrl } from "@/constants/serviceurl";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function FeedDetail() {
  const router = useRouter();
  const [title, setTitle] = useState("그림 상세 - 그리미티");
  const [url, setUrl] = useState(serviceUrl);
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const { restoreScrollPosition } = useScrollRestoration("details-scroll");

  useEffect(() => {
    if (sessionStorage.getItem("details-scroll") !== null) {
      restoreScrollPosition();
      sessionStorage.removeItem("details-scroll");
    }
  }, []);

  useEffect(() => {
    setUrl(serviceUrl + router.asPath);
  }, [router.asPath]);

  const { id } = router.query;
  const { data: details } = useDetails(id as string);

  useEffect(() => {
    if (details) {
      setTitle(`${details.title ?? "그림 상세"} - 그리미티`);
      setDescription(`${details.content ?? ""} ${details.tags ?? ""}`);
      setThumbnail(details.thumbnail ?? "");
    }
  }, [details]);

  if (!id) {
    return null;
  }

  return (
    <>
      <DetailsPageMeta title={title} description={description} url={url} thumbnail={thumbnail} />
      <Detail id={id as string} />
    </>
  );
}
