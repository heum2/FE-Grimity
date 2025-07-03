import { useEffect, PropsWithChildren } from "react";

import { useRouter } from "next/router";

import { useAuthStore } from "@/states/authStore";
import { useModalStore } from "@/states/modalStore";

import Loader from "@/components/Layout/Loader/Loader";

export default function AuthLayout({ children }: PropsWithChildren) {
  const router = useRouter();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const openModal = useModalStore((state) => state.openModal);

  useEffect(() => {
    if (isAuthReady && !isLoggedIn) {
      openModal({ type: "LOGIN" });
      router.push("/");
    }
  }, [isAuthReady, isLoggedIn, openModal, router]);

  if (!isAuthReady || !isLoggedIn) {
    return <Loader />;
  }

  return children;
}
