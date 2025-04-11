import { useEffect } from "react";
import { useDeviceStore } from "@/states/deviceStore";

export const useIsMobile = () => {
  useEffect(() => {
    const setIsMobile = useDeviceStore.getState().setIsMobile;
    const setIsTablet = useDeviceStore.getState().setIsTablet;
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 767);
      setIsTablet(width > 767 && width <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
};
