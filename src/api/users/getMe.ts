import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface MyInfoResponse {
  id: string;
  provider: "GOOGLE" | "KAKAO";
  email: string;
  name: string;
  image: string;
  description: string;
  links: { linkName: string; link: string }[];
  createdAt: string;
  followerCount: number;
  followingCount: number;
  hasNotification: boolean;
}

export async function getMyInfo(): Promise<MyInfoResponse> {
  try {
    const response = await BASE_URL.get("/users/me");

    const updatedData = response.data;
    updatedData.image = `https://image.grimity.com/${updatedData.image}`;

    return updatedData;
  } catch (error) {
    console.error("Error fetching Profile:", error);
    throw new Error("Failed to fetch Profile");
  }
}

export function useMyData() {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery<MyInfoResponse>("myInfo", getMyInfo, {
    enabled: Boolean(accessToken),
  });
}
