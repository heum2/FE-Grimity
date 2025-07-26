import { ModalContent, useNewModalStore } from "@/states/modalStore";
import { v4 as uuidv4 } from "uuid";

export function useModal() {
  const open = useNewModalStore((s) => s.openModal);
  const close = useNewModalStore((s) => s.closeModal);

  function openModal<T extends Record<string, unknown>>(content: ModalContent, props?: T) {
    const id = uuidv4();
    open(id, content, props);
    return () => close(id);
  }

  return { openModal, onCloseAll: () => useNewModalStore.setState({ modals: [] }) };
}
