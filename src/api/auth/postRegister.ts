import { AxiosError } from "axios";

import { AuthProvider } from "@/api/auth/postLogin";

import axiosInstance from "@/constants/baseurl";

import type { LoginResponse } from "@grimity/dto";

interface RegisterRequest {
  provider: AuthProvider;
  providerAccessToken: string;
  name: string;
  url: string;
}

const postRegister = async (data: RegisterRequest) => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/auth/register", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 409) {
        throw new Error("이미 사용 중인 프로필 url입니다.");
      } else if (error.response?.status === 400) {
        throw new Error("숫자, 영문(소문자), 언더바(_)만 입력 가능합니다.");
      }
    }
    throw new Error("오류가 발생했습니다. 다시 시도해주세요.");
  }
};

export default postRegister;
