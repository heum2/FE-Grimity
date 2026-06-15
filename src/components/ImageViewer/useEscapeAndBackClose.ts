import { useEffect } from "react";

/**
 * ESC 키와 브라우저 뒤로가기(popstate)로 오버레이를 닫는다.
 * 마운트 시 history를 한 번 push해 뒤로가기를 닫기 동작으로 흡수한다.
 */
export function useEscapeAndBackClose(onClose: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    history.pushState(null, "", location.href);
    const handlePopState = () => onClose();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [onClose]);
}
