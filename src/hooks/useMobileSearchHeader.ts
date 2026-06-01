import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import {
  MIN_KEYWORD_LENGTH,
  resolveSortOption,
  resolveTab,
} from "@/components/SearchPage/searchPage.constants";
import { useToast } from "@/hooks/useToast";

/**
 * 모바일 GNB의 search variant에 바인딩되는 검색 입력 상태/핸들러.
 * `/search`가 아닌 페이지에서도 안전하게 호출 가능 (enabled=false일 때 동기화/제출 비활성화).
 */
export function useMobileSearchHeader(enabled: boolean) {
  const router = useRouter();
  const { showToast } = useToast();

  const routerKeyword =
    typeof router.query.keyword === "string" ? router.query.keyword : "";
  const [value, setValue] = useState(routerKeyword);

  useEffect(() => {
    if (enabled) setValue(routerKeyword);
  }, [routerKeyword, enabled]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.nativeEvent.isComposing) return;
      if (e.key !== "Enter") return;

      const trimmed = value.trim();
      if (trimmed.length < MIN_KEYWORD_LENGTH) {
        showToast("두 글자 이상 입력해주세요.", "warning");
        return;
      }

      const nextTab = resolveTab(router.query.tab);
      const nextSort = resolveSortOption(nextTab, router.query.sort);

      router.push(
        {
          pathname: "/search",
          query: { tab: nextTab, keyword: trimmed, sort: nextSort },
        },
        undefined,
        { shallow: true },
      );
    },
    [value, router, showToast],
  );

  const onClear = useCallback(() => {
    setValue("");
    router.push("/search", undefined, { shallow: true });
  }, [router]);

  return { value, setValue, onKeyDown, onClear };
}
