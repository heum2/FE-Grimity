export interface DraggableImageProps {
  image: { name: string; url: string };
  index: number;
  name: string;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  removeImage: (index: number) => void;
  isThumbnail: boolean;
  onThumbnailSelect: () => void;
}
