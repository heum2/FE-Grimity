import axiosInstance from "@/constants/baseurl";
import { CreateAlbumRequest } from "@grimity/dto";
import { AlbumBaseResponse } from "@grimity/dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export type { CreateAlbumRequest, AlbumBaseResponse };

export async function createAlbums({ name }: CreateAlbumRequest): Promise<AlbumBaseResponse> {
  try {
    const response = await axiosInstance.post("/albums", { name });

    return response.data as AlbumBaseResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) throw new Error("유효성 검사 실패");
      if (error.response?.status === 401) throw new Error("Unauthorized");
      if (error.response?.status === 409) throw new Error("앨범 이름 중복");

      console.error("Error response:", error.response?.data);
    }
    throw new Error("Failed to create albums");
  }
}

export const useCreateAlbums = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAlbums,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAlbums"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
};
