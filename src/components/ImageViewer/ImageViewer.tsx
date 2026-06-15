"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import Icon from "@/components/common/Icon/Icon";
import { usePreventScroll } from "@/hooks/usePreventScroll";

import { ImageViewerProps } from "./ImageViewer.types";
import { useImageZoom } from "./useImageZoom";
import { useEscapeAndBackClose } from "./useEscapeAndBackClose";
import styles from "./ImageViewer.module.scss";

const MAX_SCALE = 3;

export default function ImageViewer({ images, initialIndex = 0, onClose }: ImageViewerProps) {
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const { isZoomed, canZoomIn, canZoomOut, zoomIn, zoomOut, reset, imageStyle, panHandlers } =
    useImageZoom({ max: MAX_SCALE });

  const hasMultiple = images.length > 1;

  usePreventScroll(true);
  useEscapeAndBackClose(onClose);

  // 확대 중에는 Swiper 슬라이드 스와이프를 잠근다 (대신 직접 pan)
  useEffect(() => {
    if (!mainSwiper || mainSwiper.destroyed) return;
    mainSwiper.allowTouchMove = !isZoomed;
  }, [mainSwiper, isZoomed]);

  if (images.length === 0) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="이미지 뷰어"
    >
      <Swiper
        className={styles.main}
        modules={[Thumbs, Keyboard]}
        initialSlide={initialIndex}
        keyboard={{ enabled: true }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        onSwiper={setMainSwiper}
        onSlideChange={(s) => {
          setActiveIndex(s.activeIndex);
          reset();
        }}
      >
        {images.map((image, i) => (
          <SwiperSlide key={`${image}-${i}`} className={styles.slide}>
            <img
              src={image}
              alt=""
              className={styles.image}
              draggable={false}
              style={i === activeIndex ? imageStyle : undefined}
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.preventDefault()}
              {...panHandlers}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.toolbar} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={zoomIn}
          disabled={!canZoomIn}
          aria-label="확대"
        >
          <Icon name="plus" size={24} color="white" />
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={zoomOut}
          disabled={!canZoomOut}
          aria-label="축소"
        >
          <Icon name="minus" size={24} color="white" />
        </button>
        {/*
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={handleDownload}
            aria-label="다운로드"
          >
            <Icon name="down" size={24} color="white" />
          </button>
        */}
      </div>

      {hasMultiple && (
        <div className={styles.thumbnails} onClick={(e) => e.stopPropagation()}>
          <Swiper
            className={styles.thumbs}
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            slidesPerView="auto"
            spaceBetween={8}
            watchSlidesProgress
            centerInsufficientSlides
          >
            {images.map((image, i) => (
              <SwiperSlide key={`thumb-${image}-${i}`} className={styles.thumbSlide}>
                <img src={image} alt="" className={styles.thumbImage} draggable={false} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
