import styles from "./PopularPage.module.scss";
import PopularTag from "@/components/RankingPage/PopularTag";
import PopularUser from "@/components/RankingPage/PopularUser";
import PopularFeed from "@/components/RankingPage/PopularFeed";

export default function Popular() {
  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <section className={styles.contentSection}>
          <PopularTag />
          <PopularUser />
          <PopularFeed />
        </section>
      </div>
    </div>
  );
}
