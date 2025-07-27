import axiosInstance from "@/constants/baseurl";
import axios from "axios";

export async function deleteAlbums(id: string): Promise<void> {
  try {
    const response = await axiosInstance.delete(`/albums/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) throw new Error("유효성 검사 실패");
      if (error.response?.status === 401) throw new Error("Unauthorized");
      console.error("Error response:", error.response?.data);
    }
    throw new Error("Failed to delete album");
  }
}
