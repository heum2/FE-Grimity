import { useEffect, useCallback } from "react";

export const usePreventScroll = (isOpen: boolean) => {
  const setBodyStyleOpenModal = useCallback(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--scrollbar-width", `${scrollBarWidth}px`);
    document.body.classList.add("modalOpen");
  }, []);

  const setBodyStyleCloseModal = useCallback(() => {
    document.documentElement.style.removeProperty("--scrollbar-width");
    document.body.classList.remove("modalOpen");
  }, []);

  useEffect(() => {
    if (isOpen) {
      setBodyStyleOpenModal();
    } else {
      setBodyStyleCloseModal();
    }

    return () => {
      setBodyStyleCloseModal();
    };
  }, [isOpen, setBodyStyleOpenModal, setBodyStyleCloseModal]);
};
