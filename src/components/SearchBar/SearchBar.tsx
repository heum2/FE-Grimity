import IconComponent from "../Asset/Icon";
import styles from "./SearchBar.module.scss";
import { SearchBarProps } from "./SearchBar.types";

export default function SearchBar({ searchValue, setSearchValue }: SearchBarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClear = () => {
    setSearchValue("");
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
