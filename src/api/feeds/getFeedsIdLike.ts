import BASE_URL from "@/constants/baseurl";

export interface FeedsLikeRequest {
  id: string;
}

export interface FeedsLikeResponse {
  id: string;
  name: string;
  image: string;
  description: string;
}

export async function getFeedsLike({ id }: FeedsLikeRequest): Promise<FeedsLikeResponse[]> {
  try {
    const response = await BASE_URL.get(`/feeds/${id}/like`);
    const data = response.data;

    const updatedData = data.map((item: FeedsLikeResponse) => ({
      ...item,
      image: `https://image.grimity.com/${item.image}`,
    }));

    return updatedData;
  } catch (error) {
    console.error("Error fetching FeedsLike:", error);
    throw new Error("Failed to fetch FeedsLike");
  }
}
