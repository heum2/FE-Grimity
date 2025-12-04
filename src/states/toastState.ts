import { create } from "zustand";

type ToastType = "success" | "error" | "warning" | "information";

interface ToastState {
  message: string;
  type: ToastType;
  isShow: boolean;
  showToast: (message: string, type: ToastType, duration?: number | null) => void;
  removeToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  type: "success",
  isShow: false,

  showToast: (message, type, duration = 4000) => {
    set({ message, type, isShow: true });

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
