import { useToast } from "@/hooks/useToast";
import styles from "./Contact.module.scss";
import { ContactProps } from "./Contact.types";
import IconComponent from "@/components/Asset/Icon";
import { useEffect, useRef } from "react";

export default function Contact({ onClose }: ContactProps) {
  const { showToast } = useToast();
  const email = "grimity.official@gmail.com";
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      showToast("이메일이 복사되었습니다!", "success");
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
      showToast("복사에 실패했습니다.", "success");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contact} ref={modalRef}>
        <section className={styles.topSection}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>문의하기</h2>
            <button className={styles.closeButton} onClick={onClose}>
              <IconComponent name="notiClose" size={24} isBtn padding={8} />
            </button>
          </div>
        </section>
        <section className={styles.content}>
          <div className={styles.option}>
            <label className={styles.label}>E-mail</label>
            <button onClick={copyToClipboard} className={styles.link}>
              {email}
            </button>
          </div>
          <div className={styles.option}>
            <label className={styles.label}>카카오톡 오픈채팅</label>
            <a
              href="https://open.kakao.com/o/sKYFewgh"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              https://open.kakao.com/o/sKYFewgh
            </a>
          </div>
        </section>
        <div className={styles.bar} />
        <section className={styles.footer}>
          <a
            href="https://term.grimity.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.subLink}
          >
            개인정보취급방침
          </a>
          <a
            href="https://term.grimity.com/term"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.subLink}
          >
            이용약관
          </a>
        </section>
      </div>
    </div>
  );
}
