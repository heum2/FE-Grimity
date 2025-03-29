import { InitialPageMeta } from "@/components/MetaData/MetaData";
import { serviceUrl } from "@/constants/serviceurl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BoardWrite from "@/components/Board/BoardWrite/BoardWrite";

export default function BoardWritePage() {
  const router = useRouter();
  const [OGTitle] = useState("글 올리기 - 그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);

  useEffect(() => {
    setOGUrl(`${serviceUrl}/${router.asPath}`);
  }, [router.asPath]);

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <BoardWrite />
    </>
  );
}
