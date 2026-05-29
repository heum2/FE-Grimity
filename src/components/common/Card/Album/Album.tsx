import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import {
  useKeyDownActivate,
  useKeyDownActivateStopPropagation,
  useToggleWithCallback,
} from "@/hooks/useCardInteraction";
import styles from "./Album.module.scss";
import type { AlbumProps, AlbumRank } from "./Album.types";
import { THUMBNAIL_PATH } from "@/constants/imageUrl";
import UserInfo from "@/components/common/Cell/UserInfo/UserInfo";
import AlbumAuthorNickname from "./AlbumAuthorNickname";

const RANK_ICON_MAP: Record<AlbumRank, "rank-1" | "rank-2" | "rank-3" | "rank-4"> = {
  1: "rank-1",
  2: "rank-2",
  3: "rank-3",
  4: "rank-4",
};

export default function Album({
  variant = "mainTitle",
  checked: checkedProp,
  rank,
  imageUrl,
  title,
  nickname,
  likeCount,
  viewCount,
  isLiked: isLikedProp,
  feedHref,
  profileHref,
  authorUrl,
  onClick,
  onCheckClick,
  onLikeClick,
  className,
}: AlbumProps) {
  const useFeedLink = !!feedHref;
  const isControlledChecked = checkedProp !== undefined;
  const [internalChecked, setInternalChecked] = useState(false);
  const checked = isControlledChecked ? checkedProp : internalChecked;

  const isControlledLiked = isLikedProp !== undefined;
  const [internalLiked, setInternalLiked] = useState(false);
  const isLiked = isControlledLiked ? isLikedProp : internalLiked;

  const handleCheckClick = useToggleWithCallback(
    isControlledChecked,
    setInternalChecked,
    onCheckClick,
  );
  const handleLikeClick = useToggleWithCallback(isControlledLiked, setInternalLiked, onLikeClick);

  const isCheck = variant === "check";
  const keyDownOnArticle = useKeyDownActivate(onClick);
  const keyDownOnCheckWrap = useKeyDownActivateStopPropagation(
    isCheck && onCheckClick ? handleCheckClick : undefined,
  );
  const isRank = variant === "rank" && rank != null && rank in RANK_ICON_MAP;
  const isMainOrRank = variant === "mainTitle" || variant === "rank";

  const imageWrapNode = (
    <div
      className={clsx(
        styles.imageWrap,
        isMainOrRank && styles.mainTitleRankOverlay,
        isCheck && !checked && styles.checkDefault,
        isCheck && checked && styles.checked,
        isCheck && onCheckClick && styles.imageWrapClickable,
      )}
      role={isCheck && onCheckClick ? "button" : undefined}
      tabIndex={isCheck && onCheckClick ? 0 : undefined}
      onClick={
        isCheck && onCheckClick
          ? (e) => {
              e.stopPropagation();
              handleCheckClick();
            }
          : undefined
      }
      onKeyDown={isCheck && onCheckClick ? keyDownOnCheckWrap : undefined}
    >
        <ResponsiveImage
          src={imageUrl ?? THUMBNAIL_PATH}
          alt=""
          className={styles.image}
          mobileSize={400}
          desktopSize={800}
        />

        {isRank && (
          <span className={styles.iconTopLeft} aria-hidden>
            <Icon name={RANK_ICON_MAP[rank!]} size={24} />
          </span>
        )}

        {isCheck && (
          <button
            type="button"
            className={styles.iconTopRight}
            aria-pressed={checked}
            aria-label={checked ? "선택 해제" : "선택"}
            onClick={(e) => {
              e.stopPropagation();
              handleCheckClick();
            }}
          >
            <Icon
              name={checked ? "check-square-fill" : "check-square"}
              size={24}
              color={checked ? "primary-normal" : "gray-subtler"}
            />
          </button>
        )}

        {isMainOrRank && (
          <span
            className={clsx(
              styles.iconBottomRight,
              onLikeClick && styles.iconBottomRightClickable,
              isLiked && styles.iconBottomRightActive,
            )}
            role={onLikeClick ? "button" : undefined}
            tabIndex={onLikeClick ? 0 : undefined}
            aria-pressed={onLikeClick ? isLiked : undefined}
            aria-label={onLikeClick ? (isLiked ? "좋아요 취소" : "좋아요") : undefined}
            onClick={
              onLikeClick
                ? (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLikeClick();
                  }
                : undefined
            }
            onKeyDown={
              onLikeClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLikeClick();
                    }
                  }
                : undefined
            }
          >
            <span className={styles.heartStack}>
              {!isLiked && (
                <Icon
                  name="heart-fill"
                  size={24}
                  color="white"
                  className={styles.heartStackBg}
                />
              )}
              <Icon
                name={isLiked ? "heart-fill" : "heart"}
                size={24}
                className={styles.heartStackFg}
              />
            </span>
          </span>
        )}
    </div>
  );

  const titleNode = <p className={styles.title}>{title}</p>;

  return (
    <article
      className={clsx(styles.album, className)}
      role={!useFeedLink && onClick ? "button" : undefined}
      tabIndex={!useFeedLink && onClick ? 0 : undefined}
      onClick={!useFeedLink ? onClick : undefined}
      onKeyDown={!useFeedLink ? keyDownOnArticle : undefined}
    >
      {useFeedLink ? (
        <Link href={feedHref!} className={styles.feedLink}>
          {imageWrapNode}
        </Link>
      ) : (
        imageWrapNode
      )}

      <div className={styles.body}>
        {useFeedLink ? (
          <Link href={feedHref!} className={styles.titleLink}>
            {titleNode}
          </Link>
        ) : (
          titleNode
        )}
        <UserInfo
          type="default"
          nickname={
            <AlbumAuthorNickname
              nickname={nickname}
              profileHref={profileHref}
              authorUrl={authorUrl}
            />
          }
          showHeart={true}
          heartCount={likeCount.toString()}
          showView={true}
          viewCount={viewCount.toString()}
        />
      </div>
    </article>
  );
}
