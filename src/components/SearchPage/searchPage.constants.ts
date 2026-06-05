export type Tab = "feed" | "author" | "board";

export type SortOption = "latest" | "popular";

export const MIN_KEYWORD_LENGTH = 2;

export const SORT_OPTIONS_BY_TAB: Record<
  Tab,
  { label: string; value: SortOption }[]
> = {
  feed: [
    { label: "최신순", value: "latest" },
    { label: "좋아요순", value: "popular" },
  ],
  author: [
    { label: "최신순", value: "latest" },
  ],
  board: [
    { label: "최신순", value: "latest" },
  ],
};

export const DEFAULT_SORT_BY_TAB: Record<Tab, SortOption> = {
  feed: "latest",
  author: "latest",
  board: "latest",
};

export function resolveSortOption(tab: Tab, sort: string | string[] | undefined): SortOption {
  const options = SORT_OPTIONS_BY_TAB[tab];
  const value = typeof sort === "string" ? sort : undefined;
  if (value && options.some((option) => option.value === value)) {
    return value as SortOption;
  }
  return DEFAULT_SORT_BY_TAB[tab];
}

export function resolveTab(value: string | string[] | undefined): Tab {
  return value === "author" || value === "board" ? value : "feed";
}
