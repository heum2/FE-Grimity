export type CategoryType = "select" | "unselect";

export type CategoryPropsSize = "m" | "s";

export interface CategoryProps {
  children: React.ReactNode;
  type: CategoryType;
  unselected?: boolean;
  quantity?: number;
  onClick: () => void;
}
