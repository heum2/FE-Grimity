import { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { usePostSearch } from "@/api/posts/getPostsSearch";
import { useMySavePost } from "@/api/users/getMeSavePosts";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/states/authStore";
import { useDeviceStore } from "@/states/deviceStore";
import { usePostsSaveMutation } from "@/queries/posts/usePostsSaveMutation";

import UserItem from "@/components/common/Cell/UserItem/UserItem";
import Empty from "@/components/common/Empty/Empty";
import SearchHighlightText from "@/components/SearchPage/SearchHighlightText/SearchHighlightText";
import Navigation from "@/components/common/Pagination/Navigation/Navigation";

import { formatCurrency } from "@/utils/formatCurrency";
import { timeAgo } from "@/utils/timeAgo";

import type { PostsResponse } from "@grimity/dto";

import styles from "./SearchPost.module.scss";

type PostType = "NORMAL" | "QUESTION" | "FEEDBACK" | "NOTICE";

type SearchPostItemData = PostsResponse["posts"][number] & { isSave?: boolean };

const POST_TYPE_LABEL: Record<PostType, string> = {
  NORMAL: "일반",
  QUESTION: "질문",
  FEEDBACK: "피드백",
  NOTICE: "공지",
};

const PAGE_SIZE = 10;
const SAVED_POSTS_LOOKUP_SIZE = 100;

const domParser = typeof window !== "undefined" ? new DOMParser() : null;

function plainPreviewFromContent(html: string | null | undefined): string | undefined {
  if (!html?.trim()) return undefined;
  const stripped = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!stripped) return undefined;
  if (!domParser) return stripped;
  return domParser.parseFromString(stripped, "text/html").documentElement.textContent ?? stripped;
}

type SearchPostItemProps = {
  post: SearchPostItemData;
  keyword: string;
  isLoggedIn: boolean;
  onBookmarkClick: (id: string, isSaved: boolean) => void;
};

function SearchPostItem({ post, keyword, isLoggedIn, onBookmarkClick }: SearchPostItemProps) {
  const router = useRouter();
  const preview = plainPreviewFromContent(post.content);
  const postType = post.type as PostType;
  const isSaved = post.isSave ?? false;

  const sharedProps = {
    className: styles.userItem,
    postTitle: <SearchHighlightText text={post.title} keyword={keyword} />,
    body: preview ? <SearchHighlightText text={preview} keyword={keyword} /> : undefined,
    commentCount: post.commentCount,
    tag: POST_TYPE_LABEL[postType],
    showTag: true,
    nickname: post.author?.name ?? undefined,
    viewCount: formatCurrency(post.viewCount),
    timeCount: timeAgo(post.createdAt),
  };

  if (isLoggedIn) {
    return (
      <UserItem
        type="bookMark"
        {...sharedProps}
        bookmarkActive={isSaved}
        onBookmarkClick={() => onBookmarkClick(post.id, isSaved)}
        onClick={() => router.push(`/posts/${post.id}`)}
      />
    );
  }

  return (
    <Link href={`/posts/${post.id}`} className={styles.cardLink}>
      <UserItem type="communityTitle" {...sharedProps} showTrailingDivider={false} />
    </Link>
  );
}

export default function SearchPost() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { showToast } = useToast();
  const { mutate: toggleSave } = usePostsSaveMutation();
  const keyword = typeof router.query.keyword === "string" ? router.query.keyword : "";
  const currentPage = Number(router.query.page) || 1;

  const { data, isLoading } = usePostSearch({
    searchBy: "combined",
    page: currentPage,
    size: PAGE_SIZE,
    keyword,
  });

  const { data: savedPostsData } = useMySavePost(
    { size: SAVED_POSTS_LOOKUP_SIZE, page: 1 },
    { enabled: isLoggedIn },
  );

  useGlobalLoading(isLoading);

  const savedPostIds = useMemo(
    () => new Set(savedPostsData?.posts.map((post) => post.id) ?? []),
    [savedPostsData],
  );

  const posts = useMemo(
    () =>
      (data?.posts ?? []).map((post) => ({
        ...post,
        isSave: (post as SearchPostItemData).isSave ?? savedPostIds.has(post.id),
      })),
    [data?.posts, savedPostIds],
  );

  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasResults = posts.length > 0;

  const handleBookmarkClick = (id: string, isSaved: boolean) => {
    toggleSave(
      { id, isSaved },
      {
        onError: () => {
          showToast("저장 처리 중 오류가 발생했습니다.", "error");
        },
      },
    );
  };

  const handlePageChange = (page: number) => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, page } },
      undefined,
      { shallow: true },
    );
  };

  if (isLoading) return null;

  return (
    <section className={styles.results}>
      {!hasResults ? (
        <Empty
          iconName="illust-result-null"
          size={isMobile ? "md" : "xl"}
          title="검색한 결과를 찾을 수 없어요"
          content="검색어의 단어 수를 줄이거나 다른 검색어로 검색해보세요."
        />
      ) : (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.id} className={styles.listItem}>
              <SearchPostItem
                post={post}
                keyword={keyword}
                isLoggedIn={isLoggedIn}
                onBookmarkClick={handleBookmarkClick}
              /> 
            </li>
          ))}
        </ul>
      )}

      {hasResults && totalPages > 1 && (
        <div className={styles.pagination}>
          <Navigation
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </section>
  );
}
