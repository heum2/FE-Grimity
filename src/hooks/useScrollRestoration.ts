import { useRouter } from "next/router";
import { useEffect } from "react";

export const useScrollRestoration = (key: string) => {
  const router = useRouter();

  const saveScrollPosition = () => {
    const scrollPosition = window.scrollY;
    sessionStorage.setItem(key, String(scrollPosition));
  };

  const restoreScrollPosition = () => {
    const savedPosition = sessionStorage.getItem(key);
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }
  };

  useEffect(() => {
    restoreScrollPosition();

    const handleRouteChangeStart = () => saveScrollPosition();
    router.events.on("routeChangeStart", handleRouteChangeStart);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router]);

  return { saveScrollPosition, restoreScrollPosition };
};
