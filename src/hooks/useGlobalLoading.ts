import { useEffect } from "react";
import { useLoadingStore } from "@/states/loadingStore";

export function useGlobalLoading(isLoading: boolean) {
  const show = useLoadingStore((s) => s.show);
  const hide = useLoadingStore((s) => s.hide);

  useEffect(() => {
    if (isLoading) {
      show();
      return () => hide();
    }
  }, [isLoading, show, hide]);
}
