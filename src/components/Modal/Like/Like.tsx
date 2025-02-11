import { useState, useEffect, useRef } from "react";
import styles from "./Like.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { modalState } from "@/states/modalState";
import { useToast } from "@/utils/useToast";
import { FeedsLikeResponse, getFeedsLike } from "@/api/feeds/getFeedsIdLike";
import Loader from "@/components/Layout/Loader/Loader";

export default function Like() {
  const [data, setData] = useState<FeedsLikeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [, setModal] = useRecoilState(modalState);
  const route = useRouter();
  const toast = useToast();

  const handleClickUser = (id: string) => {
    route.push(`/users/${id}`);
    setModal({ isOpen: false, type: null, data: null });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!route.query.id) return;
        const id = String(route.query.id);
        const response = await getFeedsLike({ id });
        setData(response);
      } catch (error) {
        console.error("Error fetching like data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [route.query.id, toast]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>좋아요</div>
      <div className={styles.content}>
        <ul>
          {loading ? (
            <Loader />
          ) : data.length === 0 ? (
            <p className={styles.noData}>아직 좋아요가 없어요</p>
          ) : (
            data.map((like, index) => (
              <li key={index} className={styles.item}>
                {like.image !== "https://image.grimity.com/null" ? (
                  <Image
                    src={like.image}
                    width={50}
                    height={50}
                    onClick={() => handleClickUser(like.id)}
                    className={styles.image}
                    alt="프로필 이미지"
                  />
                ) : (
                  <Image
                    src="/image/default.svg"
                    width={50}
                    height={50}
                    onClick={() => handleClickUser(like.id)}
                    className={styles.image}
                    alt="프로필 이미지"
                  />
                )}
                {like.description !== "" ? (
                  <div className={styles.nameDescription} onClick={() => handleClickUser(like.id)}>
                    <p className={styles.name}>{like.name}</p>
                    <p className={styles.description}>{like.description}</p>
                  </div>
                ) : (
                  <div className={styles.nameContainer} onClick={() => handleClickUser(like.id)}>
                    <p className={styles.name}>{like.name}</p>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
        <div ref={observerRef} />
      </div>
    </div>
  );
}
