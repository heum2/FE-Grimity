import Link from "next/link";
import styles from "./Profile.module.scss";
import Button from "../../Button/Button";
import { useMyData } from "@/api/users/getMe";
import Image from "next/image";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRecoilValue } from "recoil";
import { ProfileProps } from "./Profile.types";
import { useUserData } from "@/api/users/getId";
import { deleteFollow } from "@/api/users/deleteIdFollow";
import { putFollow } from "@/api/users/putIdFollow";
import { useToast } from "@/utils/useToast";
import { authState } from "@/states/authState";
import IconComponent from "@/components/Asset/Icon";

export default function Profile({ isMyProfile, id }: ProfileProps) {
  const { isLoggedIn } = useRecoilValue(authState);
  const { data: myData } = useMyData();
  const { data: userData, refetch: refetchUserData } = useUserData(id);
  const { showToast } = useToast();

  const handleFollowClick = async () => {
    try {
      await putFollow(id);
      refetchUserData();
    } catch (error) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  const handleUnfollowClick = async () => {
    try {
      await deleteFollow(id);
      refetchUserData();
    } catch (error) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  return (
    <div className={styles.container}>
      {userData && (
        <>
          {userData.backgroundImage !== "https://image.grimity.com/null" ? (
            <Image
              src={userData.backgroundImage}
              width={70}
              height={70}
              alt="backgroundImage"
              className={styles.backgroundImage}
            />
          ) : (
            <div className={styles.backgroundDefaultImage} />
          )}
          <section className={styles.infoContainer}>
            <div className={styles.leftContainer}>
              {userData.image !== "https://image.grimity.com/null" ? (
                <Image
                  src={userData.image}
                  width={70}
                  height={70}
                  alt="프로필 이미지"
                  className={styles.profileImage}
                />
              ) : (
                <Image
                  src="/image/default.svg"
                  width={70}
                  height={70}
                  alt="프로필 이미지"
                  className={styles.profileImage}
                />
              )}
              <div className={styles.topContainer}>
                <div className={styles.nameDate}>
                  <h2 className={styles.name}>{userData.name}</h2>
                  {myData && <p className={styles.date}>{userData.email}</p>}
                </div>
              </div>
              <div className={styles.follow}>
                <div className={styles.follower}>
                  팔로워
                  <p className={styles.followerColor}>{formatCurrency(userData.followerCount)}</p>
                </div>
                <div className={styles.follower}>
                  팔로잉
                  <p className={styles.followerColor}>{formatCurrency(userData.followingCount)}</p>
                </div>
              </div>
              <p className={styles.description}>{userData.description}</p>
              <div className={styles.linkContainer}>
                {userData.links.map(({ linkName, link }, index) => (
                  <div key={index}>
                    <IconComponent name="link" width={20} height={20} />
                    <a
                      href={link}
                      className={styles.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {linkName}
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.rightContainer}>
              <div className={styles.followEdit}>
                {isLoggedIn ? (
                  isMyProfile ? (
                    <Link href="/profile-edit">
                      <Button size="l" type="outlined-assistive">
                        프로필 편집
                      </Button>
                    </Link>
                  ) : userData.isFollowing ? (
                    <button className={styles.unfollowBtn} onClick={handleUnfollowClick}>
                      언 팔로우
                    </button>
                  ) : (
                    <button className={styles.followBtn} onClick={handleFollowClick}>
                      팔로우
                    </button>
                  )
                ) : null}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
