import { isMobileState } from "@/states/isMobileState";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

export const useIsMobile = () => {
  const setIsMobile = useSetRecoilState(isMobileState);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);
};
