import React from "react";
import BoardCard from "../BoardCard/BoardCard";
import Title from "../Title/Title";
import styles from "./MainBoard.module.scss";
import Loader from "../Loader/Loader";
import { MainBoardProps } from "./MainBoard.types";
import { useTodayPopularPosts } from "@/api/posts/getTodayPopular";
import { usePostsLatest } from "@/api/posts/getPosts";

export default function MainBoard({ type }: MainBoardProps) {
  const { data: latestPosts, isLoading: isLatestLoading } =
    type !== "POPULAR"
      ? usePostsLatest({
          size: 4,
          page: 1,
          type: type as "QUESTION" | "FEEDBACK" | "ALL",
        })
      : { data: null, isLoading: false };

  const { data: popularPosts, isLoading: isPopularLoading } = useTodayPopularPosts();

  if ((type === "POPULAR" && isPopularLoading) || (type !== "POPULAR" && isLatestLoading)) {
    return <Loader />;
  }

  const getTitle = () => {
    switch (type) {
      case "POPULAR":
        return "자유게시판 인기글";
      case "FEEDBACK":
        return "피드백을 기다리고 있어요";
      case "QUESTION":
        return "새로 올라온 질문 글";
      default:
        return "";
    }
  };

  const getLink = () => {
    switch (type) {
      case "POPULAR":
        return "/board";
      case "FEEDBACK":
        return "/board?type=feedback&page=1";
      case "QUESTION":
        return "/board?type=question&page=1";
      default:
        return "/board";
    }
  };

  return (
    <div className={styles.container}>
      <Title link={getLink()}>{getTitle()}</Title>
      <section className={styles.cardSection}>
        {type === "POPULAR" ? (
          popularPosts && popularPosts.length > 0 ? (
            popularPosts.slice(0, 4).map((post, index, arr) => (
              <React.Fragment key={post.id}>
                <BoardCard {...post} />
                {index < arr.length - 1 && <div className={styles.bar} />}
              </React.Fragment>
            ))
          ) : (
            <p className={styles.noPosts}>아직 올라온 글이 없어요</p>
          )
        ) : latestPosts && latestPosts.posts.length > 0 ? (
          latestPosts.posts.map((post, index, arr) => (
            <React.Fragment key={post.id}>
              <BoardCard {...post} />
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
