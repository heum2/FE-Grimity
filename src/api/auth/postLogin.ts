import axiosInstance from "@/constants/baseurl";

export enum AuthProvider {
  GOOGLE = "GOOGLE",
  KAKAO = "KAKAO",
}

interface LoginRequest {
  provider: AuthProvider;
  providerAccessToken: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
}

const postLogin = async ({ provider, providerAccessToken }: LoginRequest) => {
  const response = await axiosInstance.post<LoginResponse>("/auth/login", {
    provider,
    providerAccessToken,
  });

  return response.data;
};

export type { LoginResponse };
export default postLogin;
