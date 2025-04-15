import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/states/authStore";

export default function useAuthCheck(setIsHome: (home: boolean) => void) {
  const router = useRouter();
  const isAuth = useRef(false);

  const { isLoggedIn, setIsLoggedIn, setAccessToken, setUserId } = useAuthStore();

  useEffect(() => {
    setIsHome(true);

    if (isAuth.current || router.pathname !== "/") return;

    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      if (!isLoggedIn) {
        setIsLoggedIn(true);
        setAccessToken(accessToken);

        const userId = localStorage.getItem("user_id");
        if (userId) setUserId(userId);
      }
    } else {
      if (isLoggedIn) {
        setIsLoggedIn(false);
        setAccessToken("");
        setUserId("");
      }
    }

    isAuth.current = true;
  }, [router.pathname]);

  // 라우터 이벤트 감지
  useEffect(() => {
    const handleRouteChange = () => {
      isAuth.current = false;
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
}
