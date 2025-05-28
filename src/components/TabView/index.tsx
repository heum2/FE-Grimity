import type { TabViewProps } from "@/components/TabView/TabView.types";

import styles from "@/components/TabView/TabView.module.scss";

function TabView<T extends string>({ tabs, activeTab, onTabChange }: TabViewProps<T>) {
  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`${styles.tabButton} ${activeTab === tab.key ? styles.active : ""}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabView;
export type { TabViewProps };
