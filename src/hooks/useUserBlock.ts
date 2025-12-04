import { useToast } from "@/hooks/useToast";
import { useEffect } from "react";

const useUserBlock = (isBlocked?: boolean, identifier?: string) => {
  const { showToast } = useToast();

  useEffect(() => {
    if (isBlocked) {
      showToast("차단당한 계정입니다.", "warning", null, "local");
    }
  }, [isBlocked, identifier, showToast]);
};

export default useUserBlock;
