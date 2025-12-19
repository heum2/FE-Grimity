import styles from "./Detail.module.scss";
import { DetailProps } from "./Detail.types";
import { useDetails } from "@/api/feeds/getFeedsId";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import Dropdown from "../Dropdown/Dropdown";
import { useAuthStore } from "@/states/authStore";
import { useToast } from "@/hooks/useToast";
import IconComponent from "../Asset/Icon";
import { deleteLike, putLike } from "@/api/feeds/putDeleteFeedsLike";
import Button from "../Button/Button";
import Link from "next/link";
import { putView } from "@/api/feeds/putIdView";
import { deleteFeeds } from "@/api/feeds/deleteFeedsId";
import { useRouter } from "next/router";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Loader from "../Layout/Loader/Loader";
import Author from "./Author/Author";
import { useProfileCardHover } from "@/hooks/useProfileCardHover";
import ProfileCardPopover from "@/components/Layout/ProfileCardPopover/ProfileCardPopover";
import ShareBtn from "./ShareBtn/ShareBtn";
import { timeAgo } from "@/utils/timeAgo";
import Chip from "../Chip/Chip";
import { useModalStore } from "@/states/modalStore";
import { deleteSave, putSave } from "@/api/feeds/putDeleteFeedsIdSave";
import Comment from "./Comment/Comment";
import NewFeed from "../Layout/NewFeed/NewFeed";
import { useDeviceStore } from "@/states/deviceStore";
import { usePreventRightClick } from "@/hooks/usePreventRightClick";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";
import useUserBlock from "@/hooks/useUserBlock";
import { DetailLayout } from "@/components/Layout/DetailLayout";
import { CONFIG } from "@/config";
import ActionBar from "@/components/ActionBar/ActionBar";
import { ActionBarConfig } from "@/components/ActionBar/ActionBar.types";

