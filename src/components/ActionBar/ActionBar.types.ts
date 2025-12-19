import { MenuItem } from "@/components/Dropdown/Dropdown.types";
import { ICONS } from "@/constants/asset";

export interface ActionBarConfig {
  like: {
    isLiked: boolean;
    count: number;
    iconNameOn: keyof typeof ICONS;
    iconNameOff: keyof typeof ICONS;
    onToggle: () => Promise<void> | void;
    allowSelfLike?: boolean;
  };
  save: {
    isSaved: boolean;
    iconNameOn: keyof typeof ICONS;
    iconNameOff: keyof typeof ICONS;
    onToggle: () => Promise<void> | void;
  };
  dropdown: {
    menuItems: MenuItem[];
    isMobile?: boolean;
  };
}

export interface ActionBarProps {
  config: ActionBarConfig;
  isAuthor?: boolean;
  className?: string;
}
