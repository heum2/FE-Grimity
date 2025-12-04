import { useToastStore } from "@/states/toastState";

export function useToast() {
  const { message, type, isShow, container, showToast, removeToast } =
    useToastStore();

  return { toast: { message, type, isShow, container }, showToast, removeToast };
}
