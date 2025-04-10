import { InitialPageMeta } from "@/components/MetaData/MetaData";
import MyPage from "@/components/MyPage/MyPage";
import { serviceUrl } from "@/constants/serviceurl";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/states/authStore";

export default function Mypage() {
  const router = useRouter();
  const { tab } = router.query;

  const getTabData = () => {
    switch (tab) {
      case "liked-feeds":
        return "좋아요한 그림";
      case "saved-feeds":
        return "저장한 그림";
      case "liked-posts":
        return "좋아요한 글";
      case "my-comments":
        return "내가 쓴 댓글";
      default:
        return "마이페이지";
    }
  };

  const [OGTitle, setOGTitle] = useState<string>(getTabData());
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  const { restoreScrollPosition } = useScrollRestoration("mypage-scroll");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    setOGUrl(`${serviceUrl}/${router.asPath}`);
  }, [router.asPath]);

  useEffect(() => {
    setOGTitle(`${getTabData()} - 그리미티`);
  }, [tab]);

  useEffect(() => {
    if (sessionStorage.getItem("mypage-scroll") !== null) {
      restoreScrollPosition();
      sessionStorage.removeItem("mypage-scroll");
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <MyPage />
    </>
  );
}
