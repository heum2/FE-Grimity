import { create } from "zustand";

type ToastType = "success" | "error" | "warning" | "information";

interface ToastState {
  message: string;
  type: ToastType;
  isShow: boolean;
  showToast: (message: string, type: ToastType) => void;
  removeToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  type: "success",
  isShow: false,

  showToast: (message, type) => {
    set({ message, type, isShow: true });
    setTimeout(() => {
      set((state) => ({ ...state, isShow: false }));
    }, 4000);
  },

  removeToast: () => {
    set((state) => ({ ...state, isShow: false }));
  },
}));
