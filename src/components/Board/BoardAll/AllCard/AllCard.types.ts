export interface AllCardProps {
  post: {
    id: string;
    type: "NORMAL" | "QUESTION" | "FEEDBACK" | "NOTICE";
    title: string;
    content: string;
    hasImage?: boolean;
    commentCount: number;
    viewCount: number;
    createdAt: string;
    author?: { name: string; id: string };
  };
  case: "saved-posts" | "my-posts" | "board";
}
