"use client";

import { useEffect, useRef, useState } from "react";

export function useInViewImage(src: string) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isInView, setIsInView] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setImageSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
      },
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [src]);

  return { imgRef, imageSrc, isInView };
}
