import { useLayoutEffect } from "react";
import { useDeviceStore } from "@/states/deviceStore";

export const useInitializeDevice = () => {
  const { setDevice } = useDeviceStore();

  useLayoutEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const tabletQuery = window.matchMedia("(min-width: 768px) and (max-width: 1024px)");

    const handleResize = () => {
      setDevice({
        isMobile: mobileQuery.matches,
        isTablet: tabletQuery.matches,
      });
    };

    handleResize(); // 초기 렌더링 시 실행

    mobileQuery.addEventListener("change", handleResize);
    tabletQuery.addEventListener("change", handleResize);

    return () => {
      mobileQuery.removeEventListener("change", handleResize);
      tabletQuery.removeEventListener("change", handleResize);
    };
  }, [setDevice]);
};
