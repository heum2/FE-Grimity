import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";

import { UpdateAlbumRequest } from "@grimity/dto";
export type { UpdateAlbumRequest };

interface PatchAlbumsParams {
  id: string;
  params: UpdateAlbumRequest;
}

export async function patchAlbums({ id, params }: PatchAlbumsParams): Promise<unknown> {
  const response = await axiosInstance.patch(`/albums/${id}`, params);
  return response.data;
}

export const usePatchAlbums = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchAlbums,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAlbums"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
};
