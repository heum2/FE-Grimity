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
  feedHref?: string;
  profileHref?: string;
  authorUrl?: string;
  onClick?: () => void;
  onCheckClick?: () => void;
  onLikeClick?: () => void;
  className?: string;
}
