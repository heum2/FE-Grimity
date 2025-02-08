export interface BoardCardProps {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
  commentCount: number;
  viewCount: number;
  createdAt: string;
}
