import { useEffect, RefObject, CSSProperties } from "react";

interface DragScrollOptions {
  preventScrollbar?: boolean;
  scrollSpeed?: number;
}

export function useDragScroll(ref: RefObject<HTMLElement>, options: DragScrollOptions = {}) {
  const { preventScrollbar = true, scrollSpeed = 2 } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 스크롤바 스타일 조정
    if (preventScrollbar) {
      (element.style as CSSProperties).msOverflowStyle = "none"; // IE/Edge
      element.style.scrollbarWidth = "none"; // Firefox
    }

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      element.scrollLeft += e.deltaY;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      element.classList.add("active");
      startX = e.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      element.classList.remove("active");
    };

    const handleMouseUp = () => {
      isDown = false;
      element.classList.remove("active");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX) * scrollSpeed;
      element.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDown = true;
      startX = e.touches[0].pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - element.offsetLeft;
      const walk = (x - startX) * scrollSpeed;
      element.scrollLeft = scrollLeft - walk;
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchend", handleMouseUp);
    element.addEventListener("touchmove", handleTouchMove);

    return () => {
      element.removeEventListener("wheel", handleWheel);
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleMouseUp);
      element.removeEventListener("touchmove", handleTouchMove);
    };
  }, [ref, preventScrollbar, scrollSpeed]);
}
