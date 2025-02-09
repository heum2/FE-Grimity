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
    if (type !== "popular") {
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

  if ((type === "popular" && isPopularLoading) || (type !== "popular" && isLoading)) {
    return <Loader />;
  }

  const getTitle = () => {
    switch (type) {
      case "popular":
        return "자유게시판 인기글";
      case "feedback":
        return "피드백을 기다리고 있어요";
      case "question":
        return "새로 올라온 질문 글";
      default:
        return "";
    }
  };

  const getLink = () => {
    switch (type) {
      case "popular":
        return "/board";
      case "feedback":
        return "/board?type=feedback&page=1";
      case "question":
        return "/board?type=question&page=1";
      default:
        return "/board";
    }
  };

  return (
    <div className={styles.container}>
      <Title link={getLink()}>{getTitle()}</Title>
      <section className={styles.cardSection}>
        {type === "popular"
          ? popularPosts?.slice(0, 4).map((post, index) => (
              <React.Fragment key={post.id}>
                <BoardCard {...post} />
                {index < 3 && <div className={styles.bar} />}
              </React.Fragment>
            ))
          : data?.map((post, index) => (
              <React.Fragment key={post.id}>
                <BoardCard {...post} />
                {index < data.length - 1 && <div className={styles.bar} />}
              </React.Fragment>
            ))}
      </section>
    </div>
  );
}
