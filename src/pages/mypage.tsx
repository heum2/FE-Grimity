import { InitialPageMeta } from "@/components/MetaData/MetaData";
import MyPage from "@/components/MyPage/MyPage";
import { serviceUrl } from "@/constants/serviceurl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const [OGUrl, setOGUrl] = useState<string>(serviceUrl);

  useEffect(() => {
    setOGUrl(serviceUrl + router.asPath);
  }, [router.asPath]);

  useEffect(() => {
    setOGTitle(`${getTabData()} - 그리미티`);
  }, [tab]);

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <MyPage />
    </>
  );
}
