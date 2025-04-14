import { useState } from "react";
import { useRouter } from "next/router";
import SidebarItem, { BaseIconName } from "./SidebarItem/SidebarItem";
import styles from "./Sidebar.module.scss";
import { MENU_ITEMS } from "@/constants/menu";
import { useAuthStore } from "@/states/authStore";
import { useMyData } from "@/api/users/getMe";

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { isLoggedIn } = useAuthStore((state) => state);
  const { data: myData } = useMyData();
  const router = useRouter();

  const menuItems = isLoggedIn
    ? [...MENU_ITEMS, { icon: "following", label: "팔로잉", route: "following" }]
    : MENU_ITEMS;

  const handleItemClick = (index: number, route: string) => {
    setActiveIndex(index);
    router.push(`/${route}`);
  };

  return (
    <div className={styles.container}>
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
  );
};

export default Sidebar;
