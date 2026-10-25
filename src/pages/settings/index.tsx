import { useEffect } from "react";
import { useRouter } from "next/router";

import AuthLayout from "@/components/Layout/AuthLayout/AuthLayout";
import { InitialPageMeta } from "@/components/MetaData/MetaData";
import SettingsNav from "@/components/Settings/SettingsNav/SettingsNav";
import { serviceUrl } from "@/constants/serviceurl";
import { useDeviceStore } from "@/states/deviceStore";

export default function SettingsIndexPage() {
  const router = useRouter();
  const isMobile = useDeviceStore((s) => s.isMobile);

  useEffect(() => {
    // 기기 스토어는 상위 effect에서 초기화되므로 첫 실행 시점엔 기본값(desktop)이다. 뷰포트를 직접 확인한다.
    if (!window.matchMedia("(max-width: 767px)").matches) {
      router.replace("/settings/account");
    }
  }, [router]);

  return (
    <AuthLayout>
      <InitialPageMeta title="설정 - 그리미티" url={`${serviceUrl}/settings`} />
      {isMobile && <SettingsNav />}
    </AuthLayout>
  );
}
