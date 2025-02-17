import BASE_URL from "@/constants/baseurl";
import axios from "axios";
import { useQuery } from "react-query";

export interface DetailsResponse {
  id: string;
  title: string;
  cards: string[];
  thumbnail: string;
  isAI: boolean;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  content: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    image: string;
    followerCount: number;
    isFollowing: boolean;
  };
  isLike: boolean;
  isSave: boolean;
}

export async function getDetails(id: string): Promise<DetailsResponse> {
  try {
    const response = await BASE_URL.get(`/feeds/${id}`, {
      params: { id },
    });

    const data = response.data;

    const updatedData = {
      ...data,
      thumbnail: `https://image.grimity.com/${data.thumbnail}`,
      cards: data.cards.map((card: string) => `https://image.grimity.com/${card}`),
      author: {
        ...data.author,
        image: `https://image.grimity.com/${data.author.image}`,
      },
    };

    return updatedData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("DELETED_FEED");
      }
    }
    console.error("Error fetching details:", error);
    throw error;
  }
}

export function useDetails(id: string) {
  return useQuery<DetailsResponse>(["details", id], () => getDetails(id), {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
