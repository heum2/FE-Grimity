import styles from "./Detail.module.scss";
import { DetailProps } from "./Detail.types";
import { useDetails } from "@/api/feeds/getFeedsId";
import Image from "next/image";
import { useState, useEffect } from "react";
import Dropdown from "../Dropdown/Dropdown";
import { authState } from "@/states/authState";
import { useRecoilState, useRecoilValue } from "recoil";
import { useToast } from "@/utils/useToast";
import IconComponent from "../Asset/Icon";
import { deleteLike, putLike } from "@/api/feeds/putDeleteFeedsLike";
import Button from "../Button/Button";
import Link from "next/link";
import { putView } from "@/api/feeds/putIdView";
import { deleteFeeds } from "@/api/feeds/deleteFeedsId";
import { useRouter } from "next/router";
import { usePreventScroll } from "@/utils/usePreventScroll";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Loader from "../Layout/Loader/Loader";
import Author from "./Author/Author";
import ShareBtn from "./ShareBtn/ShareBtn";
import { timeAgo } from "@/utils/timeAgo";
import Chip from "../Chip/Chip";
import { modalState } from "@/states/modalState";
import { deleteSave, putSave } from "@/api/feeds/putDeleteFeedsIdSave";
import Similar from "./Similar/Similar";
import Comment from "./Comment/Comment";
import NewFeed from "../Layout/NewFeed/NewFeed";

export default function Detail({ id }: DetailProps) {
  const { isLoggedIn, user_id } = useRecoilValue(authState);
  const { data: details, isLoading } = useDetails(id);
  const [isExpanded, setIsExpanded] = useState(false);
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(0);
  const [viewCounted, setViewCounted] = useState(false);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const router = useRouter();
  const [, setModal] = useRecoilState(modalState);

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
      setModal({
        isOpen: true,
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

    if (isLiked) {
      await deleteLike(id);
      setCurrentLikeCount((prev) => prev - 1);
    } else {
      await putLike(id);
      setCurrentLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
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
      setModal({
        isOpen: true,
        type: "SHARE",
        data: { feedId: id, title: details.title, image: details.thumbnail },
      });
    }
  };

  const handleShowToast = () => {
    showToast("신고되었습니다.", "information");
  };

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        {details && (
          <>
            <section className={styles.header}>
              <div className={styles.profileLeft}>
                <Link href={`/users/${details.author.id}`}>
                  {details.author.image !== "https://image.grimity.com/null" ? (
                    <Image
                      src={details.author.image}
                      alt={details.author.name}
                      className={styles.authorImage}
                      width={100}
                      height={100}
                      quality={100}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Image
                      src="/image/default.svg"
                      width={100}
                      height={100}
                      alt="프로필 이미지"
                      className={styles.authorImage}
                      quality={100}
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </Link>
                <div className={styles.authorInfo}>
                  <Link href={`/users/${details.author.id}`}>
                    <p className={styles.authorName}>{details.author.name}</p>
                  </Link>
                  <div className={styles.stats}>
                    <p className={styles.createdAt}>{timeAgo(details.createdAt)}</p>
                    <Image src="/icon/dot.svg" width={3} height={3} alt="" />
                    <div className={styles.stat}>
                      <Image
                        src="/icon/like-count.svg"
                        width={16}
                        height={0}
                        alt="좋아요 수"
                        className={styles.statIcon}
                      />
                      {currentLikeCount}
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
                </div>
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
                            onClick: handleShowToast,
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
              {details.cards.slice(0, 2).map((card, index) => (
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
            {isExpanded &&
              details.cards.slice(2).map((card, index) => (
                <div key={index + 2} className={styles.imageWrapper2}>
                  <Image
                    src={card}
                    alt={`Card image ${index + 3}`}
                    width={600}
                    height={0}
                    layout="intrinsic"
                    className={styles.cardImage}
                    onClick={() => handleImageClick(card)}
                  />
                </div>
              ))}
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
            <section className={styles.contentContainer}>
              <h2 className={styles.title}>{details.title}</h2>
              <div className={styles.bar} />
              <p className={styles.content}>{details.content}</p>
              {details.isAI && (
                <div className={styles.aiBtn}>
                  <Image src="/icon/ai-message.svg" width={20} height={20} alt="" />
                  해당 컨텐츠는 AI로 생성되었어요
                </div>
              )}
              <div className={styles.stats}>
                <p className={styles.createdAt}>{timeAgo(details.createdAt)}</p>
                <Image src="/icon/dot.svg" width={3} height={3} alt="" />
                <div className={styles.stat}>
                  <Image
                    src="/icon/like-count.svg"
                    width={16}
                    height={0}
                    alt="좋아요 수"
                    className={styles.statIcon}
                  />
                  {currentLikeCount}
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
            <div className={styles.btnContainer}>
              <div className={styles.likeBtn} onClick={handleLikeClick}>
                <Button
                  size="l"
                  type="outlined-assistive"
                  leftIcon={
                    <Image
                      src={isLiked ? "/icon/detail-like-on.svg" : "/icon/detail-like-off.svg"}
                      width={20}
                      height={20}
                      alt="좋아요"
                    />
                  }
                >
                  {currentLikeCount}
                </Button>
              </div>
              <div className={styles.saveBtn} onClick={handleSaveClick}>
                <Image
                  src={isSaved ? "/icon/detail-save-on.svg" : "/icon/detail-save-off.svg"}
                  width={20}
                  height={20}
                  alt="저장"
                />
              </div>
              {user_id === details.author.id || !isLoggedIn ? (
                <div className={styles.dropdown}>
                  <Dropdown
                    trigger={
                      <div className={styles.menuBtn}>
                        <Image src="/icon/meatball.svg" width={20} height={20} alt="메뉴 버튼 " />
                      </div>
                    }
                    menuItems={[
                      {
                        label: "공유하기",
                        onClick: handleOpenShareModal,
                      },
                    ]}
                  />
                </div>
              ) : (
                <div className={styles.dropdown}>
                  <Dropdown
                    trigger={
                      <div className={styles.menuBtn}>
                        <Image src="/icon/meatball.svg" width={20} height={20} alt="메뉴 버튼 " />
                      </div>
                    }
                    menuItems={[
                      {
                        label: "공유하기",
                        onClick: handleOpenShareModal,
                      },
                      {
                        label: "신고하기",
                        onClick: handleShowToast,
                        isDelete: true,
                      },
                    ]}
                  />
                </div>
              )}
            </div>
            <Comment feedId={id} feedWriterId={details.author.id} />
            <div className={styles.bar} />
            <div className={styles.cards}>
              <Author authorId={details.author.id} feedId={id} />
              {details.tags.length > 0 && <Similar tagNames={details.tags.join(",")} />}
              <NewFeed isDetail />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
