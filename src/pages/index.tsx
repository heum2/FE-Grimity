import { InitialPageMeta } from "@/components/MetaData/MetaData";
import styles from "@/styles/pages/home.module.scss";
import { serviceUrl } from "@/constants/serviceurl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Ranking from "@/components/Layout/Ranking/Ranking";
import NewFeed from "@/components/Layout/NewFeed/NewFeed";
import FollowNewFeed from "@/components/Layout/FollowNewFeed/FollowNewFeed";
import { useAuthStore } from "@/states/authState";
import MainBoard from "@/components/Layout/MainBoard/MainBoard";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useDeviceStore } from "@/states/deviceStore";
import BoardPopular from "@/components/Board/BoardPopular/BoardPopular";
import IconComponent from "@/components/Asset/Icon";
import Link from "next/link";
import Banner from "@/components/Layout/Banner/Banner";

export default function Home() {
  const router = useRouter();
  const [OGTitle] = useState("그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { restoreScrollPosition } = useScrollRestoration("home-scroll");
  const isMobile = useDeviceStore((state) => state.isMobile);
  const isTablet = useDeviceStore((state) => state.isTablet);
  useIsMobile();

  useEffect(() => {
    setOGUrl(`${serviceUrl}/${router.asPath}`);
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
        {!isMobile && !isTablet && (
          <>
            <section className={styles.FeedSection}>
              <Banner />
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
              <MainBoard type="NOTICE" />
              <div className={styles.bar} />
              <MainBoard type="POPULAR" />
              <div className={styles.bar} />
              <MainBoard type="FEEDBACK" />
              <div className={styles.bar} />
              <MainBoard type="QUESTION" />
            </section>
          </>
        )}
        {(isMobile || isTablet) && (
          <>
            <section className={styles.MobileSection}>
              <Banner />
              <Ranking />
              <div className={styles.bar} />
              {isLoggedIn && (
                <>
                  <FollowNewFeed />
                  <div className={styles.bar} />
                </>
              )}
              {isMobile ? <BoardPopular isMobileMain /> : <BoardPopular />}
              <div className={styles.bar} />
              <NewFeed />
            </section>
            <Link href="/write">
              <div className={styles.uploadButton} role="button" tabIndex={0}>
                <IconComponent name="mobileUpload" size={32} isBtn />
              </div>
            </Link>
          </>
        )}
      </div>
    </>
  );
}
