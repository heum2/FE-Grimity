import Board from "@/components/Board/Board";
import { InitialPageMeta } from "@/components/MetaData/MetaData";
import { serviceUrl } from "@/constants/serviceurl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BoardPage() {
  const router = useRouter();
  const [OGTitle] = useState("자유게시판 - 그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);

  useEffect(() => {
    setOGUrl(serviceUrl + router.asPath);
  }, [router.asPath]);

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <Board />
    </>
  );
}
