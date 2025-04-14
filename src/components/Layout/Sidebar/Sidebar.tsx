import { useState } from "react";
import { useRouter } from "next/router";
import SidebarItem, { BaseIconName } from "./SidebarItem/SidebarItem";
import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const menuItems: { icon: BaseIconName; label: string; route: string }[] = [
    { icon: "home", label: "홈", route: "home" },
    { icon: "popular", label: "인기그림", route: "popular" },
    { icon: "board", label: "자유게시판", route: "board" },
    { icon: "following", label: "팔로잉", route: "following" },
  ];

  const handleItemClick = (index: number, route: string) => {
    setActiveIndex(index);
    router.push(`/${route}`);
  };

  return (
    <div className={styles.container}>
      {menuItems.map((item, index) => (
        <SidebarItem
          key={index}
          icon={item.icon}
          label={item.label}
          onClick={() => handleItemClick(index, item.route)}
          isActive={activeIndex === index}
        />
      ))}
    </div>
  );
};

export default Sidebar;
