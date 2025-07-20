import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  access_token: string;
  user_id: string;
  isAuthReady: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setAccessToken: (accessToken: string) => void;
  setUserId: (userId: string) => void;
  setIsAuthReady: (isAuthReady: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  access_token: "",
  user_id: "",
  isAuthReady: false,
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setAccessToken: (access_token) => set({ access_token }),
  setUserId: (user_id) => set({ user_id }),
  setIsAuthReady: (isAuthReady) => set({ isAuthReady }),
  clearAuth: () => set({ isLoggedIn: false, access_token: "", user_id: "", isAuthReady: true }),
}));
