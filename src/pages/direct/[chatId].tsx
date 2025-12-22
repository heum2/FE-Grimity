import { useRouter } from "next/router";
import Head from "next/head";

import AuthLayout from "@/components/Layout/AuthLayout/AuthLayout";
import DirectPage from "@/components/DirectPage/DirectPage";
import { useDeviceStore } from "@/states/deviceStore";

import ChatRoom from "@/components/ChatRoom/ChatRoom";

const DirectChatPage = () => {
  const router = useRouter();
  const { chatId } = router.query;
  const { isMobile, isTablet } = useDeviceStore();

  if (!chatId || Array.isArray(chatId)) {
    return null;
  }

  if (isMobile || isTablet) {
    return (  
      <AuthLayout>
        <Head>
          <title>DM - 그리미티</title>
        </Head>
        <ChatRoom chatId={chatId} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Head>
        <title>DM - 그리미티</title>
      </Head>
      <DirectPage />
      <ChatRoom chatId={chatId} />
    </AuthLayout>
  );
};

export default DirectChatPage;
