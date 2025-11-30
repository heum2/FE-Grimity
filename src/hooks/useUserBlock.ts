import { useToast } from "@/hooks/useToast";
import { useEffect } from "react";

const useUserBlock = (isBlocked?: boolean) => {
  const { showToast } = useToast();

  useEffect(() => {
    if (isBlocked) {
      showToast("차단당한 계정입니다.", "warning");
    }
  }, [isBlocked]);
};

export default useUserBlock;
