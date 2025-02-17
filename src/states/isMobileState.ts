import { atom } from "recoil";

export const isMobileState = atom({
  key: "isMobileState",
  default: false,
});

export const isTabletState = atom({
  key: "isTabletState",
  default: false,
});
