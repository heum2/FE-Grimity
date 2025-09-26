import axiosInstance from "@/constants/baseurl";
import { UpdateAlbumOrderRequest } from "@grimity/dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
export type { UpdateAlbumOrderRequest };

export async function putAlbumsOrder(params: UpdateAlbumOrderRequest): Promise<void> {
  try {
    const response = await axiosInstance.put(`/albums/order`, params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) throw new Error("유효성 검사 실패");
      if (error.response?.status === 401) throw new Error("Unauthorized");
      console.error("Error response:", error.response?.data);
    }
    throw new Error("Failed to put albums");
  }
}

export const usePutAlbumsOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putAlbumsOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAlbums"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
};
