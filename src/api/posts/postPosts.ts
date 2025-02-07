import BASE_URL from "@/constants/baseurl";

export interface PostsRequest {
  title: string;
  content: string;
  type: "NORMAL" | "QUESTION" | "FEEDBACK" | "NOTICE";
}

export interface PostsResponse {
  id: string;
}

export async function postPosts({ title, content, type }: PostsRequest): Promise<PostsResponse> {
  const response = await BASE_URL.post("/posts", {
    title,
    content,
    type,
  });
  return response.data;
}
