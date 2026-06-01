import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

import { useMySavePost } from "@/api/users/getMeSavePosts";
import { deletePostsSave } from "@/api/posts/putDeletePostsIdSave";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { useToast } from "@/hooks/useToast";

import Empty from "@/components/common/Empty/Empty";
import UserItem from "@/components/common/Cell/UserItem/UserItem";
import Pagination from "@/components/Pagination";

import { PATH_ROUTES } from "@/constants/routes";
import { timeAgo } from "@/utils/timeAgo";

import styles from "./SavedPosts.module.scss";

const PAGE_SIZE = 10;

const POST_TYPE_LABEL: Record<string, string> = {
  QUESTION: "질문",
  FEEDBACK: "피드백",
  NOTICE: "공지",
  NORMAL: "일반",
};

export default function SavedPosts() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const currentPage = Number(router.query.page) || 1;
  const { data, isLoading } = useMySavePost({ size: PAGE_SIZE, page: currentPage });

  useGlobalLoading(isLoading);

  // page 쿼리 없으면 page=1로 보정
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.page) return;
    router.replace(
      { pathname: router.pathname, query: { ...router.query, page: 1 } },
      undefined,
      { shallow: true },
    );
  }, [router.isReady, router.pathname, router.query.page]);

  const posts = data?.posts ?? [];
  const totalPages = Math.ceil((data?.totalCount ?? 0) / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push({ pathname: router.pathname, query: { ...router.query, page } });
  };

  const handleUnsave = async (e: React.MouseEvent | undefined, id: string) => {
    e?.preventDefault();
    e?.stopPropagation();
    try {
      await deletePostsSave(id);
      queryClient.invalidateQueries({ queryKey: ["MySavePost"] });
    } catch {
      showToast("저장 해제 중 오류가 발생했습니다.", "error");
    }
  };

  if (isLoading) return null;

  if (posts.length === 0) {
    return (
      <div className={styles.emptyWrap}>
        <Empty
          iconName="illust-result-null"
          title="저장한 글이 없어요"
          buttonLabel="자유게시판 둘러보기"
          onButtonClick={() => router.push(PATH_ROUTES.BOARD)}
        />
      </div>
    );
  }

  return (
    <>
      <section className={styles.list}>
        {posts.map((post) => (
          <Link key={post.id} href={`${PATH_ROUTES.POST}/${post.id}`} className={styles.itemLink}>
            <UserItem
              type="bookMark"
              showTag
              tag={POST_TYPE_LABEL[post.type] ?? POST_TYPE_LABEL.NORMAL}
              postTitle={post.title}
              body={post.content}
              commentCount={post.commentCount}
              nickname={post.author?.name ?? ""}
              viewCount={post.viewCount.toString()}
              timeCount={timeAgo(post.createdAt)}
              bookmarkActive
              onBookmarkClick={(e?: React.MouseEvent) => handleUnsave(e, post.id)}
            />
          </Link>
        ))}
      </section>
      <section className={styles.pagination}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          postsLength={posts.length}
          onPageChange={handlePageChange}
        />
      </section>
    </>
  );
}
