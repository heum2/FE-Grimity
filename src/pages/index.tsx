import { InitialPageMeta } from "@/components/MetaData/MetaData";
import styles from "@/styles/pages/home.module.scss";
import { serviceUrl } from "@/constants/serviceurl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Ranking from "@/components/Layout/Ranking/Ranking";
import NewFeed from "@/components/Layout/NewFeed/NewFeed";
import FollowNewFeed from "@/components/Layout/FollowNewFeed/FollowNewFeed";
import { authState } from "@/states/authState";
import { useRecoilValue } from "recoil";
import MainBoard from "@/components/Layout/MainBoard/MainBoard";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

export default function Home() {
  const router = useRouter();
  const [OGTitle] = useState("그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  const { isLoggedIn } = useRecoilValue(authState);
  const { restoreScrollPosition } = useScrollRestoration("home-scroll");

  useEffect(() => {
    setOGUrl(serviceUrl + router.asPath);
  }, [router.asPath]);

  useEffect(() => {
    if (sessionStorage.getItem("home-scroll") !== null) {
      restoreScrollPosition();
      sessionStorage.removeItem("home-scroll");
    }
  }, []);

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <div className={styles.container}>
        <section className={styles.FeedSection}>
          <Ranking />
          <div className={styles.bar} />
          {isLoggedIn && (
            <>
              <FollowNewFeed />
              <div className={styles.bar} />
            </>
          )}
          <NewFeed />
        </section>
        <section className={styles.BoardSection}>
          <MainBoard type="POPULAR" />
          <div className={styles.bar} />
          <MainBoard type="FEEDBACK" />
          <div className={styles.bar} />
          <MainBoard type="QUESTION" />
        </section>
      </div>
    </>
  );
}