export default function Detail({ id }: DetailProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user_id = useAuthStore((state) => state.user_id);
  const { data: details, isLoading, refetch } = useDetails(id);
  const [isExpanded, setIsExpanded] = useState(false);
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(0);
  const [viewCounted, setViewCounted] = useState(false);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const imgRef = usePreventRightClick<HTMLImageElement>();
  const divRef = usePreventRightClick<HTMLDivElement>();
  const sectionRef = usePreventRightClick<HTMLElement>();
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);
  const { isMobile } = useDeviceStore();
  usePreventScroll(!!overlayImage);
  const { triggerProps, popoverProps, isOpen, targetRef } = useProfileCardHover(
    details?.author.url,
  );

  useUserBlock({
    identifier: id,
    isBlocked: details?.author.isBlocked,
  });

  const { pathname } = useRouter();

  const handleShowMore = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      openModal({
        type: null,
        data: {
          title: "그림을 정말 삭제하시겠어요?",
          confirmBtn: "삭제하기",
          onClick: async () => {
            try {
              await deleteFeeds(id);
              router.push("/");
            } catch (err) {
              showToast("삭제 중 오류가 발생했습니다.", "error");
            }
          },
        },
        isComfirm: true,
      });
    } catch (error) {
      showToast("삭제 중 오류가 발생했습니다.", "error");
    }
  };

  const handleOpenEditPage = () => {
    router.push(`/feeds/${id}/edit`);
  };

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      showToast("로그인 후 좋아요를 누를 수 있어요.", "error");
      return;
    }

    if (details?.author.id === user_id) {
      // if (isMobile) {
      //   openModal({
      //     type: "LIKE",
      //     isFill: true,
      //   });
      // } else {
      //   openModal({
      //     type: "LIKE",
      //   });
      // }
    } else {
      if (isLiked) {
        await deleteLike(id);
        setCurrentLikeCount((prev) => prev - 1);
      } else {
        await putLike(id);
        setCurrentLikeCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    }
  };

  const handleSaveClick = async () => {
    if (!isLoggedIn) {
      showToast("로그인 후 저장할 수 있어요.", "error");
      return;
    }

    if (isSaved) {
      await deleteSave(id);
    } else {
      await putSave(id);
    }
    setIsSaved(!isSaved);
  };

  const handleImageClick = (image: string) => {
    setOverlayImage(image);
  };

  const handleOpenShareModal = () => {
    if (details) {
      openModal({
        type: "SHARE",
        data: { feedId: id, title: details.title, image: details.thumbnail },
      });
    }
  };

  const handleOpenReportModal = () => {
    if (isMobile) {
      openModal({
        type: "REPORT",
        data: { refType: "FEED", refId: details?.author.id },
        isFill: true,
      });
    } else {
      openModal({
        type: "REPORT",
        data: { refType: "FEED", refId: details?.author.id },
      });
    }
  };

  const actionBarConfig: ActionBarConfig = useMemo(
    () => ({
      like: {
        isLiked,
        count: currentLikeCount,
        iconNameOn: "detailLikeOn",
        iconNameOff: "detailLikeOff",
        onToggle: handleLikeClick,
        allowSelfLike: false,
      },
      save: {
        isSaved,
        iconNameOn: "detailSaveOn",
        iconNameOff: "detailSaveOff",
        onToggle: handleSaveClick,
      },
      dropdown: {
        menuItems:
          user_id === details?.author.id || !isLoggedIn
            ? [{ label: "공유하기", onClick: handleOpenShareModal }]
            : [
                { label: "공유하기", onClick: handleOpenShareModal },
                { label: "신고하기", onClick: handleOpenReportModal, isDelete: true },
              ],
        isMobile: true,
      },
    }),
    [
      isLiked,
      currentLikeCount,
      isSaved,
      user_id,
      details?.author.id,
      isLoggedIn,
      handleLikeClick,
      handleSaveClick,
      handleOpenShareModal,
      handleOpenReportModal,
    ],
  );

  useEffect(() => {
    refetch();
  }, [pathname]);

  useAuthRefresh();

  useEffect(() => {
    if (!details) return;
    setIsLiked(details.isLike ?? false);
    setIsSaved(details.isSave ?? false);
    setCurrentLikeCount(details.likeCount ?? 0);
  }, [details]);

  // 새로고침 조회수 증가
  useEffect(() => {
    const incrementViewCount = async () => {
      if (!id || viewCounted) return;

      try {
        await putView(id);
        setViewCounted(true);
      } catch (error) {
        console.error("조회수 증가 에러", error);
      }
    };

    incrementViewCount();
  }, [id, viewCounted]);

  useEffect(() => {
    if (overlayImage) {
      history.pushState(null, "", location.href);
      const handlePopstate = () => {
        setOverlayImage(null);
      };
      window.addEventListener("popstate", handlePopstate);
      return () => {
        window.removeEventListener("popstate", handlePopstate);
      };
    }
  }, [overlayImage]);

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const formattedContent = (details?.content ?? "").replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <DetailLayout>
      <DetailLayout.Content>
        {details && (
          <>
            <section className={styles.header}>
              <div className={styles.profileLeft}>
                <Link href={`/${details.author.url}`}>
                  {details.author.image !== null ? (
                    <Image
                      src={details.author.image}
                      alt={details.author.name}
                      className={styles.authorImage}
                      width={40}
                      height={40}
                      quality={50}
                      style={{ objectFit: "cover" }}
                      unoptimized
                      ref={imgRef}
                    />
                  ) : (
                    <Image
                      src="/image/default.svg"
                      width={40}
                      height={40}
                      alt="프로필 이미지"
                      className={styles.authorImage}
                      quality={50}
                      style={{ objectFit: "cover" }}
                      unoptimized
                      ref={imgRef}
                    />
                  )}
                </Link>
                <div className={styles.authorInfo}>
                  <span ref={targetRef as React.RefObject<HTMLSpanElement>} {...triggerProps}>
                    <Link href={`/${details.author.url}`}>
                      <p className={styles.authorName}>{details.author.name}</p>
                    </Link>
                  </span>
                  <div className={styles.stats}>
                    <p className={styles.createdAt}>{timeAgo(details.createdAt)}</p>
                    <div className={styles.stat}>
                      <IconComponent name="detailLikeCount" size={16} />
                      {currentLikeCount}
                    </div>
                    <div className={styles.stat}>
                      <IconComponent name="detailViewCount" size={16} />
                      {details.viewCount}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.dropdownContainer}>
                {isLoggedIn &&
                  (user_id === details.author.id ? (
                    <div className={styles.dropdown}>
                      <Dropdown
                        trigger={<IconComponent name="meatball" padding={8} size={24} isBtn />}
                        menuItems={[
                          {
                            label: "수정하기",
                            onClick: handleOpenEditPage,
                          },
                          {
                            label: "삭제하기",
                            onClick: handleDelete,
                            isDelete: true,
                          },
                        ]}
                      />
                    </div>
                  ) : (
                    <div className={styles.dropdown}>
                      <Dropdown
                        trigger={<IconComponent name="meatball" padding={8} size={24} isBtn />}
                        menuItems={[
                          {
                            label: "신고하기",
                            onClick: handleOpenReportModal,
                            isDelete: true,
                          },
                        ]}
                      />
                    </div>
                  ))}
                <ShareBtn feedId={id} title={details.title} image={details.cards[0]} />
              </div>
            </section>
            <section className={styles.imageGallery} ref={sectionRef}>
              {details.cards.slice(0, 2).map((card, index) => (
                <div key={index} className={styles.imageWrapper} ref={divRef}>
                  <ResponsiveImage
                    src={card}
                    alt={`Card image ${index + 1}`}
                    width={880}
                    height={0}
                    loading={index ? "lazy" : "eager"}
                    className={styles.cardImage}
                    onClick={() => handleImageClick(card)}
                    ref={imgRef}
                    mobileSize={1200}
                    onContextMenu={(e: React.MouseEvent<HTMLImageElement>) => e.preventDefault()}
                  />
                  {index === 1 && details.cards.length > 2 && !isExpanded && (
                    <>
                      <div className={styles.gradient} />
                      <div onClick={handleShowMore} className={styles.showMore}>
                        <Button size="l" type="filled-primary">
                          전체 보기
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </section>
            <section ref={sectionRef}>
              {isExpanded &&
                details.cards.slice(2).map((card, index) => (
                  <div key={index + 2} className={styles.imageWrapper2} ref={divRef}>
                    <ResponsiveImage
                      src={card}
                      alt={`Card image ${index + 3}`}
                      width={600}
                      height={0}
                      loading="lazy"
                      className={styles.cardImage}
                      onClick={() => handleImageClick(card)}
                      ref={imgRef}
                      onContextMenu={(e: React.MouseEvent<HTMLImageElement>) => e.preventDefault()}
                    />
                  </div>
                ))}
            </section>
            {overlayImage && (
              <div className={styles.overlay} onClick={() => setOverlayImage(null)}>
                <div className={styles.overlayContent} ref={divRef}>
                  <Zoom>
                    <img
                      src={overlayImage}
                      alt="Zoomed Image"
                      style={{
                        height: "90vh",
                        objectFit: "cover",
                      }}
                      loading="lazy"
                      onClick={(event) => event.stopPropagation()}
                      ref={imgRef}
                    />
                  </Zoom>
                </div>
              </div>
            )}

            <section className={styles.contentContainer}>
              <div className={styles.contentWrapper}>
                <h2 className={styles.title}>{details.title}</h2>
                <p
                  className={styles.content}
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                />
                <div className={styles.stats}>
                  <p className={styles.createdAt}>{timeAgo(details.createdAt)}</p>
                  <IconComponent name="dot" size={3} />
                  <div className={styles.stat}>
                    <IconComponent name="commentCount" size={16} />
                    {details.commentCount}
                  </div>
                  <div className={styles.stat}>
                    <IconComponent name="viewCount" size={16} />
                    {details.viewCount}
                  </div>
                </div>
              </div>

              {details.tags.length > 0 && (
                <div className={styles.tags}>
                  {details.tags.map((tag, index) => (
                    <Link href={`/search?tab=feed&keyword=${tag}`} key={index}>
                      <Chip size="m" type="filled-assistive">
                        {tag}
                      </Chip>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {!details?.author.isBlocked && (
              <>
                <ActionBar
                  config={actionBarConfig}
                  isAuthor={user_id === details.author.id}
                  className={styles.boardActionBar}
                />

                <DetailLayout.HorizontalAd
                  adSlot={CONFIG.MARKETING.AD_SLOTS.FEED_DETAIL_HORIZONTAL}
                />

                <Comment feedId={id} feedWriterId={details.author.id} />
              </>
            )}

            <div className={styles.bar} />
            <div className={styles.cards}>
              <Author authorId={details.author.id} feedId={id} authorUrl={details.author.url} />
              <NewFeed isDetail />
            </div>
          </>
        )}
        {isOpen && details?.author.url && (
          <ProfileCardPopover {...popoverProps} authorUrl={details.author.url} />
        )}
      </DetailLayout.Content>

      <DetailLayout.Sidebar>
        <DetailLayout.VerticalAd adSlot={CONFIG.MARKETING.AD_SLOTS.FEED_DETAIL_VERTICAL} />
      </DetailLayout.Sidebar>
    </DetailLayout>
  );
}
