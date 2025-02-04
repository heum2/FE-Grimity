import { useRouter } from "next/router";
import IconComponent from "../Asset/Icon";
import styles from "./SearchBar.module.scss";
import { SearchBarProps } from "./SearchBar.types";

export default function SearchBar({ searchValue, setSearchValue, onSearch }: SearchBarProps) {
  const router = useRouter();
  const { tab } = router.query;

  const handleClear = () => {
    setSearchValue("");
    router.push("");
    onSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const currentTab = tab === "author" ? "author" : "feed";
      router.push(`?tab=${currentTab}&keyword=${searchValue}`, undefined, { shallow: true });
      onSearch(searchValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <IconComponent name="searchGray" width={24} height={24} padding={8} />
        <input
          type="text"
          placeholder="그림, 작가, 관련 작품을 검색해보세요"
          className={styles.input}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      {searchValue && (
        <div onClick={handleClear}>
          <IconComponent name="searchDelete" width={24} height={24} padding={8} isBtn />
        </div>
      )}
    </div>
  );
}
