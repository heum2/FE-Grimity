import { ReactNode } from "react";

export interface MenuItem {
  label: string;
  onClick: () => void;
  isDelete?: boolean;
}

export interface DropdownProps {
  menuItems: MenuItem[];
  trigger: ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
  isTopItem?: boolean;
  isSide?: boolean;
}
