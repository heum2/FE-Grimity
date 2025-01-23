export type ButtonType =
  | "filled-primary"
  | "outlined-primary"
  | "outlined-secondary"
  | "outlined-assistive"
  | "text-primary"
  | "text-assistive";

export type ButtonSize = "l" | "m" | "s";

export interface ButtonProps {
  children: React.ReactNode;
  type: ButtonType;
  size: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
