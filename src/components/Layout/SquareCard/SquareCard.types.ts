export interface SquareCardProps {
  id: string;
  title: string;
  cards: string[];
  thumbnail: string;
  author?: {
    id: string;
    name: string;
  };
  likeCount: number;
  commentCount: number;
  isLike?: boolean;
}
