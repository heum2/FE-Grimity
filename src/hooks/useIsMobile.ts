import { isMobileState, isTabletState } from "@/states/isMobileState";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

export const useIsMobile = () => {
  const setIsMobile = useSetRecoilState(isMobileState);
  const setIsTablet = useSetRecoilState(isTabletState);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);

  useEffect(() => {
    const handleResize = () => setIsTablet(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setIsTablet]);
};
