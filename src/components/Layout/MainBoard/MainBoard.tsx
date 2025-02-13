import React, { useEffect, useState } from "react";
import BoardCard from "../BoardCard/BoardCard";
import Title from "../Title/Title";
import styles from "./MainBoard.module.scss";
import Loader from "../Loader/Loader";
import { MainBoardProps } from "./MainBoard.types";
import { getPostsLatest, PostsLatest } from "@/api/posts/getPosts";
import { useTodayPopularPosts } from "@/api/posts/getTodayPopular";

export default function MainBoard({ type }: MainBoardProps) {
  const [data, setData] = useState<PostsLatest[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: popularPosts, isLoading: isPopularLoading } = useTodayPopularPosts();

  useEffect(() => {
    if (type !== "POPULAR") {
      const fetchPosts = async () => {
        try {
          const response = await getPostsLatest({
            size: 4,
            page: 1,
            type: type,
          });
          setData(response.posts);
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPosts();
    }
  }, [type]);

  if ((type === "POPULAR" && isPopularLoading) || (type !== "POPULAR" && isLoading)) {
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
        ) : data && data.length > 0 ? (
          data.map((post, index, arr) => (
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
