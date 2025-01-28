import { useDrag, useDrop } from "react-dnd";
import { DraggableImageProps } from "./DraggableImage.types";
import Image from "next/image";
import styles from "./DraggableImage.module.scss";
import { useRef } from "react";

export default function DraggableImage({
  image,
  index,
  moveImage,
  removeImage,
  isThumbnail,
  onThumbnailSelect,
}: DraggableImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "IMAGE",
    item: { id: image.name, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "IMAGE",
    hover(item: { id: string; index: number }, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) return;

      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      className={styles.imageWrapper}
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? "scale(1.05)" : "none",
        transition: "transform 0.2s ease",
      }}
    >
      <div className={styles.moveImage} tabIndex={0}>
        <Image src="/icon/upload-move-image.svg" width={40} height={40} alt="사진 순서 변경" />
      </div>
      <div className={styles.thumbnail} tabIndex={0} onClick={onThumbnailSelect}>
        <Image
          src={isThumbnail ? "/icon/thumbnail-on.svg" : "/icon/thumbnail-off.svg"}
          width={67}
          height={32}
          alt="사진 썸네일 지정"
        />
      </div>
      <Image
        src={image.url}
        width={320}
        height={0}
        layout="intrinsic"
        alt="Uploaded"
        className={styles.image}
      />
      <div className={styles.removeImage} onClick={() => removeImage(index)} tabIndex={0}>
        <Image src="/icon/upload-delete-image.svg" width={40} height={40} alt="사진 제거" />
      </div>
    </div>
  );
}
