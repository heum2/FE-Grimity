export interface ProfileCardProps {
  id: string;
  title: string;
  cards: string[];
  thumbnail: string;
  createdAt: string | Date;
  likeCount: number;
  commentCount: number;
  viewCount?: number;
  albumId?: string;
  isEditMode?: boolean;
  isSelected?: boolean;
}
