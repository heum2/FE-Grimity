import { useToastStore } from "@/states/toastState";

export function useToast() {
  const { message, type, isShow, showToast, removeToast } = useToastStore();

  return { toast: { message, type, isShow }, showToast, removeToast };
}
