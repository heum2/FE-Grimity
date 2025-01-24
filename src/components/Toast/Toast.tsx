import styles from "./Toast.module.scss";
import IconComponent from "../Asset/Icon";
import { useToast } from "@/utils/useToast";

export default function Toast() {
  const { toast } = useToast();

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
      <IconComponent name={toast.type} width={30} height={30} />
      {toast.message}
    </div>
  );
}
