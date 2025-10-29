import { useRouter } from "next/router";

import { useNavigationStore } from "@/states/navigationStore";

const useGoBack = (fallbackUrl: string = "/") => {
  const router = useRouter();

  const depth = useNavigationStore((state) => state.depth);

  const goBack = () => {
    if (depth === 0) {
      router.replace(fallbackUrl);
    } else {
      router.back();
    }
  };

  return { goBack };
};

export default useGoBack;
