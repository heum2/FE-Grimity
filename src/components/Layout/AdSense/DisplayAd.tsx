import AdSense from "./AdSense";
import { AdSenseProps } from "./AdSense.types";

export default function DisplayAd(props: AdSenseProps) {
  return <AdSense {...props} adFormat="auto" dataFullWidthResposive="true" />;
}
