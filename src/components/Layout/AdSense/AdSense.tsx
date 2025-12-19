import { useEffect, useRef, useState } from "react";

import { CONFIG } from "@/config";
import { useDeviceStore, type DeviceType } from "@/states/deviceStore";

import type { AdSenseProps } from "./AdSense.types";

import styles from "./AdSense.module.scss";

const MIN_RELOAD_INTERVAL = 30000; // 30초 - AdSense 정책 준수

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
  const [shouldReload, setShouldReload] = useState(0);
  const previousDeviceTypeRef = useRef<DeviceType | null>(null);
  const lastReloadTimeRef = useRef<number>(0);
  const observerRef = useRef<MutationObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { deviceType } = useDeviceStore();

  const showPlaceholder = process.env.NODE_ENV === "development";

  // DeviceType 변경 감지
  useEffect(() => {
    const now = Date.now();

    if (
      previousDeviceTypeRef.current &&
      previousDeviceTypeRef.current !== deviceType &&
      now - lastReloadTimeRef.current > MIN_RELOAD_INTERVAL
    ) {
      lastReloadTimeRef.current = now;
      setShouldReload((prev) => prev + 1);
    }

    previousDeviceTypeRef.current = deviceType;
  }, [deviceType]);

  // 광고 로드
  useEffect(() => {
    let rafId: number | null = null;

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

    const loadAd = async () => {
      try {
        if (adRef.current && typeof window !== "undefined") {
          const rect = adRef.current.getBoundingClientRect();
          if (rect.width > 0) {
            if (shouldReload > 0) {
              const adElement = adRef.current;

              while (adElement.firstChild) {
                adElement.removeChild(adElement.firstChild);
              }

              adElement.removeAttribute("data-ad-status");
              adElement.removeAttribute("data-adsbygoogle-status");
              adElement.removeAttribute("data-page-url");

              await new Promise((resolve) => setTimeout(resolve, 100));
            }

            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setAdStatus("loading");

            if (observerRef.current) {
              observerRef.current.disconnect();
              observerRef.current = null;
            }

            observerRef.current = new MutationObserver(() => {
              checkAdStatus();
            });

            observerRef.current.observe(adRef.current, {
              attributes: true,
              attributeFilter: ["data-ad-status"],
            });

            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
              const currentStatus = adRef.current?.getAttribute("data-ad-status");
              if (!currentStatus || currentStatus === "unfilled") {
                setAdStatus("failed");
              }
            }, 5000);
          } else {
            rafId = requestAnimationFrame(loadAd);
          }
        }
      } catch (error) {
        console.error("AdSense error:", error);
        setAdStatus("failed");
      }
    };

    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(loadAd);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [shouldReload]);

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
