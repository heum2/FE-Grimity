export interface RectangleCardProps {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  author?: {
    url: string;
    id: string;
    name: string;
    image: string | null;
  };
  likeCount: number;
  commentCount: number;
  createdAt: string | Date;
  isLike?: boolean;
}
