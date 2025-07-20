import React from "react";

import DefaultHeader from "@/components/Layout/Header/Default/DefaultHeader";
import SubHeader from "@/components/Layout/Header/Sub/SubHeader";

import type { HeaderProps } from "@/components/Layout/Header/types/Header.types";

import styles from "./Header.module.scss";

export default function Header({ variant }: HeaderProps) {
  const renderHeader = () => {
    switch (variant) {
      case "sub":
        return <SubHeader />;
      case "default":
      default:
        return <DefaultHeader />;
    }
  };

  return <header className={styles.header}>{renderHeader()}</header>;
}
