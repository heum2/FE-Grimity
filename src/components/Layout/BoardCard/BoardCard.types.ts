export interface BoardCardProps {
  id: string;
  title: string;
  cards: string[];
  author?: {
    id: string;
    name: string;
    image: string;
  };
  likeCount: number;
  commentCount: number;
  createdAt: string;
}
