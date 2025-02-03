import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./SearchPage.module.scss";
import { useTagsPopular } from "@/api/tags/getTagsPopular";
import Link from "next/link";
import SearchFeed from "./Feed/SearchFeed/SearchFeed";
import SearchAuthor from "./User/SearchAuthor/SearchAuthor";

export default function SearchPage() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const { data: popularData } = useTagsPopular();
  const router = useRouter();
  const { tab } = router.query;

  useEffect(() => {
    const keyword = router.query.keyword as string | undefined;
    if (keyword) {
      setSearchValue(keyword);
      setSearchKeyword(keyword);
    }
  }, [router.query]);

  const getTabComponent = () => {
    switch (tab) {
      case "feed":
        return <SearchFeed />;
      case "author":
        return <SearchAuthor />;
      // case "board":
      //   return <SearchBoard />;
      default:
        return null;
    }
  };

  const getTabClass = (tabName: string) => {
    return tab === tabName ? styles.selected : "";
  };

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <section className={styles.searchBarSection}>
          <SearchBar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onSearch={(value) => setSearchKeyword(value)}
          />
          <div className={styles.recommend}>
            <p className={styles.recommendMessage}>추천 태그</p>
            <div className={styles.chips}>
              {popularData?.slice(0, 8).map((tag, index) => (
                <Link href={`/search?tab=feed&keyword=${tag.tagName}`}>
                  <div key={index} className={styles.chip}>
                    {tag.tagName}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className={styles.navContainer}>
          <button
            className={`${styles.button} ${getTabClass("feed")}`}
            onClick={() => router.push(`?tab=feed&keyword=${searchKeyword}`)}
          >
            그림
          </button>
          <button
            className={`${styles.button} ${getTabClass("author")}`}
            onClick={() => router.push(`?tab=author&keyword=${searchKeyword}`)}
          >
            작가
          </button>
          <div className={styles.bar} />
          <button className={`${styles.button} ${getTabClass("board")}`}>자유게시판</button>
        </section>
        {getTabComponent()}
      </div>
    </div>
  );
}
