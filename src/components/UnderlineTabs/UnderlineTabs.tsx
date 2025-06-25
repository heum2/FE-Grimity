import { useEffect, useRef, useState } from "react";
import styles from "./UnderlineTabs.module.scss";
import React from "react";

interface TabItem<T extends string> {
  key: T;
  label: string;
  hasSeparatorAfter?: boolean;
}

interface UnderlineTabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (tabKey: T) => void;
}

export default function UnderlineTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: UnderlineTabsProps<T>) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({});

  useEffect(() => {
    const calculateUnderline = () => {
      const activeTabIndex = tabs.findIndex((tab) => tab.key === activeTab);
      const activeElement = tabsRef.current[activeTabIndex];

      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setUnderlineStyle({
          left: offsetLeft,
          width: offsetWidth,
        });
      } else {
        setUnderlineStyle({ opacity: 0 });
      }
    };

    calculateUnderline();

    window.addEventListener("resize", calculateUnderline);
    return () => {
      window.removeEventListener("resize", calculateUnderline);
    };
  }, [activeTab, tabs]);

  return (
    <div className={styles.navContainer}>
      {tabs.map((tab, index) => (
        <React.Fragment key={tab.key}>
          <button
            ref={(el) => {
              tabsRef.current[index] = el;
            }}
            className={`${styles.button} ${activeTab === tab.key ? styles.selected : ""}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
          {tab.hasSeparatorAfter && <div className={styles.bar} />}
        </React.Fragment>
      ))}
      <div className={styles.underline} style={underlineStyle} />
    </div>
  );
}
