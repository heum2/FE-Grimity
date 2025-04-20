import { InitialPageMeta } from "@/components/MetaData/MetaData";
import SearchPage from "@/components/SearchPage/SearchPage";
import { serviceUrl } from "@/constants/serviceurl";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useRouter } from "next/router";
import React, { useEffect, useState, createContext } from "react";
import Highlighter from "react-highlight-words";

interface SearchHighlightContextType {
  highlight: (text: string) => React.ReactNode;
  keyword: string;
}

export const SearchHighlightContext = createContext<SearchHighlightContextType>({
  highlight: (text: string) => text,
  keyword: "",
});

export default function Search() {
  const router = useRouter();
  const [OGTitle] = useState("검색 결과 - 그리미티");
  const [OGUrl, setOGUrl] = useState(serviceUrl);
  const { restoreScrollPosition } = useScrollRestoration("search-scroll");

  // URL에서 쿼리 파라미터로 검색어 받아오기
  const keyword =
    typeof router.query.keyword === "string" ? decodeURIComponent(router.query.keyword) : "";

  useEffect(() => {
    setOGUrl(`${serviceUrl}/${router.asPath}`);
  }, [router.asPath]);

  useEffect(() => {
    if (sessionStorage.getItem("search-scroll") !== null) {
      restoreScrollPosition();
      sessionStorage.removeItem("search-scroll");
    }
  }, [restoreScrollPosition]);

  const highlight = (text: string): React.ReactNode => {
    if (!text || !keyword) return text;

    return (
      <Highlighter
        highlightClassName="highlighted-keyword"
        searchWords={[keyword]}
        autoEscape={true}
        textToHighlight={text}
        highlightStyle={{
          color: "#2bc466",
          backgroundColor: "transparent",
        }}
      />
    );
  };

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <SearchHighlightContext.Provider value={{ highlight, keyword }}>
        <SearchPage />
      </SearchHighlightContext.Provider>
    </>
  );
}
