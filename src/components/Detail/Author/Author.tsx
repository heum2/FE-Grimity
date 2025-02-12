import styles from "./Author.module.scss";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { useState, useEffect } from "react";
import { authState } from "@/states/authState";
import { useRecoilValue } from "recoil";
import { putFollow } from "@/api/users/putIdFollow";
import { deleteFollow } from "@/api/users/deleteIdFollow";
import { useToast } from "@/hooks/useToast";
import Link from "next/link";
import { AuthorProps } from "./Author.types";
import { useUserData } from "@/api/users/getId";
import Button from "@/components/Button/Button";
import { useUserFeeds } from "@/api/users/getIdFeeds";
import SquareCard from "@/components/Layout/SquareCard/SquareCard";
import Loader from "@/components/Layout/Loader/Loader";

export default function Author({ authorId, feedId }: AuthorProps) {
  const { data: userData } = useUserData(authorId);
  const { isLoggedIn, user_id } = useRecoilValue(authState);
  const [isFollowing, setIsFollowing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (userData && userData.isFollowing !== undefined) {
      setIsFollowing(userData.isFollowing);
    }
  }, [userData]);

  const { data, isLoading } = useUserFeeds({
    id: authorId,
    size: 4,
    sort: "latest",
  });

  const feeds = data?.feeds || [];

  if (isLoading) {
    return <Loader />;
  }

  const handleFollowClick = async (id: string) => {
    try {
      await putFollow(id);
      setIsFollowing(true);
    } catch (error) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  const handleUnfollowClick = async (id: string) => {
    try {
      await deleteFollow(id);
      setIsFollowing(false);
    } catch (error) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  return (
    <div className={styles.container}>
      {userData && (
        <>
          <div className={styles.spaceBetween}>
            <div className={styles.profileContainer}>
              <Link href={`/users/${authorId}`}>
                <div className={styles.profileLeft}>
                  {userData.image !== "https://image.grimity.com/null" ? (
                    <Image
                      src={userData.image}
                      alt={userData.name}
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
                  <div className={styles.authorInfo}>
                    <p className={styles.authorName}>{userData.name}</p>
                    <div className={styles.follower}>
                      팔로워
                      <p className={styles.followerColor}>
                        {formatCurrency(userData.followerCount)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              {isLoggedIn &&
                user_id !== userData.id &&
                (isFollowing ? (
                  <Button
                    size="m"
                    type="outlined-assistive"
                    onClick={() => handleUnfollowClick(userData.id)}
                  >
                    팔로잉
                  </Button>
                ) : (
                  <Button
                    size="m"
                    type="outlined-assistive"
                    onClick={() => handleFollowClick(userData.id)}
                  >
                    팔로우
                  </Button>
                ))}
            </div>
            <Link href={`/users/${authorId}`}>
              <p className={styles.seeMore}>작품 더보기</p>
            </Link>
          </div>
          <div className={styles.cardList}>
            {feeds.map((feed) => (
              <SquareCard
                key={feed.id}
                id={feed.id}
                title={feed.title}
                thumbnail={feed.thumbnail}
                cards={feed.cards}
                author={userData}
                likeCount={feed.likeCount}
                viewCount={feed.viewCount}
                createdAt={feed.createdAt}
                isSame={feed.id === feedId}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
