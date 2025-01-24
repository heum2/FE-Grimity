import BASE_URL from "@/constants/baseurl";
import styles from "./Nickname.module.scss";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "@/states/modalState";
import { useMutation } from "react-query";
import TextField from "@/components/TextField/TextField";
import IconComponent from "@/components/Asset/Icon";
import Button from "@/components/Button/Button";
import router from "next/router";
import { authState } from "@/states/authState";
import { useToast } from "@/utils/useToast";

export default function Nickname() {
  const [nickname, setNickname] = useState("");
  const [agree, setAgree] = useState(false);
  const [isError, setIsError] = useState(false);
  const [, setAuth] = useRecoilState(authState);
  const [, setModal] = useRecoilState(modalState);
  const modal = useRecoilState(modalState);
  const { showToast } = useToast();

  const registerMutation = useMutation({
    mutationFn: async (data: { provider: string; providerAccessToken: string; name: string }) => {
      const response = await BASE_URL.post("/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      setModal({ isOpen: false, type: null, data: null });
      setAuth({
        access_token: data.accessToken,
        isLoggedIn: true,
        user_id: data.id,
      });
      router.push("/");
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        setIsError(true);
      } else {
        showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
      }
    },
  });

  const handleSubmit = () => {
    const { accessToken, provider } = modal[0].data;
    registerMutation.mutate({
      provider: provider,
      providerAccessToken: accessToken,
      name: nickname.trim(),
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>닉네임을 설정할게요</h2>
        <p className={styles.subtitle}>닉네임이 곧 작가 이름이에요!</p>
      </div>
      <div className={styles.textBtnContainer}>
        <div className={styles.textContainer}>
          <TextField
            placeholder="프로필에 노출될 닉네임을 입력해주세요."
            errorMessage="중복된 닉네임입니다."
            maxLength={12}
            value={nickname}
            onChange={(e) => setNickname(e.target.value.trimStart())}
            isError={isError}
          />
          <label className={styles.label}>
            <div className={styles.checkbox} onClick={() => setAgree(!agree)}>
              <IconComponent
                name={agree ? "checkedbox" : "checkbox"}
                width={24}
                height={24}
                isBtn
              />
            </div>
            <span className={styles.text}>
              <a
                href="https://fate-hockey-867.notion.site/181da304f34381d886f0fb6772f9fd24"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.underline}
              >
                서비스이용약관
              </a>{" "}
              과{" "}
              <a
                href="https://fate-hockey-867.notion.site/181da304f343814e99dcf9baef9723f4"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.underline}
              >
                개인정보취급방침
              </a>{" "}
              에 동의합니다.
            </span>
          </label>
        </div>
        <Button
          size="l"
          type="filled-primary"
          disabled={!nickname || !agree}
          onClick={handleSubmit}
        >
          설정 완료
        </Button>
      </div>
    </div>
  );
}
