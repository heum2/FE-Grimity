import BASE_URL from "@/constants/baseurl";

export interface PostsLatestRequest {
  size: number;
  page: number;
  type: "all" | "question" | "feedback";
}

export interface PostsLatest {
  id: string;
  type: "normal" | "question" | "feedback";
  title: string;
  content: string;
  hasImage?: boolean;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

export interface PostsLatestResponse {
  posts: PostsLatest[];
  totalCount: number | null;
}

export async function getPostsLatest({
  size = 10,
  page = 1,
  type = "all",
}: PostsLatestRequest): Promise<PostsLatestResponse> {
  try {
    const response = await BASE_URL.get("/posts", {
      params: { size, page, type },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching postsLatest:", error);
    throw new Error("Failed to fetch postsLatest");
  }
}
