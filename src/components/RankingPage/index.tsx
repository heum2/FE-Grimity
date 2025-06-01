import PopularFeed from "@/components/RankingPage/PopularFeed";
import PopularTag from "@/components/RankingPage/PopularTag";
import PopularUser from "@/components/RankingPage/PopularUser";
import styles from "@/components/RankingPage/RankingPage.module.scss";

function Ranking() {
  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <section className={styles.contentSection}>
          <PopularFeed />
          <PopularUser />
          <PopularTag />
        </section>
      </div>
    </div>
  );
}

export default Ranking;
