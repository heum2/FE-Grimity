import clsx from "clsx";

import PageLoading from "@/components/common/Loading/PageLoading/PageLoading";
import styles from "./Loader.module.scss";

interface LoaderProps {
  dimmed?: boolean;
}

export default function Loader({ dimmed = true }: LoaderProps) {
  return (
    <div className={clsx(styles.overlay, !dimmed && styles.noDim)}>
      <PageLoading />
    </div>
  );
}
