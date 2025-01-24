import { atom } from "recoil";

export const toastState = atom<{
  message: string;
  type: "success" | "error" | "warning" | "information";
  isShow: boolean;
}>({
  key: "toastAtom",
  default: {
    message: "",
    type: "success",
    isShow: false,
  },
});
