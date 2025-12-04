import { useEffect } from "react";
import { useRouter } from "next/router";

import IconComponent from "../Asset/Icon";
import styles from "./Toast.module.scss";
import { useToast } from "@/hooks/useToast";

export default function Toast() {
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
    <div className={`${styles.toast} ${borderColor}`}>
      <IconComponent name={toast.type} size={30} />
      {toast.message}
    </div>
  );
}
