import type { ReactNode } from "react";
import type { IconName } from "@/components/common/Icon/Icon.types";

export type EmptySize = "xl" | "md";

export type EmptyButtonVariant = "solid" | "outline";

export interface EmptyProps {
  size?: EmptySize;
  // 모바일(767px 이하)에서 적용할 size. 없으면 size를 그대로 사용
  mobileSize?: EmptySize;
  icon?: ReactNode;
  iconName?: IconName;
  title: string;
  content?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  buttonVariant?: EmptyButtonVariant;
  className?: string;
}
