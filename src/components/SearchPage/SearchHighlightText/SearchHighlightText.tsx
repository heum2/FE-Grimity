import { highlightSearchText } from "@/utils/highlightSearchText";

import styles from "./SearchHighlightText.module.scss";

interface SearchHighlightTextProps {
  text: string;
  keyword: string;
}

export default function SearchHighlightText({ text, keyword }: SearchHighlightTextProps) {
  return <>{highlightSearchText(text, keyword, styles.highlight)}</>;
}
