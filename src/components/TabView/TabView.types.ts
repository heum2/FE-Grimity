export interface TabItem<T> {
  key: T;
  label: string;
}

export interface TabViewProps<T> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (tabKey: T) => void;
}
