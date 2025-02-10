import { useRouter } from "next/router";
import styles from "./BoardAll.module.scss";
import Title from "@/components/Layout/Title/Title";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";
import AllCard from "./AllCard/AllCard";
import { useEffect, useState } from "react";
import { getPostsLatest, PostsLatest } from "@/api/posts/getPosts";
import { useRecoilValue } from "recoil";
import { authState } from "@/states/authState";
import { BoardAllProps } from "./BoardAll.types";

export default function BoardAll({ isDetail }: BoardAllProps) {
  const { isLoggedIn } = useRecoilValue(authState);
  const [posts, setPosts] = useState<PostsLatest[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();
  const { query } = router;
  const currentType = (query.type as string)?.toLowerCase() || "all";
  const currentPage = Number(query.page) || 1;
  const totalPages = Math.ceil(totalCount / 10);

  useEffect(() => {
    async function fetchPosts() {
      const response = await getPostsLatest({
        type: currentType as "all" | "question" | "feedback",
        page: currentPage,
        size: 10,
      });
      setPosts(response.posts);
      setTotalCount(response.totalCount);
    }
    fetchPosts();
  }, [currentType, currentPage]);

  const handleTabChange = (type: "all" | "question" | "feedback") => {
    router.push({ query: { ...query, type: type.toLowerCase(), page: 1 } });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push({ query: { ...query, page } });
    }
  };

  return (
    <div className={styles.container}>
      {isDetail ? <Title>자유게시판 최신글</Title> : <Title>전체 글</Title>}
      {!isDetail && (
        <section className={styles.types}>
          <button
            className={`${styles.type} ${currentType === "all" ? styles.active : ""}`}
            onClick={() => handleTabChange("all")}
          >
            전체
          </button>
          <Image src="/icon/dot.svg" width={3} height={3} alt="" />
          <button
            className={`${styles.type} ${currentType === "question" ? styles.active : ""}`}
            onClick={() => handleTabChange("question")}
          >
            질문
          </button>
          <Image src="/icon/dot.svg" width={3} height={3} alt="" />
          <button
            className={`${styles.type} ${currentType === "feedback" ? styles.active : ""}`}
            onClick={() => handleTabChange("feedback")}
          >
            피드백
          </button>
        </section>
      )}
      <section className={styles.cards}>
        {posts.map((post) => (
          <AllCard key={post.id} post={post} />
        ))}
      </section>
      {isLoggedIn && !isDetail && (
        <section className={styles.uploadBtn}>
          <Link href="/board/write">
            <Button
              size="l"
              type="outlined-assistive"
              leftIcon={<IconComponent name="writePost" width={20} height={20} />}
            >
              글쓰기
            </Button>
          </Link>
        </section>
      )}
      <section className={`${styles.pagination} ${isDetail ? styles.paginationDetail : ""}`}>
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
          disabled={currentPage === totalPages}
        >
          <Image src="/icon/pagination-right.svg" width={24} height={24} alt="" />
        </button>
      </section>
    </div>
  );
}
