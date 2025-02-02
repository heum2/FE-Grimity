import { PopularResponse } from "@/api/users/getPopular";
import styles from "./User.module.scss";
import Image from "next/image";
import Button from "@/components/Button/Button";
import Link from "next/link";

export default function User({
  id,
  name,
  image,
  followerCount,
  isFollowing,
  thumbnails,
}: PopularResponse) {
  return (
    <div className={styles.container}>
      <Link href={`/users/${id}`}>
        <div className={styles.imageWrapper}>
          {thumbnails[0] ? (
            <Image
              src={thumbnails[0]}
              width={150}
              height={150}
              alt="인기 유저 헤더 이미지"
              className={styles.backgroundLeft}
            />
          ) : (
            <Image
              src="/image/thumbnail.png"
              width={150}
              height={150}
              alt="인기 유저 헤더 이미지"
              className={styles.backgroundLeft}
            />
          )}
          {thumbnails[1] ? (
            <Image
              src={thumbnails[1]}
              width={150}
              height={150}
              alt="인기 유저 헤더 이미지"
              className={styles.backgroundRight}
            />
          ) : (
            <Image
              src="/image/thumbnail.png"
              width={150}
              height={150}
              alt="인기 유저 헤더 이미지"
              className={styles.backgroundRight}
            />
          )}
        </div>
      </Link>
      <div className={styles.profileWrapper}>
        <Link href={`/users/${id}`}>
          <div className={styles.profileLeft}>
            {image !== "https://image.grimity.com/null" ? (
              <Image
                src={image}
                width={50}
                height={50}
                alt="인기 유저 프로필 이미지"
                className={styles.profileImage}
              />
            ) : (
              <Image
                src="/image/default.svg"
                width={50}
                height={50}
                alt="인기 유저 프로필 이미지"
                className={styles.profileImage}
              />
            )}
            <div className={styles.nameContainer}>
              <p className={styles.name}>{name}</p>
              <div className={styles.follower}>
                팔로워<p className={styles.followerCount}>{followerCount}</p>
              </div>
            </div>
          </div>
        </Link>
        {isFollowing ? (
          <Button size="s" type="outlined-assistive">
            팔로잉
          </Button>
        ) : (
          <Button size="s" type="filled-primary">
            팔로우
          </Button>
        )}
      </div>
    </div>
  );
}
