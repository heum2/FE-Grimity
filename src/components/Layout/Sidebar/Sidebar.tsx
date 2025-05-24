import { useRouter } from "next/router";

import { useAuthStore } from "@/states/authStore";
import { useDeviceStore } from "@/states/deviceStore";

import SidebarItem, { BaseIconName } from "@/components/Layout/Sidebar/SidebarItem/SidebarItem";
import FooterSection from "@/components/Layout/FooterSection/FooterSection";

import { useIsMobile } from "@/hooks/useIsMobile";

import { MENU_ITEMS } from "@/constants/menu";

import styles from "@/components/Layout/Sidebar/Sidebar.module.scss";

const Sidebar = () => {
  const { isLoggedIn } = useAuthStore((state) => state);
  const router = useRouter();
  const { isMobile } = useDeviceStore((state) => state);
  useIsMobile();

  const menuItems = isLoggedIn
    ? [...MENU_ITEMS, { icon: "following", label: "팔로잉", route: "following" }]
    : MENU_ITEMS;

  const handleItemClick = (route: string) => {
    router.push(`/${route}`);
  };

  const isItemActive = (route: string) => {
    const currentPath = router.pathname;

    if (route === "/" && currentPath === "/") return true;
    if (route === "popular" && currentPath === "/popular") return true;
    if (route === "board" && (currentPath === "/board" || currentPath.startsWith("/posts/")))
      return true;
    if (route === "following" && currentPath === "/following") return true;

    return false;
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
                onClick={() => handleItemClick(item.route)}
                isActive={isItemActive(item.route)}
              />
            ))}
          </div>

          <div className={styles.footer}>
            <FooterSection />
          </div>
        </nav>
      )}
    </>
  );
};

export default Sidebar;
