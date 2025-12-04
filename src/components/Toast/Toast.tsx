import { useEffect } from "react";
import { useRouter } from "next/router";

import IconComponent from "../Asset/Icon";
import styles from "./Toast.module.scss";
import { useToast } from "@/hooks/useToast";

interface ToastProps {
  target?: "global" | "local";
}

export default function Toast({ target }: ToastProps = {}) {
  const { toast, removeToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      if (toast.isShow) {
        removeToast();
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [toast.isShow, removeToast, router.events]);

  if (!toast.isShow) return null;

  if (target && toast.container !== target) {
    return null;
  }

  const containerClass = toast.container === "global" ? styles.global : styles.local;

  let borderColor = "";

  switch (toast.type) {
    case "success":
      borderColor = styles.success;
      break;
    case "error":
      borderColor = styles.error;
      break;
    case "warning":
      borderColor = styles.warning;
      break;
    case "information":
      borderColor = styles.information;
      break;
    default:
      borderColor = "";
  }

  return (
    <div className={`${styles.toast} ${containerClass} ${borderColor}`}>
      <IconComponent name={toast.type} size={30} />
      {toast.message}
    </div>
  );
}
