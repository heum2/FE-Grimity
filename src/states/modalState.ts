import { atom } from "recoil";

export type ModalType =
  | "LOGIN"
  | "NICKNAME"
  | "JOIN"
  | "PROFILE-EDIT"
  | "BACKGROUND"
  | "FOLLOWER"
  | "FOLLOWING"
  | "SHARE"
  | "SHAREPOST"
  | "UPLOAD";

export interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  data?: any;
  isComfirm?: boolean;
  onClick?: () => void | Promise<void>;
}

export const modalState = atom<ModalState>({
  key: "modalState",
  default: { isOpen: false, type: null, data: null, isComfirm: false },
});
