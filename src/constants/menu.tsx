import { BaseIconName } from "@/components/Layout/Sidebar/SidebarItem/SidebarItem";
import { PATH_ROUTES } from "@/constants/routes";

export interface MenuItem {
  icon: BaseIconName;
  label: string;
  route: string;
}

export const MENU_ITEMS: MenuItem[] = [
  { icon: "home", label: "홈", route: PATH_ROUTES.HOME },
  { icon: "ranking", label: "랭킹", route: PATH_ROUTES.RANKING },
  { icon: "board", label: "자유\n게시판", route: PATH_ROUTES.BOARD },
];
