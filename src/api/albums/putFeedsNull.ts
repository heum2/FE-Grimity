import axiosInstance from "@/constants/baseurl";
import { UpdateAlbumOrderRequest } from "@grimity/dto";
export type { UpdateAlbumOrderRequest };

export async function putFeedsNull(params: UpdateAlbumOrderRequest): Promise<void> {
  const response = await axiosInstance.put("/albums/null", params);
  return response.data;
}
