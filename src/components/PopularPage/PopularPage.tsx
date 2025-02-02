import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./PopularPage.module.scss";
import PopularTag from "./PopularTag/PopularTag";
import PopularUser from "./PopularUser/PopularUser";

export default function Popular() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
        <section className={styles.contentSection}>
          <PopularTag />
          <PopularUser />
        </section>
      </div>
    </div>
  );
}
