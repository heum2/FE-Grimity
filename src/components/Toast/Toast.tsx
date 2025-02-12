import styles from "./Toast.module.scss";
import { useToast } from "@/hooks/useToast";
import Image from "next/image";

export default function Toast() {
  const { toast } = useToast();

  if (!toast.isShow) return null;

  let borderColor = "";
  let iconPath = "";

  switch (toast.type) {
    case "success":
      borderColor = styles.success;
      iconPath = "/icon/toast-success.svg";
      break;
    case "error":
      borderColor = styles.error;
      iconPath = "/icon/toast-error.svg";
      break;
    case "warning":
      borderColor = styles.warning;
      iconPath = "/icon/toast-warning.svg";
      break;
    case "information":
      borderColor = styles.information;
      iconPath = "/icon/toast-information.svg";
      break;
    default:
      borderColor = "";
      iconPath = "";
  }

  return (
    <div className={`${styles.toast} ${borderColor}`}>
      <Image src={iconPath} alt={toast.type} width={30} height={30} />
      {toast.message}
    </div>
  );
}
