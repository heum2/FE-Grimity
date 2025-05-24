import Icon from "@/components/Asset/IconTemp";

import styles from "@/components/Layout/Sidebar/SidebarFooterItem/SidebarFooterItem.module.scss";

type FooterIconName = "noti" | "ask";

interface SidebarFooterItemProps {
  icon: FooterIconName;
  label: string;
  onClickItem: () => void;
  isHaveDropdown: boolean;
  isDropdownOpen: boolean;
}

const SidebarFooterItem = ({
  icon,
  label,
  onClickItem,
  isHaveDropdown,
  isDropdownOpen,
}: SidebarFooterItemProps) => {
  return (
    <div className={styles.sidebarItem} onClick={onClickItem}>
      <div className={styles.wrapper}>
        <Icon icon={icon} className={styles.icon} />
        <span className={styles.label}>{label}</span>

        {isHaveDropdown && (
          <Icon
            icon="chevronDown"
            size="sm"
            className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.active : ""}`}
          />
        )}
      </div>
    </div>
  );
};

export default SidebarFooterItem;
export type { FooterIconName };
