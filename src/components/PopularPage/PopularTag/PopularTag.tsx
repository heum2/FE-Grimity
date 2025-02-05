import { useTagsPopular } from "@/api/tags/getTagsPopular";
import styles from "./PopularTag.module.scss";
import Title from "@/components/Layout/Title/Title";
import Loader from "@/components/Layout/Loader/Loader";
import Tag from "./Tag/Tag";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

export default function PopularTag() {
  const { data, isLoading } = useTagsPopular();
  const containerRef = useRef<HTMLDivElement>(null);

  // 가로 스크롤 시 세로 스크롤 막기
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const isScrollable = container.scrollWidth > container.clientWidth;

    if (!isScrollable) return;

    e.preventDefault();
    container.scrollLeft += e.deltaY;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <Title>인기 태그</Title>
      <div className={styles.cardContainer} ref={containerRef}>
        {data?.map((tag) => (
          <div key={tag.tagName} className={styles.slide}>
            <Link href={`/search?tab=feed&keyword=${tag.tagName}`}>
              <Tag tagName={tag.tagName} thumbnail={tag.thumbnail} />
            </Link>
          </div>
        ))}
      </div>
      <div className={styles.lastGradient} />
    </div>
  );
}
