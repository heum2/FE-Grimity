import { useEffect, useState } from "react";
import { usePopular } from "@/api/users/getPopular";
import styles from "./PopularUser.module.scss";
import Title from "@/components/Layout/Title/Title";
import Loader from "@/components/Layout/Loader/Loader";
import { Swiper, SwiperSlide } from "swiper/react";
import User from "./User/User";

export default function PopularUser() {
  const { data, isLoading } = usePopular();
  const [randomUsers, setRandomUsers] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const randomData = [...data].sort(() => Math.random() - 0.5).slice(0, 5);
      setRandomUsers(randomData);
    }
  }, [data]);

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <Title>인기 유저</Title>
      <div className={styles.cardContainer}>
        <Swiper spaceBetween={16} slidesPerView="auto" grabCursor={true} className={styles.swiper}>
          {randomUsers.map((user) => (
            <SwiperSlide key={user.id} className={styles.slide}>
              <User
                id={user.id}
                name={user.name}
                image={user.image}
                followerCount={user.followerCount}
                isFollowing={user.isFollowing}
                thumbnails={user.thumbnails}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.lastGradient} />
    </div>
  );
}
