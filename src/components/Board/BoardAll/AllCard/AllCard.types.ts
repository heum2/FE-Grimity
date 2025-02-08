export interface AllCardProps {
  post: {
    id: string;
    type: "normal" | "question" | "feedback";
    title: string;
    content: string;
    hasImage?: boolean;
    commentCount: number;
    viewCount: number;
    createdAt: string;
    author: { name: string; id: string };
  };
}
