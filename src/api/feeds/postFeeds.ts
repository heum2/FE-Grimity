import axiosInstance from "@/constants/baseurl";
import type { CreateFeedRequest, IdResponse } from "@grimity/dto";
export type { CreateFeedRequest, IdResponse };

export async function postFeeds(data: CreateFeedRequest): Promise<IdResponse> {
  const requestData = {
    ...data,
    ...(data.albumId ? { albumId: data.albumId } : {}),
  };

  try {
    const response = await axiosInstance.post<IdResponse>("/feeds", requestData);
    return response.data;
  } catch (error) {
    console.error("Error posting feed:", error);
    throw error;
  }
}
