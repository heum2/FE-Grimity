import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import postRegister from "@/api/auth/postRegister";

import { useModalStore } from "@/states/modalStore";
import { useAuthStore } from "@/states/authStore";

import Button from "@/components/Button/Button";
import TextField from "@/components/TextField/TextField";

import { useToast } from "@/hooks/useToast";

import { isValidProfileIdFormat, isForbiddenProfileId } from "@/utils/isValidProfileId";

import styles from "./ProfileId.module.scss";

export default function ProfileId() {
  const [profileId, setProfileId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setUserId = useAuthStore((state) => state.setUserId);

  const modal = useModalStore();
  const openModal = useModalStore((state) => state.openModal);
  const { showToast } = useToast();

  const { mutateAsync: register } = useMutation({
    mutationFn: postRegister,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setIsLoggedIn(true);
      setUserId(data.id);

      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken || "");
      localStorage.setItem("user_id", data.id);
      openModal({ type: "JOIN", data: null });
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!profileId.trim()) {
      setErrorMessage("프로필 URL을 입력해주세요.");
      return;
    }

    const profileIdTrimmed = profileId.trim();
    if (!isValidProfileIdFormat(profileIdTrimmed)) {
      setErrorMessage("숫자, 영문(소문자), 언더바(_)만 입력 가능합니다.");
      return;
    }

    if (isForbiddenProfileId(profileIdTrimmed)) {
      setErrorMessage("사용할 수 없는 ID입니다.");
      return;
    }

    if (!modal.data || !modal.data.accessToken || !modal.data.provider || !modal.data.nickname) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
      return;
    }

    await register({
      provider: modal.data.provider,
      providerAccessToken: modal.data.accessToken,
      name: modal.data.nickname,
      url: profileId.trim(),
    });
  };

  const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>프로필 URL을 정해주세요</h2>
        <p className={styles.subtitle}>단 하나뿐인 프로필 주소로 사용되어요</p>
      </div>
      <div className={styles.textBtnContainer}>
        <div className={styles.textContainer}>
          <h6 className={styles.h6}>www.grimity.com/</h6>
          <TextField
            placeholder="숫자, 영문(소문자), 언더바(_)"
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
            onKeyDown={handleEnterKeyDown}
            isError={!!errorMessage}
            errorMessage={errorMessage}
          />
          <Button size="l" type="filled-primary" disabled={!profileId} onClick={handleSubmit}>
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
