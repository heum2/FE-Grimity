export interface SquareCardProps {
  id: string;
  title: string;
  thumbnail: string;
  cards?: string[];
  author?: {
    id: string;
    name: string;
  };
  likeCount: number;
  commentCount?: number;
  isLike?: boolean;
  createdAt?: string;
  isSame?: boolean;
}
