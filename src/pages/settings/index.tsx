import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import AuthLayout from "@/components/Layout/AuthLayout/AuthLayout";
import { InitialPageMeta } from "@/components/MetaData/MetaData";
import SettingsNav from "@/components/Settings/SettingsNav/SettingsNav";
import { serviceUrl } from "@/constants/serviceurl";

const TABLET_MIN_WIDTH = 768;

export default function SettingsIndexPage() {
  const router = useRouter();
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= TABLET_MIN_WIDTH) {
      router.replace("/settings/account");
    } else {
      setShowMobileNav(true);
    }
  }, [router]);

  return (
    <AuthLayout>
      <InitialPageMeta title="설정 - 그리미티" url={`${serviceUrl}/settings`} />
      {showMobileNav && <SettingsNav />}
    </AuthLayout>
  );
}
