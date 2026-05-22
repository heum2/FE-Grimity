export type ToastType = "Positive" | "Negative" | "Cautionary" | "Info" | "Default";

export interface ToastProps {
  type?: ToastType;
  text: string;
  duration?: number | null;
  onClose?: () => void;
  className?: string;
}
