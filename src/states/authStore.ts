import { create } from "zustand";

interface AuthState {
  access_token: string;
  isLoggedIn: boolean;
  user_id: string;
  isAuthReady: boolean;
  setAccessToken: (token: string) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setUserId: (id: string) => void;
  setIsAuthReady: (ready: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  access_token: "",
  isLoggedIn: false,
  user_id: "",
  isAuthReady: false,
  setAccessToken: (token) => set({ access_token: token }),
  setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
  setUserId: (id) => set({ user_id: id }),
  setIsAuthReady: (ready) => set({ isAuthReady: ready }),
  clearAuth: () => {
    set({ access_token: "", isLoggedIn: false, user_id: "", isAuthReady: true });
  },
}));
