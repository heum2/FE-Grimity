import { Draggable } from "@hello-pangea/dnd";
import { DraggableImageProps } from "./DraggableImage.types";
import styles from "./DraggableImage.module.scss";
import { useState } from "react";
import { isMobileState } from "@/states/isMobileState";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useRecoilValue } from "recoil";
import IconComponent from "@/components/Asset/Icon";

export default function DraggableImage({
  image,
  index,
  name,
  removeImage,
  isThumbnail,
  onThumbnailSelect,
}: DraggableImageProps) {
  const isMobile = useRecoilValue(isMobileState);
  useIsMobile();
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <Draggable draggableId={image.name} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={styles.imageWrapper}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.5 : 1,
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform} scale(1.05)`
              : provided.draggableProps.style?.transform,
          }}
        >
          {isLoading && (
            <div className={styles.loading}>
              <p className={styles.loadingMsg}>이미지를 업로드 중이에요</p>
              <span className={styles.loader}></span>
            </div>
          )}
          <div className={`${styles.imageContainer} ${isLoading ? styles.hidden : ""}`}>
            <div className={styles.thumbnail} onClick={onThumbnailSelect}>
              <img
                src={isThumbnail ? "/icon/thumbnail-on.svg" : "/icon/thumbnail-off.svg"}
                width={67}
                height={32}
                alt="사진 썸네일 지정"
                loading="lazy"
              />
            </div>
            <img
              src={image.url}
              width={240}
              height={240}
              loading="lazy"
              alt="Uploaded"
              className={styles.image}
              onLoad={handleImageLoad}
              {...provided.dragHandleProps}
            />
            <div className={styles.removeImage} onClick={() => removeImage(index)}>
              <IconComponent name="uploadDeleteImage" size={40} />
            </div>
            {!isMobile && <p className={styles.fileName}>{name}</p>}
          </div>
        </div>
      )}
    </Draggable>
  );
}
