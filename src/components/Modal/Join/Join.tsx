import styles from "./Join.module.scss";
import Button from "@/components/Button/Button";
import router from "next/router";
import Image from "next/image";
import { modalState } from "@/states/modalState";
import { useRecoilState } from "recoil";

export default function Join() {
  const [, setModal] = useRecoilState(modalState);

  const handleStart = () => {
    setModal({ isOpen: false, type: null, data: null });
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageSection}>
        <Image src="/image/confetti.svg" width={96} height={96} alt="confetti" />
        <h2 className={styles.title}>가입을 축하드려요!</h2>
        <p className={styles.subtitle}>마음껏 그림을 공유하고</p>
        <p className={styles.subtitle}>자유롭게 이야기를 나눠보세요</p>
      </div>
      <Button size="l" type="filled-primary" onClick={handleStart}>
        그리미티 시작하기
      </Button>
    </div>
  );
}
