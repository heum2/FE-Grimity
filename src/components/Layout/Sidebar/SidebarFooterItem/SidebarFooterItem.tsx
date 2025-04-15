import { useState } from "react";
import styles from "./SidebarFooterItem.module.scss";
import IconComponent from "@/components/Asset/Icon";
import { ICONS } from "@/constants/asset";

type FooterIconName = "noti" | "ask";

interface SidebarFooterItemProps {
  icon: FooterIconName;
  label: string;
  onClickItem: () => void;
  isHaveDropdown: boolean;
}

const SidebarFooterItem = ({
  icon,
  label,
  onClickItem,
  isHaveDropdown,
}: SidebarFooterItemProps) => {
  if (!ICONS[icon as keyof typeof ICONS]) {
    return null;
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const HandleClickItem = (e: React.MouseEvent) => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className={styles.sidebarItem} onClick={onClickItem}>
      <div className={styles.wrapper}>
        <div className={styles.icon}>
          <IconComponent name={icon} size={15} padding={8} />
        </div>
        <span className={styles.label}>{label}</span>
        {isHaveDropdown && (
          <div className={styles.dropdownIcon}>
            <IconComponent
              name={isDropdownOpen ? "footerDropdownHover" : "footerDropdown"}
              size={10}
              padding={6}
              // isBtn
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarFooterItem;
export type { FooterIconName };
