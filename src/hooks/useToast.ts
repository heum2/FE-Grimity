import { useToastStore } from "@/states/toastState";

export function useToast() {
  const { toasts, showToast, removeToast } = useToastStore();

  return { toasts, showToast, removeToast };
}
