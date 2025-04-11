import { useModalStore } from "@/states/modalStore";
import IconComponent from "@/components/Asset/Icon";
import { ShareBtnProps } from "./ShareBtn.types";

export default function ShareBtn({ feedId, title, image }: ShareBtnProps) {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpenShareModal = () => {
    openModal({
      type: "SHARE",
      data: { feedId, title, image },
    });
  };

  return (
    <div onClick={handleOpenShareModal}>
      <IconComponent name="share" size={24} padding={8} isBtn />
    </div>
  );
}
