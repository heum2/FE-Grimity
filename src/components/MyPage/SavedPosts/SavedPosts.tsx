import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useMySavePost } from "@/api/users/getMeSavePosts";

import AllCard from "@/components/Board/BoardAll/AllCard/AllCard";
import Loader from "@/components/Layout/Loader/Loader";
import Button from "@/components/Button/Button";
import Pagination from "@/components/Pagination";

import styles from "./SavedPosts.module.scss";

export default function SavedPosts() {
  const router = useRouter();
  const currentPage = parseInt(router.query.page as string) || 1;

  const { data, isLoading, refetch } = useMySavePost({
    size: 10,
    page: currentPage,
  });
  const { pathname } = useRouter();
  useEffect(() => {
    refetch();
  }, [pathname]);
  const posts = data?.posts || [];
  const totalPages = Math.ceil((data?.totalCount || 0) / 10);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page },
    });
  };

  useEffect(() => {
    if (!router.query.page) {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, page: 1 },
      });
    }
  }, [router]);

  if (isLoading) return <Loader />;

  return (
    <>
      <section className={styles.cardContainer}>
        {posts.length > 0 ? (
          posts.map((post) => <AllCard key={post.id} post={post} case="saved-posts" hasChip />)
        ) : (
          <div className={styles.noResult}>
            아직 저장한 글이 없어요
            <Link href="/board">
              <Button size="m" type="filled-primary">
                자유게시판 둘러보기
              </Button>
            </Link>
          </div>
        )}
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
