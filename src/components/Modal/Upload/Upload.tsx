import { useToast } from "@/hooks/useToast";
import styles from "./Upload.module.scss";
import { modalState } from "@/states/modalState";
import { useRecoilState, useRecoilValue } from "recoil";
import Button from "@/components/Button/Button";
import { UploadModalProps } from "./Upload.types";
import { isMobileState } from "@/states/isMobileState";
import { serviceUrl } from "@/constants/serviceurl";
import IconComponent from "@/components/Asset/Icon";

export default function UploadModal({ feedId, title, image }: UploadModalProps) {
  const { showToast } = useToast();
  const [, setModal] = useRecoilState(modalState);
  const url = `${serviceUrl}feeds/${feedId}`;
  const isMobile = useRecoilValue(isMobileState);

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

  const handleTwitterShare = () => {
    const text = "제가 그린 그림을 봐주세요!";
    window.open("https://twitter.com/intent/tweet?text=" + text + "&url=" + url);
  };

  const handleClose = () => {
    setModal({ isOpen: false, type: null, data: null, isComfirm: false });
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageContainer}>
        <img src="/image/confetti.svg" width={96} height={96} alt="" loading="lazy" />
        <div className={styles.texts}>
          <p className={styles.text}>그림 업로드가 완료되었어요</p>
          <p className={styles.subtext}>업로드 소식을 공유해보세요</p>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          size="l"
          type="outlined-assistive"
          onClick={copyToClipboard}
          leftIcon={<IconComponent name="copy" size={20} />}
        >
          링크 복사하기
        </Button>
        <div className={styles.sns}>
          <Button
            size="l"
            type="outlined-assistive"
            onClick={handleTwitterShare}
            leftIcon={<IconComponent name="twitter" size={20} />}
          >
            {isMobile ? "트위터 공유" : "트위터에 공유"}
          </Button>
          <Button
            size="l"
            type="outlined-assistive"
            onClick={handleKaKaoShare}
            leftIcon={<IconComponent name="kakaotalk" size={20} />}
          >
            {isMobile ? "카톡 공유" : "카톡으로 공유"}
          </Button>
        </div>
      </div>
      <Button size="l" type="filled-primary" onClick={handleClose}>
        업로드 된 그림 보기
      </Button>
    </div>
  );
}
