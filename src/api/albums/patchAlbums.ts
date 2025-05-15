import axiosInstance from "@/constants/baseurl";
import { UpdateAlbumRequest } from "@grimity/dto";
export type { UpdateAlbumRequest };

export async function patchAlbums(id: string, params: UpdateAlbumRequest): Promise<void> {
  const response = await axiosInstance.patch(`/albums/${id}`, params);
  return response.data;
}
