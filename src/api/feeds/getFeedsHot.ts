import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface HotFeedResponse {
  id: string;
  title: string;
  cards: string[];
  createdAt: string;
  viewCount: number;
  likeCount: number;
  author: {
    id: string;
    name: string;
    image: string;
  };
}

export async function getHotFeed(): Promise<HotFeedResponse[]> {
  try {
    const response = await BASE_URL.get("/feeds/hot");

    const updatedData = response.data.map((data: HotFeedResponse) => ({
      ...data,
      cards: data.cards.map((card) => `https://image.grimity.com/${card}`),
      author: {
        ...data.author,
        image: `https://image.grimity.com/${data.author.image}`,
      },
    }));

    return updatedData;
  } catch (error) {
    console.error("Error fetching HotFeed:", error);
    throw new Error("Failed to fetch HotFeed");
  }
}

export function useHotFeed() {
  return useQuery<HotFeedResponse[]>("hotFeed", getHotFeed);
}
