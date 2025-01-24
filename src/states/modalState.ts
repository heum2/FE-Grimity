import { atom } from "recoil";

export type ModalType = "LOGIN" | "NICKNAME";

export interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  data?: any;
}

export const modalState = atom<ModalState>({
  key: "modalState",
  default: { isOpen: false, type: null, data: null },
});
