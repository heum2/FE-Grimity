import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { authState } from "@/states/authState";
import axiosInstance from "@/constants/baseurl";
import { MyProfileResponse } from "@grimity/dto";

export async function getMyInfo(): Promise<MyProfileResponse> {
  try {
    const response = await axiosInstance.get("/users/me");

    return response.data;
  } catch (error) {
    console.error("Error fetching Profile:", error);
    throw new Error("Failed to fetch Profile");
  }
}

export function useMyData() {
  const { isLoggedIn } = useRecoilValue(authState);
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery<MyProfileResponse>("myInfo", getMyInfo, {
    enabled: isLoggedIn && Boolean(accessToken),
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
}
