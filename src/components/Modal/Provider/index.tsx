import React, { PropsWithChildren } from "react";

import { useNewModalStore } from "@/states/modalStore";

import ModalPortal from "@/components/Modal/Portal";

import styles from "@/components/Modal/Modal.module.scss";

function ModalProvider({ children }: PropsWithChildren) {
  const { modals, closeModal } = useNewModalStore();

  return (
    <>
      {children}
      <ModalPortal>
        {modals.map(({ id, content, props }) => {
          const handleClose = () => closeModal(id);
          const node = typeof content === "function" ? content(handleClose) : content;

          return (
            <div key={id} className={styles.overlay} onClick={handleClose}>
              <div onClick={(e) => e.stopPropagation()} {...props}>
                {node}
              </div>
            </div>
          );
        })}
      </ModalPortal>
    </>
  );
}

export default ModalProvider;
