import { CreateFeedRequest } from "@/api/feeds/postFeeds";

export interface FeedData {
  title: string;
  content: string;
  tags: string[];
  images: { name: string; originalName: string; url: string }[];
  thumbnailName: string;
  thumbnailUrl: string;
  albumId: string | null;
  albumName: string;
}
export interface FeedFormProps {
  isEditMode: boolean;
  initialValues?: Partial<FeedData>;
  onSubmit: (data: CreateFeedRequest) => void;
  isLoading: boolean;
}
