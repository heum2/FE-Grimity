import React from "react";

import IconComponent from "@/components/Asset/Icon";

import type { PopupHeaderProps } from "@/components/Layout/Header/Popup/PopupHeader.types";

import styles from "./PopupHeader.module.scss";

const PopupHeader = ({ title, onClose }: PopupHeaderProps) => {
  return (
    <div className={styles.container}>
      <button onClick={onClose} className={styles.closeButton}>
        <IconComponent name="x" size={24} />
      </button>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
};

export default PopupHeader;
