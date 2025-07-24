import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { InitialPageMeta } from "@/components/MetaData/MetaData";
import Upload from "@/components/Upload/Upload";
import AuthLayout from "@/components/Layout/AuthLayout/AuthLayout";

import { serviceUrl } from "@/constants/serviceurl";

export default function Write() {
  const router = useRouter();
  const [OGTitle] = useState("그림 올리기 - 그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);

  useEffect(() => {
    setOGUrl(`${serviceUrl}/${router.asPath}`);
  }, [router.asPath]);

  return (
    <AuthLayout>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <Upload />
    </AuthLayout>
  );
}
