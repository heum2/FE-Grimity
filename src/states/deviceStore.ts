import { create } from "zustand";

interface DeviceState {
  isMobile: boolean;
  isTablet: boolean;
  setDevice: (device: { isMobile: boolean; isTablet: boolean }) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  isMobile: false,
  isTablet: false,
  setDevice: (device) => set(device),
}));
