import React from "react";
import BoardCard from "../BoardCard/BoardCard";
import Title from "../Title/Title";
import styles from "./BoardPopular.module.scss";
import { mockBoardData } from "./mockup";

export default function BoardPopular() {
  return (
    <div className={styles.container}>
      <Title link="/">목업 데이터 자유게시판</Title>
      <section className={styles.cardSection}>
        {mockBoardData.map((data, index) => (
          <React.Fragment key={data.id}>
            <BoardCard {...data} />
            {index < mockBoardData.length - 1 && <div className={styles.bar} />}
          </React.Fragment>
        ))}
      </section>
    </div>
  );
}
