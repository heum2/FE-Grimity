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
            <div className={styles.backgroundDefaultImage}>
              <div className={styles.backgroundAddMessage}>
                <IconComponent name="addCover" width={20} height={20} isBtn />
                커버 추가하기
              </div>
            </div>
          )}
          <section
            className={
              userData.backgroundImage !== "https://image.grimity.com/null"
                ? styles.infoContainer
                : styles.infoContainerDefault
            }
          >
            {userData.image !== "https://image.grimity.com/null" ? (
              <Image
                src={userData.image}
                width={96}
                height={96}
                alt="프로필 이미지"
                className={styles.profileImage}
              />
            ) : (
              <Image
                src="/image/default.svg"
                width={96}
                height={96}
                alt="프로필 이미지"
                className={styles.profileImage}
              />
            )}
            <div className={styles.spaceBetween}>
              <div className={styles.leftContainer}>
                <div className={styles.topContainer}>
                  <h2 className={styles.name}>{userData.name}</h2>
                </div>
                <div className={styles.follow}>
                  <div className={styles.follower}>
                    팔로워
                    <p className={styles.followerColor}>{formatCurrency(userData.followerCount)}</p>
                  </div>
                  <div className={styles.follower}>
                    팔로잉
                    <p className={styles.followerColor}>
                      {formatCurrency(userData.followingCount)}
                    </p>
                  </div>
                </div>
                <div className={styles.descriptionContainer}>
                  <p className={styles.description}>{userData.description}</p>
                  <div className={styles.linkContainer}>
                    {userData.links.map(({ linkName, link }, index) => (
                      <div key={index} className={styles.linkWrapper}>
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
              </div>
              <div className={styles.followEdit}>
                {isLoggedIn ? (
                  isMyProfile ? (
                    <Link href="/profile-edit">
                      <Button size="l" type="outlined-assistive">
                        프로필 편집
                      </Button>
                    </Link>
                  ) : userData.isFollowing ? (
                    <Button size="l" type="outlined-assistive" onClick={handleUnfollowClick}>
                      언 팔로우
                    </Button>
                  ) : (
                    <Button size="l" type="outlined-assistive" onClick={handleFollowClick}>
                      팔로우
                    </Button>
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
