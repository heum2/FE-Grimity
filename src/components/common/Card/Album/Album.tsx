import { useState, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

import Icon from "@/components/common/Icon/Icon";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import UserInfo from "@/components/common/Cell/UserInfo/UserInfo";
import {
  useKeyDownActivate,
  useKeyDownActivateStopPropagation,
  useToggleWithCallback,
} from "@/hooks/useCardInteraction";

import { THUMBNAIL_PATH } from "@/constants/imageUrl";

import styles from "./Album.module.scss";
import type { AlbumProps, AlbumRank } from "./Album.types";
import AlbumAuthorNickname from "./AlbumAuthorNickname";

const RANK_ICON_MAP: Record<AlbumRank, "rank-1" | "rank-2" | "rank-3" | "rank-4"> = {
  1: "rank-1",
  2: "rank-2",
  3: "rank-3",
  4: "rank-4",
};

const blockBubble = (handler: () => void) => (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  handler();
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
  linkHref,
  onClick,
  onCheckClick,
  onLikeClick,
  className,
}: AlbumProps) {
  const useFeedLink = !!feedHref;
  const useSimpleLink = !!linkHref;
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
  const isMainOrRank = variant === "mainTitle" || variant === "rank";
  const isRank = variant === "rank" && rank != null && rank in RANK_ICON_MAP;
  const canCheck = isCheck && Boolean(onCheckClick);
  const canLike = isMainOrRank && Boolean(onLikeClick);
  const articleOnClick = useFeedLink || useSimpleLink ? undefined : onClick;

  const keyDownOnArticle = useKeyDownActivate(articleOnClick);
  const keyDownOnCheckWrap = useKeyDownActivateStopPropagation(
    canCheck ? handleCheckClick : undefined,
  );
  const keyDownOnLike = useKeyDownActivateStopPropagation(
    canLike ? handleLikeClick : undefined,
  );

  const imageNode = (
    <div
      className={clsx(
        styles.imageWrap,
        isMainOrRank && styles.mainTitleRankOverlay,
        isCheck && !checked && styles.checkDefault,
        isCheck && checked && styles.checked,
        canCheck && styles.imageWrapClickable,
      )}
      role={canCheck ? "button" : undefined}
      tabIndex={canCheck ? 0 : undefined}
      onClick={canCheck ? blockBubble(handleCheckClick) : undefined}
      onKeyDown={keyDownOnCheckWrap}
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
          onClick={blockBubble(handleCheckClick)}
        >
          <Icon
            name={checked ? "check-square-fill" : "check-square"}
            size={24}
            color={checked ? "primary-normal" : "gray-subtler"}
          />
        </button>
      )}

      {isMainOrRank && (
        <button
          type="button"
          className={clsx(
            styles.iconBottomRight,
            canLike && styles.iconBottomRightClickable,
            isLiked && styles.iconBottomRightActive,
          )}
          disabled={!canLike}
          aria-pressed={canLike ? isLiked : undefined}
          aria-label={canLike ? (isLiked ? "좋아요 취소" : "좋아요") : undefined}
          onClick={canLike ? blockBubble(handleLikeClick) : undefined}
          onKeyDown={keyDownOnLike}
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
              color={isLiked ? "primary-normal" : "gray-subtle"}
            />
          </span>
        </button>
      )}
    </div>
  );

  const titleNode = <p className={styles.title}>{title}</p>;

  const withLink = (node: ReactNode) =>
    linkHref ? (
      <Link href={linkHref} className={styles.linkPart}>
        {node}
      </Link>
    ) : (
      node
    );

  const nicknameNode =
    profileHref || authorUrl ? (
      <AlbumAuthorNickname
        nickname={nickname}
        profileHref={profileHref}
        authorUrl={authorUrl}
      />
    ) : (
      nickname
    );

  return (
    <article
      className={clsx(styles.album, className)}
      role={articleOnClick ? "button" : undefined}
      tabIndex={articleOnClick ? 0 : undefined}
      onClick={articleOnClick}
      onKeyDown={keyDownOnArticle}
    >
      {useFeedLink ? (
        <Link href={feedHref} className={styles.feedLink}>
          {imageNode}
        </Link>
      ) : (
        withLink(imageNode)
      )}

      <div className={styles.body}>
        {useFeedLink ? (
          <Link href={feedHref} className={styles.titleLink}>
            {titleNode}
          </Link>
        ) : (
          withLink(titleNode)
        )}
        <UserInfo
          type="default"
          nickname={nicknameNode}
          showHeart
          heartCount={likeCount.toString()}
          showView
          viewCount={viewCount.toString()}
        />
      </div>
    </article>
  );
}
