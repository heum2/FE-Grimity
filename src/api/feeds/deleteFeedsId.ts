import axiosInstance from "@/constants/baseurl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteFeedsRequest } from "@grimity/dto";
import axios from "axios";

// 피드 하나 삭제
export async function deleteFeeds(id: string): Promise<Response> {
  const response = await axiosInstance.delete(`/feeds/${id}`);
  return response.data;
}

// 피드 여러개 삭제
export async function deleteBatchFeeds(params: DeleteFeedsRequest): Promise<Response> {
  try {
    const response = await axiosInstance.post("/feeds/batch-delete", {
      ids: params.ids,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) throw new Error("유효성 검사 실패");
      if (error.response?.status === 401) throw new Error("Unauthorized");
      console.error("Error response:", error.response?.data);
    }
    throw new Error("Failed to delete feeds");
  }
}

export function useDeleteFeeds(id: string) {
  return useQuery<Response>({
    queryKey: ["deleteFeeds", id],
    queryFn: () => deleteFeeds(id),
  });
}

export function useDeleteBatchFeeds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeleteFeedsRequest) => deleteBatchFeeds(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
    onError: (error: Error) => {
      console.error("Failed to delete feeds:", error);
    },
  });
}
