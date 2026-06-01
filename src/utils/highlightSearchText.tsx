import { Fragment, type ReactNode } from "react";

export function highlightSearchText(
  text: string,
  keyword: string,
  highlightClassName?: string,
): ReactNode {
  const query = keyword.trim();
  if (!query || !text) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const parts: ReactNode[] = [];
  let start = 0;
  let partIndex = 0;

  while (start < text.length) {
    const matchIndex = lowerText.indexOf(lowerQuery, start);
    if (matchIndex === -1) {
      parts.push(text.slice(start));
      break;
    }

    if (matchIndex > start) {
      parts.push(text.slice(start, matchIndex));
    }

    const matchedText = text.slice(matchIndex, matchIndex + query.length);
    parts.push(
      highlightClassName ? (
        <span key={`${matchIndex}-${partIndex}`} className={highlightClassName}>
          {matchedText}
        </span>
      ) : (
        <Fragment key={`${matchIndex}-${partIndex}`}>{matchedText}</Fragment>
      ),
    );

    partIndex += 1;
    start = matchIndex + query.length;
  }

  if (parts.length === 0) return text;
  if (parts.length === 1) return parts[0];

  return <>{parts}</>;
}
