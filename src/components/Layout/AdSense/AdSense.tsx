import { useEffect, useRef, useState } from "react";

import { CONFIG } from "@/config";

import type { AdSenseProps } from "./AdSense.types";

import styles from "./AdSense.module.scss";

export default function AdSense({
  adClient = CONFIG.MARKETING.ADSENSE_CLIENT_ID,
  adSlot,
  adFormat = "fluid",
  adLayoutKey,
  adLayout,
  style,
  className,
  fullWidth = false,
  dataFullWidthResposive,
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [adStatus, setAdStatus] = useState<"loading" | "loaded" | "failed">("loading");
  const isAdLoadedRef = useRef(false);

  const showPlaceholder = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (isAdLoadedRef.current) return;

    let observer: MutationObserver | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const checkAdStatus = () => {
      if (!adRef.current) return;

      const adElement = adRef.current;
      const adStatus = adElement.getAttribute("data-ad-status");

      if (adStatus === "filled") {
        setAdStatus("loaded");
      } else if (adStatus === "unfilled") {
        setAdStatus("failed");
      }
    };

    const loadAd = () => {
      try {
        if (adRef.current && typeof window !== "undefined") {
          const rect = adRef.current.getBoundingClientRect();
          if (rect.width > 0) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            isAdLoadedRef.current = true;

            observer = new MutationObserver(() => {
              checkAdStatus();
            });

            observer.observe(adRef.current, {
              attributes: true,
              attributeFilter: ["data-ad-status"],
            });

            timeoutId = setTimeout(() => {
              const currentStatus = adRef.current?.getAttribute("data-ad-status");
              if (!currentStatus || currentStatus === "unfilled") {
                setAdStatus("failed");
              }
            }, 5000);
          } else {
            requestAnimationFrame(loadAd);
          }
        }
      } catch (error) {
        console.error("AdSense error:", error);
        setAdStatus("failed");
      }
    };

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(loadAd);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, []);

  const containerClassName = [
    styles.adContainer,
    fullWidth && styles.fullWidth,
    showPlaceholder && styles.withPlaceholder,
    showPlaceholder && styles[adStatus],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClassName}>
      {showPlaceholder && (
        <div className={styles.placeholder}>
          <div className={styles.placeholderContent}>
            <span className={styles.placeholderIcon}>📢</span>
            <span className={styles.placeholderText}>
              {adStatus === "loading" && "광고 로딩 중..."}
              {adStatus === "loaded" && "광고 로드 완료"}
              {adStatus === "failed" && "광고 로드 실패"}
            </span>
            <span className={styles.placeholderSlot}>Slot: {adSlot}</span>
          </div>
        </div>
      )}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          minWidth: "250px",
          ...style,
        }}
        data-ad-format={adFormat}
        data-ad-layout-key={adLayoutKey}
        data-ad-layout={adLayout}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-full-width-responsive={dataFullWidthResposive}
      />
    </div>
  );
}
