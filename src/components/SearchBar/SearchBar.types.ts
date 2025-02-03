export interface SearchBarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  onSearch: (value: string) => void;
}
