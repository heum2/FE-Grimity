import Button from "@/components/Button/Button";
import { InitialPageMeta } from "@/components/MetaData/MetaData";
import { serviceUrl } from "@/constants/serviceurl";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BoardPage() {
  const router = useRouter();
  const [OGTitle] = useState("그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);

  useEffect(() => {
    setOGUrl(serviceUrl + router.asPath);
  }, [router.asPath]);

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <p>자유게시판</p>
      <Link href="/board/write">
        <Button size="m" type="filled-primary">
          글 업로드
        </Button>
      </Link>
    </>
  );
}
