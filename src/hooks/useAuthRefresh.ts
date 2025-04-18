import { useEffect } from "react";
import { useAuthStore } from "@/states/authStore";

export function useAuthRefresh() {
  const { isLoggedIn, setIsLoggedIn, setAccessToken, setUserId } = useAuthStore();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");

    if (accessToken && !isLoggedIn) {
      setIsLoggedIn(true);
      setAccessToken(accessToken);
      if (userId) setUserId(userId);
    } else if (!accessToken && isLoggedIn) {
      setIsLoggedIn(false);
      setAccessToken("");
      setUserId("");
    }
  }, []);
}
