import { useEffect, PropsWithChildren } from "react";

import { useRouter } from "next/router";

import { useAuthStore } from "@/states/authStore";

import { useModal } from "@/hooks/useModal";

import Loader from "@/components/Layout/Loader/Loader";
import Login from "@/components/Modal/Login/Login";

export default function AuthLayout({ children }: PropsWithChildren) {
  const router = useRouter();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);

  const { openModal } = useModal();

  useEffect(() => {
    if (isAuthReady && !isLoggedIn) {
      openModal((close) => <Login close={close} />);
      router.push("/");
    }
  }, [isAuthReady, isLoggedIn, openModal, router]);

  if (!isAuthReady || !isLoggedIn) {
    return <Loader />;
  }

  return children;
}
