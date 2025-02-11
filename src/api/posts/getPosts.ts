import BASE_URL from "@/constants/baseurl";

export interface PostsLatestRequest {
  size: number;
  page: number;
  type: "ALL" | "QUESTION" | "FEEDBACK";
}

export interface PostsLatest {
  id: string;
  type: "NORMAL" | "QUESTION" | "FEEDBACK";
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
  totalCount: number;
}

export async function getPostsLatest({
  size = 10,
  page = 1,
  type = "ALL",
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

export async function getPostsNotices(): Promise<PostsLatest[]> {
  try {
    const response = await BASE_URL.get("/posts/notices");
    return response.data;
  } catch (error) {
    console.error("Error fetching postsNotices:", error);
    throw new Error("Failed to fetch postsNotices");
  }
}
