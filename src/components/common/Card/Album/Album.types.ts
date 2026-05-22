export type AlbumVariant = "mainTitle" | "check" | "rank";
export type AlbumRank = 1 | 2 | 3 | 4;

export interface AlbumProps {
  variant?: AlbumVariant;
  checked?: boolean;
  rank?: AlbumRank;
  imageUrl?: string;
  title: string;
  nickname: string;
  likeCount: number;
  viewCount: number;
  isLiked?: boolean;
  /** 이미지와 타이틀에만 링크를 거는 옵션. 설정 시 onClick은 무시됨 */
  linkHref?: string;
  onClick?: () => void;
  onCheckClick?: () => void;
  onLikeClick?: () => void;
  className?: string;
}
