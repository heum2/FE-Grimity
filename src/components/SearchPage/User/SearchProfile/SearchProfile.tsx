import Link from "next/link";
import { useRouter } from "next/router";

import { useAuthStore } from "@/states/authStore";
import { usePutFollow } from "@/api/users/putIdFollow";
import { useDeleteFollow } from "@/api/users/deleteIdFollow";
import { useToast } from "@/hooks/useToast";

import UserCard from "@/components/common/Card/User/User";
import SearchHighlightText from "@/components/SearchPage/SearchHighlightText/SearchHighlightText";

import type { SearchedUserResponse } from "@grimity/dto";

import styles from "./SearchProfile.module.scss";

export default function SearchProfile({
  id,
  url,
  name,
  image,
  description,
  backgroundImage,
  followerCount,
  isFollowing,
}: SearchedUserResponse) {
  const router = useRouter();
  const keyword = typeof router.query.keyword === "string" ? router.query.keyword : "";
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { showToast } = useToast();

  const { mutateAsync: putFollow } = usePutFollow();
  const { mutateAsync: deleteFollow } = useDeleteFollow();

  const handleFollowClick = async () => {
    if (!isLoggedIn) {
      showToast("로그인이 필요합니다.", "warning");
      return;
    }

    try {
      if (isFollowing) {
        await deleteFollow({ id });
      } else {
        await putFollow({ id });
      }
    } catch {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  return (
    <Link href={`/${url}`} className={styles.cardLink}>
      <UserCard
        variant="search"
        className={styles.card}
        avatarUrl={image ?? undefined}
        bannerUrl={backgroundImage ?? undefined}
        nickname={<SearchHighlightText text={name} keyword={keyword} />}
        followerCount={followerCount}
        isFollowing={isFollowing}
        onFollowClick={handleFollowClick}
        content={
          description ? (
            <SearchHighlightText text={description} keyword={keyword} />
          ) : undefined
        }
      />
    </Link>
  );
}
