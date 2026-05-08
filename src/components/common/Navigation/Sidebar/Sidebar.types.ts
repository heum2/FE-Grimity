 export interface SidebarProps {
  className?: string;
  onClose?: () => void;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  user?: { username: string; avatarSrc?: string };
  profileActiveItem?: "liked" | "saved";
  onProfileLikedClick?: () => void;
  onProfileSavedClick?: () => void;
}
