export interface SearchCardProps {
  id: string;
  title: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLike?: boolean;
  author: {
    id: string;
    name: string;
    url: string;
  };
}
