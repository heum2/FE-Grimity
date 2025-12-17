import AdSense from "./AdSense";
import { AdSenseProps } from "./AdSense.types";

interface InFeedAdProps extends Partial<AdSenseProps> {
  fullWidth?: boolean;
}

export default function InFeedAd({ fullWidth = true, ...props }: InFeedAdProps) {
  return (
    <AdSense
      adSlot="5075895957"
      adFormat="fluid"
      adLayoutKey="-al+7h-2p-61+lc"
      fullWidth={fullWidth}
      {...props}
    />
  );
}
