import { useState } from "react";
import { useRouter } from "next/router";
import SidebarItem, { BaseIconName } from "./SidebarItem/SidebarItem";
import SidebarFooterItem, { FooterIconName } from "./SidebarFooterItem/SidebarFooterItem";
import styles from "./Sidebar.module.scss";
import { MENU_ITEMS } from "@/constants/menu";
import { FOOTER_ITEMS } from "@/constants/footer";
import { useAuthStore } from "@/states/authStore";
import { useMyData } from "@/api/users/getMe";
import { useDeviceStore } from "@/states/deviceStore";
import { useIsMobile } from "@/hooks/useIsMobile";

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { isLoggedIn } = useAuthStore((state) => state);
  const { data: myData } = useMyData();
  const router = useRouter();
  const { isMobile } = useDeviceStore((state) => state);
  useIsMobile();

  const menuItems = isLoggedIn
    ? [...MENU_ITEMS, { icon: "following", label: "팔로잉", route: "following" }]
    : MENU_ITEMS;

  const footerItems = FOOTER_ITEMS;

  const handleItemClick = (index: number, route: string) => {
    setActiveIndex(index);
    router.push(`/${route}`);
  };

  const handleFooterClick = (itemIcon: FooterIconName, route?: string) => {
    if (route) {
      router.push(route);
    } else if (itemIcon === "ask") {
      alert("문의 클릭");
    }
  };

  return (
    <>
      {!isMobile && (
        <nav className={styles.container}>
          <div className={styles.menu}>
            {menuItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon as BaseIconName}
                label={item.label}
                onClick={() => handleItemClick(index, item.route)}
                isActive={activeIndex === index}
              />
            ))}
          </div>
          <div className={styles.footer}>
            {footerItems.map((item, index) => (
              <SidebarFooterItem
                key={index}
                icon={item.icon as FooterIconName}
                label={item.label}
                onClickItem={() => {
                  handleFooterClick(item.icon, item.route);
                }}
                isHaveDropdown={item.isHaveDropdown}
              />
            ))}
            <div className={styles.subLink}>
              <a
                href="https://nostalgic-patch-498.notion.site/1930ac6bf29881b9aa19ff623c69b8e6?pvs=74"
                target="_blank"
                rel="noopener noreferrer"
              >
                개인정보취급방침
              </a>
              <a
                href="https://nostalgic-patch-498.notion.site/1930ac6bf29881e9a3e4c405e7f49f2b?pvs=73"
                target="_blank"
                rel="noopener noreferrer"
              >
                이용약관
              </a>
            </div>
            <p className={styles.copy}>© Grimity. All rights reserved.</p>
          </div>
        </nav>
      )}
    </>
  );
};

export default Sidebar;
