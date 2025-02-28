import styles from "./Login.module.scss";
import { useRecoilState } from "recoil";
import { useMutation } from "react-query";
import { authState } from "@/states/authState";
import { modalState } from "@/states/modalState";
import { useGoogleLogin } from "@react-oauth/google";
import { useToast } from "@/hooks/useToast";
import IconComponent from "@/components/Asset/Icon";
import axiosInstance from "@/api/auth/axiosInstance";
import { AxiosError } from "axios";

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

type LoginType = "GOOGLE" | "KAKAO";

export default function Login() {
  const APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
  const [, setAuth] = useRecoilState(authState);
  const [, setModal] = useRecoilState(modalState);
  const { showToast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async ({
      provider,
      providerAccessToken,
    }: {
      provider: LoginType;
      providerAccessToken: string;
    }) => {
      const response = await axiosInstance.post("/auth/login", {
        provider,
        providerAccessToken,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setAuth({
        access_token: data.accessToken,
        isLoggedIn: true,
        user_id: data.id,
      });

      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken);
      console.log(data);
      console.log("Access Token:", localStorage.getItem("access_token"));
      console.log("Refresh Token:", localStorage.getItem("refresh_token"));
    },
    onError: () => {
      showToast("로그인 실패", "error");
    },
  });

  const handleKaKaoLogin = async () => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(APP_KEY);
    }

    window.Kakao.Auth.login({
      success: async (authObj: AuthObj) => {
        try {
          await loginMutation.mutateAsync({
            provider: "KAKAO",
            providerAccessToken: authObj.access_token,
          });
        } catch (error: any) {
          if (error.response?.status === 404) {
            setModal({
              isOpen: true,
              type: "NICKNAME",
              data: { accessToken: authObj.access_token, provider: "KAKAO" },
            });
          } else {
            console.error("카카오 로그인 실패", error);
          }
        }
      },
      fail: (err: ErrorResponse) => {
        console.error("카카오 로그인 실패:", err);
      },
    });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await loginMutation.mutateAsync({
          provider: "GOOGLE",
          providerAccessToken: tokenResponse.access_token,
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            setModal({
              isOpen: true,
              type: "NICKNAME",
              data: { accessToken: tokenResponse.access_token, provider: "GOOGLE" },
            });
          } else {
            console.error("구글 로그인 실패", error);
          }
        } else {
          console.error("구글 로그인 실패", error);
        }
      }
    },
    onError: () => {
      console.error("구글 로그인 실패");
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.messageContainer}>
        <img src="/image/logo.svg" width={120} height={34} alt="logo" loading="lazy" />
        <p className={styles.text}>그리미티에 가입 후 나의 그림을 뽐내보세요</p>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.kakaoButton} onClick={handleKaKaoLogin}>
          <IconComponent name="kakao" width={24} height={24} alt="logo" />
          카카오로 계속하기
        </button>
        <button className={styles.googleButton} onClick={() => googleLogin()}>
          <IconComponent name="google" width={20} height={20} alt="logo" />
          구글로 계속하기
        </button>
      </div>
    </div>
  );
}
