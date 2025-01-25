export interface ProfileCardProps {
  id: string;
  title: string;
  cards: string[];
  author?: {
    id: string;
    name: string;
  };
  createdAt: string;
  likeCount: number;
  commentCount: number;
}
