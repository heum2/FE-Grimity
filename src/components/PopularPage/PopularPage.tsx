import styles from "./PopularPage.module.scss";
<<<<<<< HEAD
import PopularTag from "@/components/RankingPage/PopularTag";
import PopularUser from "@/components/RankingPage/PopularUser";
import PopularFeed from "@/components/RankingPage/PopularFeed";
=======
import PopularTag from "./PopularTag/PopularTag";
import PopularUser from "./PopularUser/PopularUser";
import PopularFeed from "./PopularFeed/PopularFeed";
>>>>>>> 8f3813ed05c7aaca16a8ab9af6e620afc62903c5

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
