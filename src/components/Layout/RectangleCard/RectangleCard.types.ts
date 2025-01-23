export interface RectangleCardProps {
  id: string;
  title: string;
  content: string;
  cards: string[];
  author?: {
    id: string;
    name: string;
    image: string;
  };
  likeCount: number;
  commentCount: number;
  createdAt: string;
  isSave?: boolean;
}
