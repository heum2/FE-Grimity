export interface ProfileCardProps {
  id: string;
  title: string;
  cards: string[];
  thumbnail: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  viewCount?: number;
}
