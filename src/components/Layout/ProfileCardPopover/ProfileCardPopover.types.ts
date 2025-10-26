export interface ProfileCardPopoverProps {
  authorUrl: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  position: { top: number; left: number };
  placement: "top" | "bottom";
}
