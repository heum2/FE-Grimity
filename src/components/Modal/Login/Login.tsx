import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";

import postLogin, { AuthProvider } from "@/api/auth/postLogin";

import { useAuthStore } from "@/states/authStore";
import { useModalStore } from "@/states/modalStore";

import IconComponent from "@/components/Asset/Icon";

import { useToast } from "@/hooks/useToast";

import styles from "./Login.module.scss";

interface LoginProps {
  close: () => void;
}

interface AuthObj {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  token_type: string;
}

interface ErrorResponse {
  error: string;
  error_description: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
}

export default function Login({ close }: LoginProps) {
  const APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setUserId = useAuthStore((state) => state.setUserId);
  const openModal = useModalStore((state) => state.openModal);
  const { showToast } = useToast();

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: postLogin,
    onSuccess: (data: LoginResponse) => {
      setAccessToken(data.accessToken);
      setIsLoggedIn(true);
      setUserId(data.id);
      close();
      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken);
      localStorage.setItem("user_id", data.id);
    },
  });

  const handleKaKaoLogin = async () => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(APP_KEY);
    }

    window.Kakao.Auth.login({
      success: async (authObj: AuthObj) => {
        try {
          await login({
            provider: AuthProvider.KAKAO,
            providerAccessToken: authObj.access_token,
          });
        } catch (error) {
          if (error instanceof AxiosError && error.response?.status === 404) {
            openModal({
              type: "NICKNAME",
              data: { accessToken: authObj.access_token, provider: "KAKAO" },
            });
          } else {
            console.error("카카오 로그인 실패", error);
            showToast("로그인 실패", "error");
          }
        }
      },
      fail: (err: ErrorResponse) => {
        console.error("카카오 로그인 실패:", err);
        showToast("로그인에 실패했습니다. 다시 시도해주세요.", "error");
      },
    });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await login({
          provider: AuthProvider.GOOGLE,
          providerAccessToken: tokenResponse.access_token,
        });
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          openModal({
            type: "NICKNAME",
            data: { accessToken: tokenResponse.access_token, provider: "GOOGLE" },
          });
        } else {
          console.error("구글 로그인 실패", error);
          showToast("로그인에 실패했습니다. 다시 시도해주세요.", "error");
        }
      }
    },
    onError: () => {
      console.error("구글 로그인 실패");
      showToast("로그인에 실패했습니다. 다시 시도해주세요.", "error");
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.messageContainer}>
        <img src="/image/logo.svg" width={120} height={34} alt="logo" loading="lazy" />
        <p className={styles.text}>그리미티에 가입 후 나의 그림을 뽐내보세요</p>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.kakaoButton} onClick={handleKaKaoLogin} disabled={isPending}>
          <IconComponent name="kakao" size={24} />
          {isPending ? "로그인 중..." : "카카오로 계속하기"}
        </button>
        <button className={styles.googleButton} onClick={() => googleLogin()} disabled={isPending}>
          <IconComponent name="google" size={20} />
          {isPending ? "로그인 중..." : "구글로 계속하기"}
        </button>
      </div>
    </div>
  );
}
