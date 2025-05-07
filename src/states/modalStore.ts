import { create } from "zustand";

export type ModalType =
  | "LOGIN"
  | "NICKNAME"
  | "JOIN"
  | "PROFILE-ID"
  | "PROFILE-EDIT"
  | "PROFILE-LINK"
  | "SHARE-PROFILE"
  | "BACKGROUND"
  | "FOLLOWER"
  | "FOLLOWING"
  | "SHARE"
  | "SHAREPOST"
  | "UPLOAD"
  | "LIKE"
  | "REPORT"
  | "ALBUM"
  | "ALBUM-SELECT"
  | "ALBUM-MOVE"
  | "ALBUM-DELETE";

export interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  data?: any;
  isComfirm?: boolean;
  onClick?: () => void | Promise<void>;
  isFill?: boolean;
}

interface ModalStore extends ModalState {
  openModal: (modal: Omit<ModalState, "isOpen">) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  type: null,
  data: null,
  isComfirm: false,
  isFill: false,
  onClick: undefined,

  openModal: (modal) =>
    set(() => ({
      ...modal,
      isOpen: true,
    })),

  closeModal: () =>
    set(() => ({
      isOpen: false,
      type: null,
      data: null,
      isComfirm: false,
      onClick: undefined,
      isFill: false,
    })),
}));
