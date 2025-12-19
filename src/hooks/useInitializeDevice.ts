import { useLayoutEffect } from "react";
import { useDeviceStore, type DeviceType } from "@/states/deviceStore";

export const useInitializeDevice = () => {
  const { setDevice } = useDeviceStore();

  useLayoutEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const tabletQuery = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");

    const handleResize = () => {
      const isMobile = mobileQuery.matches;
      const isTablet = tabletQuery.matches;
      const isDesktop = !isMobile && !isTablet;

      let deviceType: DeviceType;
      if (isMobile) {
        deviceType = "mobile";
      } else if (isTablet) {
        deviceType = "tablet";
      } else {
        deviceType = "desktop";
      }

      setDevice({
        isMobile,
        isTablet,
        isDesktop,
        deviceType,
      });
    };

    handleResize();

    mobileQuery.addEventListener("change", handleResize);
    tabletQuery.addEventListener("change", handleResize);

    return () => {
      mobileQuery.removeEventListener("change", handleResize);
      tabletQuery.removeEventListener("change", handleResize);
    };
  }, [setDevice]);
};
