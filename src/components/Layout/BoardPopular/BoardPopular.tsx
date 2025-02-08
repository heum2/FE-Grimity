import React from "react";
import BoardCard from "../BoardCard/BoardCard";
import Title from "../Title/Title";
import styles from "./BoardPopular.module.scss";
import { useTodayPopularPosts } from "@/api/posts/getTodayPopular";
import Loader from "../Loader/Loader";

export default function BoardPopular() {
  const { data, isLoading } = useTodayPopularPosts();

  if (isLoading) {
    return <Loader />;
  }

  const popularPosts = data?.slice(0, 4);

  return (
    <div className={styles.container}>
      <Title link="/board">자유게시판 인기글</Title>
      <section className={styles.cardSection}>
        {popularPosts?.map((post, index) => (
          <React.Fragment key={post.id}>
            <BoardCard {...post} />
            {index < popularPosts.length - 1 && <div className={styles.bar} />}
          </React.Fragment>
        ))}
      </section>
    </div>
  );
}
