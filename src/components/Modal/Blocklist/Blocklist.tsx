import { useDeviceStore } from "@/states/deviceStore";

import Button from "@/components/Button/Button";
import Icon from "@/components/Asset/IconTemp";

import { useGetMyBlockings } from "@/api/me/getMyBlockings";
import { useDeleteUserBlock } from "@/api/users/deleteUserBlock";

import { useToast } from "@/hooks/useToast";

import styles from "./Blocklist.module.scss";

interface BlocklistProps {
  close: () => void;
}

export default function Blocklist({ close }: BlocklistProps) {
  const { isMobile } = useDeviceStore();
  const { data: blockingsData, refetch } = useGetMyBlockings();
  const { mutate: unblockUser } = useDeleteUserBlock();
  const { showToast } = useToast();

  const handleUnblock = (userId: string, userName: string) => {
    unblockUser(
      { id: userId },
      {
        onSuccess: () => {
          showToast(`${userName}님을 차단 해제했습니다.`, "success");
          refetch();
        },
        onError: () => {
          showToast("차단 해제 중 오류가 발생했습니다.", "error");
        },
      },
    );
  };

  return (
    <div className={styles.container}>
      {!isMobile && (
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>차단 목록</h2>
          <button className={styles.closeButton} onClick={close}>
            <Icon icon="close" size="xl" />
          </button>
        </div>
      )}
      <div className={styles.blocklistContainer}>
        {blockingsData && blockingsData.users.length > 0 ? (
          blockingsData.users.map((user) => (
            <div key={user.id} className={styles.blockItem}>
              <div className={styles.profile}>
                <img
                  src={user.image || "/image/default.svg"}
                  alt={user.name}
                  className={styles.profileImage}
                />
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                </div>
              </div>

              <Button
                type="outlined-assistive"
                size="s"
                onClick={() => handleUnblock(user.id, user.name)}
              >
                차단 해제
              </Button>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>차단한 사용자가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
