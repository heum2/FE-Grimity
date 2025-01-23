export interface SquareCardProps {
  id: string;
  title: string;
  cards: string[];
  author?: {
    id: string;
    name: string;
  };
  likeCount: number;
  commentCount: number;
  isSave?: boolean;
}
