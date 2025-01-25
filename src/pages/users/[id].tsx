import { useMyData } from "@/api/users/getMe";
import { InitialPageMeta } from "@/components/MetaData/MetaData";
import ProfilePage from "@/components/ProfilePage/ProfilePage";
import { serviceUrl } from "@/constants/serviceurl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MyPage() {
  const router = useRouter();
  const { data: myData } = useMyData();
  const [OGTitle] = useState("프로필 조회 - 그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);

  useEffect(() => {
    setOGUrl(serviceUrl + router.asPath);
  }, [router.asPath]);

  const { id } = router.query;
  const loggedInUserId = myData?.id;
  const isMyProfile = id === loggedInUserId;

  if (!id) {
    return null;
  }

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <ProfilePage isMyProfile={isMyProfile} id={id as string} />
    </>
  );
}
