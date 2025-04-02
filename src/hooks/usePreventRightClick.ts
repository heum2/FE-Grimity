import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/useToast";

export function usePreventRightClick<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      showToast("우클릭이 차단되었습니다.", "information");
    };

    element.addEventListener("contextmenu", disableRightClick);

    return () => {
      element.removeEventListener("contextmenu", disableRightClick);
    };
  }, [showToast]);

  return ref;
}
