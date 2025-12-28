import Head from "next/head";

import DirectPage from "@/components/DirectPage/DirectPage";
import AuthLayout from "@/components/Layout/AuthLayout/AuthLayout";
import EmptyChatRoom from "@/components/DirectPage/EmptyChatRoom/EmptyChatRoom";

import { useDeviceStore } from "@/states/deviceStore";

const Direct = () => {
  const { isMobile, isTablet } = useDeviceStore();

  return (
    <AuthLayout>
      <Head>
        <title>DM - 그리미티</title>
      </Head>
      <DirectPage />
      {!isMobile && !isTablet && <EmptyChatRoom />}
    </AuthLayout>
  );
};

export default Direct;