export type AdFormat = "fluid" | "auto" | "autorelaxed";
export type AdLayout = "in-article" | "in-feed";

export interface AdSenseProps {
  adClient?: string;
  adSlot: string;
  adFormat?: AdFormat;
  adLayoutKey?: string;
  adLayout?: AdLayout;
  style?: React.CSSProperties;
  className?: string;
  fullWidth?: boolean; // 그리드 전체 너비를 차지할지 여부
}
