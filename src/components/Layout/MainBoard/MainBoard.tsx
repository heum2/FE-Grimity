import React, { useEffect } from "react";
import BoardCard from "../BoardCard/BoardCard";
import Title from "../Title/Title";
import styles from "./MainBoard.module.scss";
import Loader from "../Loader/Loader";
import { MainBoardProps } from "./MainBoard.types";
import { usePostsLatest, usePostsNotices } from "@/api/posts/getPosts";
import { useRouter } from "next/router";

export default function MainBoard({ type }: MainBoardProps) {
  const {
    data: noticePosts,
    isLoading: isNoticeLoading,
    refetch: noticeRefetch,
  } = usePostsNotices();

  const {
    data: latestPosts,
    isLoading: isLatestLoading,
    refetch: latestRefetch,
  } = usePostsLatest({
    size: 3,
    page: 1,
    type: "ALL",
  });

  const { pathname } = useRouter();

  useEffect(() => {
    latestRefetch();
    noticeRefetch();
  }, [pathname]);

  if ((type === "ALL" && isLatestLoading) || (type === "NOTICE" && isNoticeLoading)) {
    return <Loader />;
  }

  const getTitle = () => {
    switch (type) {
      case "NOTICE":
        return "공지사항";
      case "ALL":
        return "자유게시판 최신 글";
      default:
        return "";
    }
  };

  const getLink = () => {
    switch (type) {
      case "NOTICE":
        return "/board?type=NOTICE&page=1";
      case "ALL":
        return "/board?type=ALL&page=1";
      default:
        return "/board";
    }
  };

  return (
    <div className={styles.container}>
      <Title link={getLink()}>{getTitle()}</Title>
      <section className={styles.cardSection}>
        {type === "NOTICE" ? (
          noticePosts && noticePosts.length > 0 ? (
            noticePosts.map((post, index, arr) => (
              <React.Fragment key={post.id}>
                <BoardCard {...post} thumbnail={post.thumbnail} />
                {index < arr.length - 1 && <div className={styles.bar} />}
              </React.Fragment>
            ))
          ) : (
            <p className={styles.noPosts}>공지사항이 없습니다</p>
          )
        ) : latestPosts && latestPosts.posts.length > 0 ? (
          latestPosts.posts.map((post, index, arr) => (
            <React.Fragment key={post.id}>
              <BoardCard {...post} thumbnail={post.thumbnail} />
              {index < arr.length - 1 && <div className={styles.bar} />}
            </React.Fragment>
          ))
        ) : (
          <p className={styles.noPosts}>아직 올라온 글이 없어요</p>
        )}
      </section>
    </div>
  );
}
