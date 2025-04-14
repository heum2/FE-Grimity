import { useState } from "react";
import styles from "./SidebarItem.module.scss";
import IconComponent from "@/components/Asset/Icon";
import { ICONS } from "@/constants/asset";

type BaseIconName = "home" | "popular" | "board";

type IconName = `${BaseIconName}` | `${BaseIconName}Hover` | `${BaseIconName}Active`;

interface SidebarItemProps {
  icon: BaseIconName;
  label: string;
  onClick: () => void;
  isActive: boolean;
}

const SidebarItem = ({ icon, label, onClick, isActive }: SidebarItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIconName = (): IconName => {
    if (isActive) return `${icon}Active`;
    if (isHovered) return `${icon}Hover`;
    return icon;
  };

  const currentIconName = getIconName();

  if (!ICONS[currentIconName as keyof typeof ICONS]) {
    return null;
  }

  return (
    <div
      className={`${styles.sidebarItem} ${isActive ? styles.active : ""}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.wrapper}>
        <div className={styles.icon}>
          <IconComponent name={currentIconName as keyof typeof ICONS} size={19} padding={8} isBtn />
        </div>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
};

export default SidebarItem;
export type { BaseIconName };
