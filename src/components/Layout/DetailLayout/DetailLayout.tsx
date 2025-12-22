import DisplayAd from "@/components/Layout/AdSense/DisplayAd";

import type { DetailLayoutProps, AdSlotProps, DetailLayoutComposition } from "./DetailLayout.types";

import styles from "./DetailLayout.module.scss";

function DetailLayoutRoot({ children }: DetailLayoutProps) {
  return <div className={styles.container}>{children}</div>;
}

function Content({ children }: DetailLayoutProps) {
  return <div className={styles.center}>{children}</div>;
}

function HorizontalAd({ adSlot }: AdSlotProps) {
  return <DisplayAd adSlot={adSlot} />;
}

function Sidebar({ children }: DetailLayoutProps) {
  return <div className={styles.right}>{children}</div>;
}

function VerticalAd({ adSlot }: AdSlotProps) {
  return <DisplayAd adSlot={adSlot} />;
}

export const DetailLayout = DetailLayoutRoot as DetailLayoutComposition;
DetailLayout.Content = Content;
DetailLayout.HorizontalAd = HorizontalAd;
DetailLayout.Sidebar = Sidebar;
DetailLayout.VerticalAd = VerticalAd;
