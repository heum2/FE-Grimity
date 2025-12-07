import { useEffect } from "react";
import { useRouter } from "next/router";

import IconComponent from "../Asset/Icon";
import styles from "./Toast.module.scss";
import { useToast } from "@/hooks/useToast";

interface ToastProps {
  target?: "global" | "local";
}

export default function Toast({ target }: ToastProps = {}) {
  const { toasts, removeToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      // Remove all toasts on route change
      toasts.forEach((toast) => {
        removeToast(toast.id);
      });
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [toasts, removeToast, router.events]);

  // Filter toasts by target container
  const filteredToasts = toasts.filter((t) => {
    if (target && t.container !== target) {
      return false;
    }
    return true;
  });

  if (filteredToasts.length === 0) return null;

  return (
    <>
      {filteredToasts.map((toast, index) => {
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

          const containerClass = toast.container === "global" ? styles.global : styles.local;

          // Calculate top position: base offset + (index * spacing)
          const baseOffset = toast.container === "global" ? 80 : 16; // Header height + padding for global, 16px for local
          const topPosition = baseOffset + (index * 80); // 80px spacing between toasts

          return (
            <div
              key={toast.id}
              className={`${styles.toast} ${containerClass} ${borderColor}`}
              style={{ top: `${topPosition}px` }}
            >
              <IconComponent name={toast.type} size={30} />
              {toast.message}
              <button
                className={styles.closeButton}
                onClick={() => removeToast(toast.id)}
                aria-label="Close toast"
              >
                ×
              </button>
            </div>
          );
        })}
    </>
  );
}
