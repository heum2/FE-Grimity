import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/states/authStore";
import axiosInstance from "@/constants/baseurl";
import { MyProfileResponse } from "@grimity/dto";

export async function getMyInfo(): Promise<MyProfileResponse> {
  try {
    const response = await axiosInstance.get("/me");

    return response.data;
  } catch (error) {
    console.error("Error fetching Profile:", error);
    throw new Error("Failed to fetch Profile");
  }
}

export function useMyData() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery<MyProfileResponse>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    enabled: isLoggedIn && Boolean(accessToken),
    // Consistent with other queries to prevent unnecessary waterfalls
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}
