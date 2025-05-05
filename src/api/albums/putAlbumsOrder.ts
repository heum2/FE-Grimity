import axiosInstance from "@/constants/baseurl";
import { UpdateAlbumOrderRequest } from "@grimity/dto";
export type { UpdateAlbumOrderRequest };

export async function putAlbumsOrder(params: UpdateAlbumOrderRequest): Promise<void> {
  try {
    const response = await axiosInstance.put(`/albums/order`, params);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) throw new Error("유효성 검사 실패");
    if (error.response?.status === 401) throw new Error("Unauthorized");
    console.error("Error response:", error.response?.data);
    throw new Error("Failed to put albums");
  }
}
