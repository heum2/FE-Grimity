import { ReactNode } from "react";

export interface ToastProps {
  children: ReactNode;
  type: "success" | "error" | null;
}
