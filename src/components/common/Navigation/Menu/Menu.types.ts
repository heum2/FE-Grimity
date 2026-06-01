export interface MenuItem {
  label: string;
  onClick?: () => void;
  /** 아이템 하단에 구분선 표시 여부 */
  borderBottom?: boolean;
  /** 선택된 항목 (체크 표시) */
  selected?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
  trigger?: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}
