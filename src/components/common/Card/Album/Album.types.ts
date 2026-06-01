import type { ReactNode } from "react";

export type AlbumVariant = "mainTitle" | "check" | "rank";
export type AlbumRank = 1 | 2 | 3 | 4;

export interface AlbumProps {
  variant?: AlbumVariant;
  checked?: boolean;
  rank?: AlbumRank;
  imageUrl?: string;
  title: ReactNode;
  nickname: string;
  likeCount: number;
  viewCount: number;
  isLiked?: boolean;
  /** 피드 상세 링크 (이미지·타이틀). profileHref/authorUrl과 함께 사용 */
  feedHref?: string;
  profileHref?: string;
  authorUrl?: string;
  /** 이미지와 타이틀에만 링크. feedHref와 함께 사용하지 않음 */
  linkHref?: string;
  onClick?: () => void;
  onCheckClick?: () => void;
  onLikeClick?: () => void;
  className?: string;
}
