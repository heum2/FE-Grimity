import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface DetailsResponse {
  id: string;
  title: string;
  cards: string[];
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
}

export async function getDetails(id: string): Promise<DetailsResponse> {
  try {
    const response = await BASE_URL.get(`/feeds/${id}`, {
      params: { id },
    });

    const data = response.data;

    const updatedData = {
      ...data,
      cards: data.cards.map((card: string) => `https://image.grimity.com/${card}`),
      author: {
        ...data.author,
        image: `https://image.grimity.com/${data.author.image}`,
      },
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching details:", error);
    throw new Error("Failed to fetch details");
  }
}

export function useDetails(id: string) {
  return useQuery<DetailsResponse>(["details", id], () => getDetails(id), {});
}
