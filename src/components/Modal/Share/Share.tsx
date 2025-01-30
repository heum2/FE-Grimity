import { useToast } from "@/utils/useToast";
import Image from "next/image";
import styles from "./Share.module.scss";
import { ShareBtnProps } from "@/components/Detail/ShareBtn/ShareBtn.types";
import { modalState } from "@/states/modalState";
import { useRecoilState } from "recoil";

export default function Share({ feedId, title, image }: ShareBtnProps) {
  const { showToast } = useToast();
  const [, setModal] = useRecoilState(modalState);
  const url = `https://www.grimity.com/feeds/${feedId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("클립보드에 복사되었습니다.", "success");
      setModal({ isOpen: false, type: null, data: null });
    } catch {
      showToast("클립보드 복사에 실패했습니다.", "error");
    }
  };

  const handleKaKaoShare = () => {
    if (!window.Kakao) {
      showToast("카카오톡 SDK가 로드되지 않았습니다.", "error");
      return;
    }

    const { Kakao } = window;
    if (!Kakao.isInitialized()) {
      Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
    }

    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "그림 커뮤니티 그리미티",
        description: title,
        imageUrl: image,
        link: { mobileWebUrl: url, webUrl: url },
      },
    });

    setModal({ isOpen: false, type: null, data: null });
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageContainer}>
        <Image src="/image/logo.svg" width={120} height={34} alt="logo" />
        <p className={styles.text}>그리미티의 그림을 공유해보세요!</p>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.kakaoButton} onClick={handleKaKaoShare}>
          <Image src="/icon/kakao.svg" width={24} height={24} alt="카카오톡 공유" />
          카카오톡 공유
        </button>
        <button className={styles.copyButton} onClick={copyToClipboard}>
          <Image src="/icon/copy.svg" width={18} height={18} alt="클립보드 복사" />
          클립보드 복사
        </button>
      </div>
    </div>
  );
}
