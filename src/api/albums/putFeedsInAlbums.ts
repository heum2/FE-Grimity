import axiosInstance from "@/constants/baseurl";
import { InsertFeedsRequest } from "@grimity/dto";
import axios from "axios";
export type { InsertFeedsRequest };

export async function putFeedsInAlbums(
  id: string | null,
  params: InsertFeedsRequest,
): Promise<void> {
  try {
    const response = await axiosInstance.put(`/albums/${id}`, params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) throw new Error("유효성 검사 실패");
      if (error.response?.status === 401) throw new Error("Unauthorized");
      console.error("Error response:", error.response?.data);
    }
    throw new Error("Failed to put albums in feeds");
  }
}
