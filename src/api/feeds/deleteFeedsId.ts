import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";
import { DeleteFeedsRequest } from "@grimity/dto";

// 피드 하나 삭제
export async function deleteFeeds(id: string): Promise<Response> {
  const response = await axiosInstance.delete(`/feeds/${id}`);
  return response.data;
}

// 피드 여러개 삭제
export async function deleteBatchFeeds(params: DeleteFeedsRequest): Promise<Response> {
  try {
    const response = await axiosInstance.delete("/feeds/batch-delete", {
      params,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) throw new Error("유효성 검사 실패");
    if (error.response?.status === 401) throw new Error("Unauthorized");
    console.error("Error response:", error.response?.data);
    throw new Error("Failed to create albums");
  }
}

export function useDeleteFeeds(id: string) {
  return useQuery<Response>(["deleteFeeds", id], () => deleteFeeds(id), {});
}

//TODO: 피드 여러개 삭제 usehook 구현 필요
