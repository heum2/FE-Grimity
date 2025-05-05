import axiosInstance from "@/constants/baseurl";

export async function deleteAlbums(id: string): Promise<void> {
  try {
    const response = await axiosInstance.delete(`/albums/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) throw new Error("유효성 검사 실패");
    if (error.response?.status === 401) throw new Error("Unauthorized");
    console.error("Error response:", error.response?.data);
    throw new Error("Failed to delete album");
  }
}
