import { useRecoilState } from "recoil";
import { modalState } from "@/states/modalState";
import IconComponent from "@/components/Asset/Icon";
import { ShareBtnProps } from "./ShareBtn.types";

export default function ShareBtn({ postId, title }: ShareBtnProps) {
  const [, setModal] = useRecoilState(modalState);

  const handleOpenShareModal = () => {
    setModal({
      isOpen: true,
      type: "SHAREPOST",
      data: { postId, title },
    });
  };

  return (
    <div onClick={handleOpenShareModal}>
      <IconComponent name="share" width={24} height={24} padding={8} isBtn />
    </div>
  );
}
