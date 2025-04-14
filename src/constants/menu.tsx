import { BaseIconName } from "@/components/Layout/Sidebar/SidebarItem/SidebarItem";

export interface MenuItem {
  icon: BaseIconName;
  label: string;
  route: string;
}

export const MENU_ITEMS: MenuItem[] = [
  { icon: "home", label: "홈", route: "home" },
  { icon: "popular", label: "인기그림", route: "popular" },
  { icon: "board", label: "자유게시판", route: "board" },
];
