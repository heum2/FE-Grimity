import { useRouter } from "next/router";
import styles from "./SearchPost.module.scss";
import Loader from "@/components/Layout/Loader/Loader";
import { usePostSearch } from "@/api/posts/getPostsSearch";
import AllCard from "@/components/Board/BoardAll/AllCard/AllCard";
import Image from "next/image";

export default function SearchPost() {
  const router = useRouter();
  const { query } = router;
  const keyword = query.keyword as string;
  const currentPage = Number(query.page) || 1;

  const { data, isLoading } = usePostSearch({
    searchBy: "combined",
    page: currentPage,
    size: 10,
    keyword: keyword,
  });

  const posts = data?.posts || [];
  const totalPages = Math.ceil((data?.totalCount ? Number(data.totalCount) : 0) / 10);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push({ query: { ...query, page } });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <section className={styles.results}>
        {posts.length === 0 ? (
          <div className={styles.noResult}>
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className={styles.cards}>
            {posts.map((post) => (
              <AllCard key={post.id} post={post} case="board" />
            ))}
          </div>
        )}
      </section>
      {totalPages > 1 && posts.length > 0 && (
        <section className={styles.pagination}>
          <button
            className={styles.paginationArrow}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Image src="/icon/pagination-left.svg" width={24} height={24} alt="" />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? styles.active : ""}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={styles.paginationArrow}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || posts.length === 0}
          >
            <Image src="/icon/pagination-right.svg" width={24} height={24} alt="" />
          </button>
        </section>
      )}
    </>
  );
}
