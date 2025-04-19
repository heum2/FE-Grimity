export interface AllCardProps {
  post: {
    id: string;
    type: "NORMAL" | "QUESTION" | "FEEDBACK" | "NOTICE";
    title: string;
    content: string;
    thumbnail: string | null;
    commentCount: number;
    viewCount: number;
    createdAt: string | Date;
    author?: { name: string | null; id: string | null; url: string };
  };
  case: "saved-posts" | "my-posts" | "board";
  hasChip?: boolean;
}
