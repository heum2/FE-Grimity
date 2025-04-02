import { useEffect, useRef } from "react";

export function usePreventRightClick<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
    };

    element.addEventListener("contextmenu", disableRightClick);

    return () => {
      element.removeEventListener("contextmenu", disableRightClick);
    };
  });

  return ref;
}
