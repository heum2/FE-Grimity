import { create } from "zustand";

export type DeviceType = "mobile" | "tablet" | "desktop";

interface DeviceState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  setDevice: (device: {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    deviceType: DeviceType;
  }) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  deviceType: "desktop",
  setDevice: (device) => set(device),
}));
