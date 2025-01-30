import styles from "./Detail.module.scss";
import { DetailProps } from "./Detail.types";
import { formatCurrency } from "@/utils/formatCurrency";
import { useDetails } from "@/api/feeds/getFeedsId";
import Image from "next/image";
import { useState, useEffect } from "react";
import Dropdown from "../Dropdown/Dropdown";
import { authState } from "@/states/authState";
import { useRecoilValue } from "recoil";
import { putFollow } from "@/api/users/putIdFollow";
import { deleteFollow } from "@/api/users/deleteIdFollow";
import { useToast } from "@/utils/useToast";
import IconComponent from "../Asset/Icon";
import { deleteLike } from "@/api/feeds/deleteFeedsIdLike";
import { putLike } from "@/api/feeds/putFeedsIdLike";
import Button from "../Button/Button";
import Link from "next/link";
import { putView } from "@/api/feeds/putIdView";
import { deleteFeeds } from "@/api/feeds/deleteFeedsId";
import { useRouter } from "next/router";
import { usePreventScroll } from "@/utils/usePreventScroll";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Loader from "../Layout/Loader/Loader";
import { formattedDate } from "@/utils/formatDate";
import Author from "./Author/Author";
import BoardPopular from "../Layout/BoardPopular/BoardPopular";
import ShareBtn from "./ShareBtn/ShareBtn";
import { timeAgo } from "@/utils/timeAgo";
import Chip from "../Chip/Chip";

export default function Detail({ id }: DetailProps) {
  const { isLoggedIn, user_id } = useRecoilValue(authState);
  const { data: details, isLoading } = useDetails(id);
  const [isExpanded, setIsExpanded] = useState(false);
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(0);
  const [viewCounted, setViewCounted] = useState(false);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const router = useRouter();

  usePreventScroll(!!overlayImage);

  useEffect(() => {
    if (!details) return;
    setIsLiked(details.isLike ?? false);
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

  if (isLoading) {
    return <Loader />;
  }

  const handleShowMore = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteFeeds(id);
      showToast("삭제가 완료되었습니다.", "success");
      router.push("/");
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

    if (isLiked) {
      await deleteLike(id);
      setCurrentLikeCount((prev) => prev - 1);
    } else {
      await putLike(id);
      setCurrentLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleImageClick = (image: string) => {
    setOverlayImage(image);
  };

  const handleRouteBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        {details && (
          <>
            <section className={styles.header}>
              <div onClick={handleRouteBack}>
                <IconComponent name="backBtn" width={24} height={24} padding={8} isBtn />
              </div>
              <div className={styles.dropdownContainer}>
                {isLoggedIn &&
                  (user_id === details.author.id ? (
                    <div className={styles.dropdown}>
                      <Dropdown
                        trigger={
                          <IconComponent name="meatball" padding={8} width={24} height={24} isBtn />
                        }
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
                        trigger={
                          <IconComponent name="meatball" padding={8} width={24} height={24} isBtn />
                        }
                        menuItems={[
                          {
                            label: "신고하기",
                            onClick: handleShowMore,
                            isDelete: true,
                          },
                        ]}
                      />
                    </div>
                  ))}
                <ShareBtn feedId={id} title={details.title} image={details.cards[0]} />
              </div>
            </section>
            <section className={styles.imageGallery}>
              {details.cards.map((card, index) => (
                <div key={index} className={styles.imageWrapper}>
                  <Image
                    src={card}
                    alt={`Card image ${index + 1}`}
                    width={880}
                    height={0}
                    layout="intrinsic"
                    className={styles.cardImage}
                    onClick={() => handleImageClick(card)}
                  />
                </div>
              ))}
            </section>
            {overlayImage && (
              <div className={styles.overlay} onClick={() => setOverlayImage(null)}>
                <div className={styles.overlayContent}>
                  <Zoom>
                    <img
                      src={overlayImage}
                      alt="Zoomed Image"
                      style={{
                        height: "90vh",
                        objectFit: "cover",
                      }}
                      onClick={(event) => event.stopPropagation()}
                    />
                  </Zoom>
                </div>
              </div>
            )}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <Image
                  src="/icon/like-count.svg"
                  width={16}
                  height={16}
                  alt="좋아요 수"
                  className={styles.statIcon}
                />
                {currentLikeCount}
              </div>
              <div className={styles.stat}>
                <Image
                  src="/icon/bookmark-count.svg"
                  width={16}
                  height={0}
                  layout="intrinsic"
                  alt="저장수"
                  className={styles.statIcon}
                />
                0
              </div>
              <div className={styles.stat}>
                <Image
                  src="/icon/view-count.svg"
                  width={16}
                  height={0}
                  layout="intrinsic"
                  alt="조회수"
                  className={styles.statIcon}
                />
                {details.viewCount}
              </div>
            </div>
            <section className={styles.contentContainer}>
              <h2 className={styles.title}>{details.title}</h2>
              <div className={styles.bar} />
              <p className={styles.content}>{details.content}</p>
              <p className={styles.createdAt}>{timeAgo(details.createdAt)}</p>
              <div className={styles.tags}>
                {details.isAI && <div className={styles.aiBtn}>AI 그림</div>}
                {details.tags.map((tag, index) => (
                  <Chip key={index} size="m" type="filled-assistive">
                    {tag}
                  </Chip>
                ))}
              </div>
            </section>
            <div className={styles.btnContainer}>
              <div className={styles.likeBtn} onClick={handleLikeClick}>
                <Button
                  size="l"
                  type="outlined-assistive"
                  leftIcon={
                    <IconComponent
                      name={isLiked ? "cardLikeOn" : "cardLikeOff"}
                      width={20}
                      height={20}
                      isBtn
                    />
                  }
                >
                  {currentLikeCount}
                </Button>
              </div>
              <div className={styles.saveBtn}>
                <Image src="/icon/card-save-on.svg" width={20} height={20} alt="북마크" />
              </div>
              <div className={styles.saveBtn}>
                <Image src="/icon/meatball.svg" width={20} height={20} alt="메뉴 버튼 " />
              </div>
            </div>
            <div className={styles.bar} />
            <Author authorId={details.author.id} />
          </>
        )}
      </div>
      <section className={styles.boardSection}>
        <BoardPopular />
        <div className={styles.bar} />
        <BoardPopular />
      </section>
    </div>
  );
}
