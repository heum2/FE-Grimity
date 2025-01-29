export interface DraggableImageProps {
  image: { name: string; url: string };
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  removeImage: (index: number) => void;
  isThumbnail: boolean;
  onThumbnailSelect: () => void;
  imageCount: number;
}
