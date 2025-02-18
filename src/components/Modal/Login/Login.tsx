import BASE_URL from "@/constants/baseurl";
import styles from "./Login.module.scss";
import { useRecoilState } from "recoil";
import { useMutation } from "react-query";
import { authState } from "@/states/authState";
import { modalState } from "@/states/modalState";
import { useGoogleLogin } from "@react-oauth/google";
import { useToast } from "@/hooks/useToast";
import IconComponent from "@/components/Asset/Icon";
import { useRouter } from "next/router";

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
  const route = useRouter();

  const loginMutation = useMutation({
    mutationFn: async ({
      provider,
      providerAccessToken,
    }: {
      provider: LoginType;
      providerAccessToken: string;
    }) => {
      const response = await BASE_URL.post("/auth/login", {
        provider: provider,
        providerAccessToken: providerAccessToken,
      });
      return { ...response.data };
    },
    onSuccess: (data) => {
      setAuth({
        access_token: data.accessToken,
        isLoggedIn: true,
        user_id: data.id,
      });

      setModal({ isOpen: false, type: null, data: null });
      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("user_id", data.id);
    },
    onError: (error: ErrorResponse) => {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    },
  });

  const handleKaKaoLogin = async () => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(APP_KEY);
    }

    window.Kakao.Auth.login({
      success: async (authObj: AuthObj) => {
        try {
          // 로그인 요청을 시도
          const response = await BASE_URL.post("/auth/login", {
            provider: "KAKAO",
            providerAccessToken: authObj.access_token,
          });

          // 로그인 성공
          loginMutation.mutate({
            provider: "KAKAO",
            providerAccessToken: authObj.access_token,
          });
        } catch (error: any) {
          // 404 에러 발생시 회원가입 처리
          if (error.response?.status === 404) {
            setModal({
              isOpen: true,
              type: "NICKNAME",
              data: { accessToken: authObj.access_token, provider: "KAKAO" },
            });
          } else {
            console.error("로그인 실패");
          }
        }
      },
      fail: (err: ErrorResponse) => {
        console.error("로그인 실패:", err);
      },
    });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await BASE_URL.post("/auth/login", {
          provider: "GOOGLE",
          providerAccessToken: tokenResponse.access_token,
        })
          .then((response) => {
            loginMutation.mutate({
              provider: "GOOGLE",
              providerAccessToken: tokenResponse.access_token,
            });
          })
          .catch((error) => {
            if (error.response?.status === 404) {
              setModal({
                isOpen: true,
                type: "NICKNAME",
                data: { accessToken: tokenResponse.access_token, provider: "GOOGLE" },
              });
            } else {
              console.error("Google 로그인 처리 중 오류 발생");
            }
          });
      } catch (error) {
        console.error("Google 로그인 처리 중 오류 발생:", error);
      }
    },
    onError: () => {
      console.error("Google 로그인 실패");
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
