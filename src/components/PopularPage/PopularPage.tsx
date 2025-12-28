import styles from "./PopularPage.module.scss";
import PopularTag from "./PopularTag/PopularTag";
import PopularUser from "./PopularUser/PopularUser";
import PopularFeed from "./PopularFeed/PopularFeed";

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
