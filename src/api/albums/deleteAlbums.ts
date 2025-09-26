import axiosInstance from "@/constants/baseurl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface DeleteAlbumsParams {
  id: string;
}

export async function deleteAlbums({ id }: DeleteAlbumsParams): Promise<void> {
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

export const useDeleteAlbums = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAlbums,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAlbums"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
};
