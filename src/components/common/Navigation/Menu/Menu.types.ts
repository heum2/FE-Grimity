export interface MenuItem {
  label: string;
  onClick?: () => void;
  /** 아이템 하단에 구분선 표시 여부 */
  borderBottom?: boolean;
  /** 선택된 항목 (체크 표시) */
  selected?: boolean;
  /** 삭제/신고 등 위험한 동작 (텍스트 강조 색상) */
  danger?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
  trigger?: React.ReactNode;
  align?: "left" | "right";
  /** Menu 패널(`ul`)에 적용 */
  className?: string;
  /** wrapper div에 적용 */
  wrapperClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}
