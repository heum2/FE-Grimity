import { useState, useRef, useCallback, useEffect } from "react";

export interface UseProfileCardHoverReturn {
  triggerProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
  popoverProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    position: { top: number; left: number };
    placement: "top" | "bottom";
  };
  isOpen: boolean;
  targetRef: React.RefObject<HTMLElement | null>;
}

export function useProfileCardHover(authorUrl?: string): UseProfileCardHoverReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const targetRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringTrigger = useRef(false);
  const isHoveringPopover = useRef(false);

  const calculatePosition = useCallback(() => {
    if (!targetRef.current) return;

    const rect = targetRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const popoverHeight = 320; // 예상 팝오버 높이
    const popoverWidth = 280; // 프로필 카드 너비

    // 위/아래 위치 계산
    const shouldPlaceBelow = spaceBelow >= popoverHeight || spaceBelow > spaceAbove;

    // 좌우 위치 계산
    let leftPosition = rect.left + window.scrollX;
    const spaceRight = viewportWidth - rect.left;
    const spaceLeft = rect.left;

    // 오른쪽 공간이 부족하면 오른쪽 정렬
    if (spaceRight < popoverWidth && spaceLeft >= popoverWidth) {
      leftPosition = rect.right + window.scrollX - popoverWidth;
    }
    // 양쪽 공간 모두 부족하면 화면 중앙에 배치
    else if (spaceRight < popoverWidth && spaceLeft < popoverWidth) {
      leftPosition = Math.max(10, (viewportWidth - popoverWidth) / 2) + window.scrollX;
    }

    setPlacement(shouldPlaceBelow ? "bottom" : "top");
    setPosition({
      top: shouldPlaceBelow ? rect.bottom + window.scrollY : rect.top + window.scrollY,
      left: leftPosition,
    });
  }, []);

  const handleOpen = useCallback(() => {
    if (!authorUrl) return;

    calculatePosition();
    setIsOpen(true);
  }, [authorUrl, calculatePosition]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleTriggerMouseEnter = useCallback(() => {
    isHoveringTrigger.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (isHoveringTrigger.current) {
        handleOpen();
      }
    }, 300);
  }, [handleOpen]);

  const handleTriggerMouseLeave = useCallback(() => {
    isHoveringTrigger.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // 팝오버로 이동할 시간을 주기 위해 짧은 딜레이 추가
    timeoutRef.current = setTimeout(() => {
      if (!isHoveringPopover.current && !isHoveringTrigger.current) {
        handleClose();
      }
    }, 100);
  }, [handleClose]);

  const handlePopoverMouseEnter = useCallback(() => {
    isHoveringPopover.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handlePopoverMouseLeave = useCallback(() => {
    isHoveringPopover.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (!isHoveringTrigger.current && !isHoveringPopover.current) {
        handleClose();
      }
    }, 100);
  }, [handleClose]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    triggerProps: {
      onMouseEnter: handleTriggerMouseEnter,
      onMouseLeave: handleTriggerMouseLeave,
    },
    popoverProps: {
      onMouseEnter: handlePopoverMouseEnter,
      onMouseLeave: handlePopoverMouseLeave,
      position,
      placement,
    },
    isOpen,
    targetRef,
  };
}
