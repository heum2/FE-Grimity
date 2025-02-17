import { useMySavePost } from "@/api/users/getMeSavePosts";
import styles from "./SavedPosts.module.scss";
import AllCard from "@/components/Board/BoardAll/AllCard/AllCard";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loader from "@/components/Layout/Loader/Loader";
import Button from "@/components/Button/Button";
import Link from "next/link";

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
  const totalPages = Math.ceil((data?.totalCount || 1) / 10);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page },
    });
  };

  const getPageRange = (currentPage: number, totalPages: number) => {
    let start = Math.max(1, currentPage - 4);
    let end = Math.min(start + 9, totalPages);

    if (end === totalPages) {
      start = Math.max(1, end - 9);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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
      {posts.length > 0 && (
        <section
          className={`${styles.pagination} ${posts.length === 0 ? styles.paginationDisabled : ""}`}
        >
          <button
            className={styles.paginationArrow}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Image src="/icon/pagination-left.svg" width={24} height={24} alt="Previous" />
          </button>
          {getPageRange(currentPage, totalPages).map((pageNum) => (
            <button
              key={pageNum}
              className={currentPage === pageNum ? styles.active : ""}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}
          <button
            className={styles.paginationArrow}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Image src="/icon/pagination-right.svg" width={24} height={24} alt="Next" />
          </button>
        </section>
      )}
    </>
  );
}
