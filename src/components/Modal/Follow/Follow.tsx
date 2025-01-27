import { useState, useRef, useEffect } from "react";
import styles from "./Follow.module.scss";
import { useMyFollower, useMyFollowing } from "@/api/users/getMeFollow";
import Image from "next/image";
import Button from "@/components/Button/Button";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { modalState } from "@/states/modalState";
import { deleteMyFollowers } from "@/api/users/deleteMeFollowers";
import { deleteFollow } from "@/api/users/deleteIdFollow";
import { useToast } from "@/utils/useToast";
import { FollowProps } from "./Follow.types";

export default function Follow({ initialTab }: FollowProps) {
  const [activeTab, setActiveTab] = useState<"follower" | "following">(initialTab);
  const [indicatorPosition, setIndicatorPosition] = useState(0);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [, setModal] = useRecoilState(modalState);
  const [, setIsFetchingData] = useState(false);
  const route = useRouter();
  const { showToast } = useToast();

  const {
    data: followerData,
    fetchNextPage: fetchMoreFollowers,
    hasNextPage: hasNextFollowers,
    isFetching: isFetchingFollowers,
    refetch: refetchFollower,
  } = useMyFollower();

  const {
    data: followingData,
    fetchNextPage: fetchMoreFollowings,
    hasNextPage: hasNextFollowings,
    isFetching: isFetchingFollowings,
    refetch: refetchFollowing,
  } = useMyFollowing();

  const handleFetchMoreFollowers = () => {
    if (hasNextFollowers && !isFetchingFollowers) {
      setIsFetchingData(true);
      fetchMoreFollowers().finally(() => setIsFetchingData(false));
    }
  };

  const handleFetchMoreFollowings = () => {
    if (hasNextFollowings && !isFetchingFollowings) {
      setIsFetchingData(true);
      fetchMoreFollowings().finally(() => setIsFetchingData(false));
    }
  };

  const handleTabChange = (tab: "follower" | "following") => {
    setActiveTab(tab);
  };

  const data =
    activeTab === "follower"
      ? followerData?.pages.flatMap((page) => page.followers) || []
      : followingData?.pages.flatMap((page) => page.followings) || [];

  const fetchMore = activeTab === "follower" ? handleFetchMoreFollowers : handleFetchMoreFollowings;

  useEffect(() => {
    if (!tabsRef.current) return;

    const tabs = tabsRef.current.getElementsByClassName(styles.tab);
    const activeTabElement = tabs[activeTab === "follower" ? 0 : 1];

    if (activeTabElement) {
      const tabOffsetLeft = (activeTabElement as HTMLElement).offsetLeft;
      setIndicatorPosition(tabOffsetLeft);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!fetchMore || !observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchMore, activeTab]);

  const handleClickUser = (id: string) => {
    route.push(`/users/${id}`);
    setModal({ isOpen: false, type: null, data: null });
  };

  const handleDeleteFollow = async (id: string) => {
    try {
      if (activeTab === "follower") {
        await deleteMyFollowers(id);
        showToast("해당 팔로워를 삭제했습니다.", "success");
        refetchFollower();
      } else {
        await deleteFollow(id);
        showToast("언팔로우 되었습니다.", "success");
        refetchFollowing();
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      showToast("삭제에 실패했습니다.", "error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs} ref={tabsRef}>
        <div
          className={`${styles.tab} ${activeTab === "follower" ? styles.active : ""}`}
          onClick={() => handleTabChange("follower")}
        >
          팔로워
        </div>
        <div
          className={`${styles.tab} ${activeTab === "following" ? styles.active : ""}`}
          onClick={() => handleTabChange("following")}
        >
          팔로잉
        </div>
        <div
          className={styles.indicator}
          style={{
            transform: `translateX(${indicatorPosition}px)`,
          }}
        />
      </div>
      <div className={styles.tabContent}>
        <ul>
          {data.map((follow, index) => (
            <li key={index} className={styles.item}>
              {follow.image !== "https://image.grimity.com/null" ? (
                <Image
                  src={follow.image}
                  width={50}
                  height={50}
                  onClick={() => handleClickUser(follow.id)}
                  className={styles.image}
                  alt={`${activeTab === "follower" ? "팔로워" : "팔로잉"} 프로필 이미지`}
                />
              ) : (
                <Image
                  src="/image/default.svg"
                  width={50}
                  height={50}
                  onClick={() => handleClickUser(follow.id)}
                  className={styles.image}
                  alt={`${activeTab === "follower" ? "팔로워" : "팔로잉"} 프로필 이미지`}
                />
              )}
              <div className={styles.nameDescription} onClick={() => handleClickUser(follow.id)}>
                <p className={styles.name}>{follow.name}</p>
                <p className={styles.description}>{follow.description}</p>
              </div>
              {activeTab === "follower" ? (
                <div className={styles.btn}>
                  <Button
                    type="outlined-assistive"
                    size="s"
                    onClick={() => handleDeleteFollow(follow.id)}
                  >
                    삭제
                  </Button>
                </div>
              ) : (
                <div className={styles.btn}>
                  <Button
                    type="outlined-assistive"
                    size="s"
                    onClick={() => handleDeleteFollow(follow.id)}
                  >
                    언팔로우
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div ref={observerRef} />
      </div>
    </div>
  );
}
