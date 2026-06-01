import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useTagsPopular } from "@/api/tags/getTagsPopular";
import { useDeviceStore } from "@/states/deviceStore";

import Empty from "@/components/common/Empty/Empty";
import Icon from "@/components/common/Icon/Icon";
import Menu from "@/components/common/Navigation/Menu/Menu";
import BottomSheet from "@/components/common/PopUp/BottomSheet/BottomSheet";
import TextField from "@/components/common/Input/TextField/TextField";
import { useToast } from "@/hooks/useToast";

import SearchFeed from "./Feed/SearchFeed/SearchFeed";
import SearchAuthor from "./User/SearchAuthor/SearchAuthor";
import SearchPost from "./Post/SearchPost/SearchPost";
import RecommendTagsSlider from "./RecommendTagsSlider/RecommendTagsSlider";
import {
  type Tab,
  SORT_OPTIONS_BY_TAB,
  MIN_KEYWORD_LENGTH,
  resolveSortOption,
  resolveTab,
} from "./searchPage.constants";

import styles from "./SearchPage.module.scss";
import clsx from "clsx";

const POPULAR_TAG_LIMIT = 10;

const TABS: { value: Tab; label: string }[] = [
  { value: "feed", label: "그림" },
  { value: "author", label: "작가" },
  { value: "board", label: "자유게시판" },
];

export default function SearchPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { data: popularData } = useTagsPopular();
  const isMobile = useDeviceStore((state) => state.isMobile);

  const queryKeyword = typeof router.query.keyword === "string" ? router.query.keyword : "";
  const tab = resolveTab(router.query.tab);
  const sort = resolveSortOption(tab, router.query.sort);
  const sortOptions = SORT_OPTIONS_BY_TAB[tab];
  const selectedSortLabel =
    sortOptions.find((option) => option.value === sort)?.label ?? "최신순";

  const [searchValue, setSearchValue] = useState(queryKeyword);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);

  useEffect(() => {
    setSearchValue(queryKeyword);
  }, [queryKeyword]);

  const navigateSearch = (keyword: string, nextTab: Tab = tab) => {
    const nextSort = resolveSortOption(nextTab, router.query.sort);
    router.push(
      {
        pathname: "/search",
        query: {
          tab: nextTab,
          keyword,
          sort: nextSort,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleSortChange = (value: string) => {
    router.push(
      {
        pathname: "/search",
        query: {
          tab,
          keyword: queryKeyword,
          sort: value,
          ...(tab === "board" ? { page: 1 } : {}),
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key !== "Enter") return;

    const trimmed = searchValue.trim();
    if (trimmed.length < MIN_KEYWORD_LENGTH) {
      showToast("두 글자 이상 입력해주세요.", "warning");
      return;
    }
    navigateSearch(trimmed);
  };

  const handleClear = () => {
    setSearchValue("");
    router.push("/search", undefined, { shallow: true });
  };

  const renderTab = () => {
    if (!queryKeyword) {
      return (
        <div className={styles.emptyContainer}>
          <Empty
            size="xl"
            iconName="illust"
            title="그리미티에서 찾아보세요!"
          />
        </div>
      );
    }

    switch (tab) {
      case "author":
        return <SearchAuthor />;
      case "board":
        return <SearchPost />;
      case "feed":
      default:
        return <SearchFeed />;
    }
  };

  const sortTriggerButton = (
    <button
      type="button"
      className={clsx(styles.sortTrigger, !queryKeyword && styles.disabled)}
      disabled={!queryKeyword}
      aria-haspopup={isMobile ? "dialog" : "menu"}
      aria-label="정렬 기준 선택"
      onClick={isMobile ? () => setIsSortSheetOpen(true) : undefined}
    >
      <span>{selectedSortLabel}</span>
      <Icon
        name="chevron-down"
        size={16}
        color={!queryKeyword ? "gray-subtler" : "gray-bold"}
      />
    </button>
  );

  return (
    <div className={styles.container}>
      <section className={styles.searchBarSection}>
        <div className={styles.searchBarWrap}>
          <TextField
            variant="search"
            size="md"
            placeholder="그림, 작가, 글을 검색해보세요."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onClear={handleClear}
          />
        </div>
        {popularData &&
          popularData.length > 0 &&
          !(isMobile && queryKeyword) && (
            <div className={styles.recommend}>
              <div className={styles.recommendInner}>
                <p className={styles.recommendLabel}>추천 태그</p>
                <RecommendTagsSlider tags={popularData.slice(0, POPULAR_TAG_LIMIT)} />
              </div>
            </div>
          )}
      </section>

      <div className={styles.tabPanel}>
        {(!isMobile || queryKeyword) && <div className={styles.tabBar}>
          <nav className={styles.tabs} aria-label="검색 카테고리">
            {TABS.map((t) => {
              const isActive = tab === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                  onClick={() => navigateSearch(queryKeyword, t.value)}
                  aria-pressed={isActive}
                >
                  {t.label}
                </button>
              );
            })}
          </nav>

          {tab !== "author" && (
            <div className={styles.sortMenu}>
              {isMobile ? (
                sortTriggerButton
              ) : (
                <Menu
                  align="right"
                  trigger={sortTriggerButton}
                  items={sortOptions.map((option) => ({
                    label: option.label,
                    selected: option.value === sort,
                    onClick: () => handleSortChange(option.value),
                  }))}
                />
              )}
            </div>
          )}
        </div>}

        <div className={styles.tabContent}>{renderTab()}</div>
      </div>

      {tab !== "author" && (
        <BottomSheet
          isOpen={isSortSheetOpen}
          onClose={() => setIsSortSheetOpen(false)}
          title="정렬"
          showCloseIcon
        >
          <ul className={styles.sortSheetList}>
            {sortOptions.map((option) => {
              const isSelected = option.value === sort;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={clsx(
                      styles.sortSheetItem,
                      isSelected && styles.sortSheetItemSelected,
                    )}
                    onClick={() => {
                      handleSortChange(option.value);
                      setIsSortSheetOpen(false);
                    }}
                    aria-pressed={isSelected}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <Icon name="check" size={20} color="primary-normal" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </BottomSheet>
      )}
    </div>
  );
}
 