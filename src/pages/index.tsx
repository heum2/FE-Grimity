import { InitialPageMeta } from "@/components/MetaData/MetaData";
import styles from "@/styles/pages/home.module.scss";
import { serviceUrl } from "@/constants/serviceurl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Ranking from "@/components/Layout/Ranking/Ranking";

export default function Home() {
  const router = useRouter();
  const [OGTitle] = useState("그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);

  useEffect(() => {
    setOGUrl(serviceUrl + router.asPath);
  }, [router.asPath]);

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <div className={styles.container}>
        <Ranking />
      </div>
    </>
  );
}
