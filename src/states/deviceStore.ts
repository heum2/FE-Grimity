import { create } from "zustand";

interface DeviceState {
  isMobile: boolean;
  isTablet: boolean;
  setIsMobile: (value: boolean) => void;
  setIsTablet: (value: boolean) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  isMobile: false,
  isTablet: false,
  setIsMobile: (value) => set({ isMobile: value }),
  setIsTablet: (value) => set({ isTablet: value }),
}));
