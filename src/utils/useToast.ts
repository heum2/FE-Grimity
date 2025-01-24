import { toastState } from "@/states/toastState";
import { useRecoilState } from "recoil";

export function useToast() {
  const [toast, setToast] = useRecoilState(toastState);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, isShow: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isShow: false }));
    }, 4000);
  };

  const removeToast = () => {
    setToast((prev) => ({ ...prev, isShow: false }));
  };

  return { toast, showToast, removeToast };
}
