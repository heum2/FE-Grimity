import { getSSRUserInfo, UserInfoResponse } from "@/api/users/getId";
import { useMyData } from "@/api/users/getMe";
import { InitialPageMeta } from "@/components/MetaData/MetaData";
import ProfilePage from "@/components/ProfilePage/ProfilePage";
import { serviceUrl } from "@/constants/serviceurl";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
  data: UserInfoResponse;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const data = await getSSRUserInfo(id);

    return {
      props: { data },
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default function Profile({ data }: Props) {
  const router = useRouter();
  const { data: myData } = useMyData();
  const [OGTitle] = useState("프로필 조회 - 그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  const { restoreScrollPosition } = useScrollRestoration("profile-scroll");

  useEffect(() => {
    setOGUrl(serviceUrl + router.asPath);
  }, [router.asPath]);

  useEffect(() => {
    if (sessionStorage.getItem("profile-scroll") !== null) {
      restoreScrollPosition();
      sessionStorage.removeItem("profile-scroll");
    }
  }, []);

  const { id } = router.query;
  const loggedInUserId = myData?.id;
  const isMyProfile = id === loggedInUserId;

  if (!id) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`${data.name}의 프로필 - 그리미티`}</title>
        <meta name="description" content={data.description ?? ""} />
        <meta property="og:title" content={`${data.name} - 그리미티`} />
        <meta property="og:description" content={`${data.description} | grimity |`} />
        <meta property="og:image" content={data.image ?? ""} />
        <meta property="og:url" content={`${serviceUrl}users/${data.id}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${data.name}의 프로필 - 그리미티`} />
        <meta name="twitter:description" content={data.description ?? ""} />
        <meta name="twitter:image" content={data.image ?? ""} />
      </Head>
      <ProfilePage isMyProfile={isMyProfile} id={id as string} />
    </>
  );
}
