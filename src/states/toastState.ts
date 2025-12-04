import { create } from "zustand";

type ToastType = "success" | "error" | "warning" | "information";
type ToastContainer = "global" | "local";

interface ToastState {
  message: string;
  type: ToastType;
  isShow: boolean;
  container: ToastContainer;
  showToast: (
    message: string,
    type: ToastType,
    duration?: number | null,
    container?: ToastContainer
  ) => void;
  removeToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  type: "success",
  isShow: false,
  container: "global",

  showToast: (message, type, duration = 4000, container = "global") => {
    set({ message, type, isShow: true, container });

    if (duration !== null) {
      setTimeout(() => {
        set((state) => ({ ...state, isShow: false }));
      }, duration);
    }
  },

  removeToast: () => {
    set((state) => ({ ...state, isShow: false }));
  },
}));
