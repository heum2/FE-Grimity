import { useToast } from "@/utils/useToast";
import styles from "./Toast.module.scss";
import IconComponent from "../Asset/Icon";

export default function Toast() {
  const { toast } = useToast();

  if (!toast.isShow) return null;

  return (
    <div className={styles.toast}>
      {toast.type === "success" ? (
        <IconComponent name="checkFull" width={24} height={24} />
      ) : (
        <IconComponent name="errorFull" width={24} height={24} />
      )}
      {toast.message}
    </div>
  );
}
