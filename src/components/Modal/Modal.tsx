import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "./Modal.module.scss";
import { useModalStore } from "@/states/modalStore";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import IconComponent from "../Asset/Icon";
import Button from "../Button/Button";
import Login from "./Login/Login";
import Nickname from "./Nickname/Nickname";
import ProfileId from "./ProfileId/ProfileId";
import Join from "./Join/Join";
import ProfileEdit from "./ProfileEdit/ProfileEdit";
import Background from "./Background/Background";
import Follow from "./Follow/Follow";
import Share from "./Share/Share";
import UploadModal from "./Upload/Upload";
import SharePost from "./SharePost/SharePost";
import Like from "./Like/Like";
import Report from "./Report/Report";
import Album from "./Album/Album";
import AlbumSelect from "./AlbumSelect/AlbumSelect";

export default function Modal() {
  const router = useRouter();
  const { isOpen, type, data, isFill, isComfirm, onClick, openModal, closeModal } = useModalStore();

  usePreventScroll(isOpen);

  useEffect(() => {
    if (isOpen && isFill) {
      window.history.pushState({ isModalOpen: true }, "", window.location.href);
    }

    const handlePopState = () => {
      closeModal();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen, isFill, closeModal]);

  useEffect(() => {
    const handleRouteChange = () => {
      closeModal();
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, closeModal]);

  const handleCloseModal = () => {
    closeModal();
  };

  const renderModalContent = () => {
    switch (type) {
      case "LOGIN":
        return <Login />;
      case "NICKNAME":
        return <Nickname />;
      case "PROFILE-ID":
        return <ProfileId />;
      case "JOIN":
        return <Join />;
      case "PROFILE-EDIT":
        return <ProfileEdit />;
      case "BACKGROUND":
        return <Background imageSrc={data?.imageSrc} file={data?.file} />;
      case "FOLLOWER":
        return <Follow initialTab="follower" />;
      case "FOLLOWING":
        return <Follow initialTab="following" />;
      case "SHARE":
        return <Share {...data} />;
      case "SHAREPOST":
        return <SharePost {...data} />;
      case "UPLOAD":
        return <UploadModal {...data} />;
      case "LIKE":
        return <Like />;
      case "REPORT":
        return <Report {...data} />;
      case "ALBUM":
        return <Album {...data} />;
      case "ALBUM-SELECT":
        return <AlbumSelect {...data} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {!isFill ? (
        <div className={styles.overlay} onClick={handleCloseModal}>
          {isComfirm ? (
            <div className={styles.comfirmModal}>
              <div className={styles.titleContainer}>
                <h2 className={styles.title}>{data?.title}</h2>
                {data?.subtitle && <p className={styles.subtitle}>{data.subtitle}</p>}
              </div>
              <div className={styles.btnsContainer}>
                <Button size="l" type="outlined-assistive" onClick={handleCloseModal}>
                  취소
                </Button>
                <Button size="l" type="filled-primary" onClick={data?.onClick}>
                  {data?.confirmBtn}
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={
                type === "PROFILE-EDIT" || type == "ALBUM"
                  ? styles.profileEditModal
                  : type === "FOLLOWER" || type === "FOLLOWING" || type === "LIKE"
                  ? styles.followModal
                  : type == "ALBUM-SELECT"
                  ? styles.albumSelectModal
                  : styles.modal
              }
              onClick={(e) => e.stopPropagation()}
            >
              {renderModalContent()}
              {!data?.hideCloseButton && (
                <button className={styles.closeButton} onClick={handleCloseModal}>
                  <IconComponent name="x" size={24} isBtn />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.fill} onClick={(e) => e.stopPropagation()}>
          {renderModalContent()}
        </div>
      )}
    </>
  );
}
