import axiosInstance from "@/constants/baseurl";
import { UpdateAlbumRequest } from "@grimity/dto";
export type { UpdateAlbumRequest };

export async function patchAlbums(id: string, params: UpdateAlbumRequest): Promise<void> {
  try {
    const response = await axiosInstance.patch(`/albums/${id}`, params);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) throw new Error("유효성 검사 실패");
    if (error.response?.status === 401) throw new Error("Unauthorized");
    if (error.response?.status === 409) throw new Error("앨범 이름 중복");
    console.error("Error response:", error.response?.data);
    throw new Error("Failed to patch albums");
  }
}
