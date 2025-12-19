import { ReactNode } from "react";

export interface DetailLayoutProps {
  children: ReactNode;
}

export interface AdSlotProps {
  adSlot: string;
}

export interface DetailLayoutComposition {
  (props: DetailLayoutProps): JSX.Element;
  Content: (props: DetailLayoutProps) => JSX.Element;
  HorizontalAd: (props: AdSlotProps) => JSX.Element;
  Sidebar: (props: DetailLayoutProps) => JSX.Element;
  VerticalAd: (props: AdSlotProps) => JSX.Element;
}
