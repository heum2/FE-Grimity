export interface SearchProfileProps {
  id: string;
  url: string;
  name: string;
  image: string | null;
  description: string;
  backgroundImage: string | null;
  isFollowing: boolean;
  followerCount: number;
}
