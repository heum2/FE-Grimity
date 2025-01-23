import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface PopularResponse {
  id: string;
  name: string;
  image: string;
  followerCount: number;
  feedCount: number;
}

export async function getPopular(): Promise<PopularResponse[]> {
  try {
    const response = await BASE_URL.get("/users/popular");

    const updatedData = response.data.map((data: PopularResponse) => ({
      ...data,
      image: `https://image.grimity.com/${data.image}`,
    }));

    return updatedData;
  } catch (error) {
    console.error("Error fetching Popular:", error);
    throw new Error("Failed to fetch Popular");
  }
}

export function usePopular() {
  return useQuery<PopularResponse[]>("popular", getPopular);
}
