import { useModalStore } from "@/states/modalStore";
import IconComponent from "@/components/Asset/Icon";
import { ShareBtnProps } from "./ShareBtn.types";

export default function ShareBtn({ postId, title }: ShareBtnProps) {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpenShareModal = () => {
    openModal({
      type: "SHAREPOST",
      data: { postId, title },
    });
  };

  return (
    <div onClick={handleOpenShareModal}>
      <IconComponent name="share" size={24} padding={8} isBtn />
    </div>
  );
}
