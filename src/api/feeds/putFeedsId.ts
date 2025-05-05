import axiosInstance from "@/constants/baseurl";
import type { CreateFeedRequest } from "@grimity/dto";
export type { CreateFeedRequest };

export async function putEditFeeds(id: string, data: CreateFeedRequest): Promise<Response> {
  const requestData = {
    ...data,
    ...(data.albumId ? { albumId: data.albumId } : {}),
  };

  try {
    const response = await axiosInstance.put(`/feeds/${id}`, requestData);
    return response.data;
  } catch (error) {
    console.error("Error updating feed:", error);
    throw error;
  }
}
