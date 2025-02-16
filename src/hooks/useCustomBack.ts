import { useEffect } from "react";

export function useCustomBack(onBack: () => void) {
  useEffect(() => {
    const handlePopstate = () => {
      onBack();
    };

    history.pushState(null, "", location.href);
    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [onBack]);
}
