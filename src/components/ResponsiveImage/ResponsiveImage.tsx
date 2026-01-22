import { forwardRef, useImperativeHandle, memo } from "react";

import { useInViewImage } from "@/hooks/useInViewImage";

import { ResponsiveImageProps } from "./ResponsiveImage.types";

const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E';

const ResponsiveImage = memo(
  forwardRef<HTMLImageElement, ResponsiveImageProps>(
    ({ src, alt = "", mobileSize = 600, desktopSize = 1200, ...props }, forwardedRef) => {
      const { imgRef, imageSrc, isInView } = useInViewImage(src);
      useImperativeHandle(forwardedRef, () => imgRef.current!);

      return (
        <picture>
          {isInView && (
            <>
              <source media="(min-width: 1024px)" srcSet={`${imageSrc}?s=${desktopSize}`} />
              <source media="(max-width: 1023px)" srcSet={`${imageSrc}?s=${mobileSize}`} />
            </>
          )}
          <img
            src={isInView ? imageSrc ?? placeholder : placeholder}
            alt={alt}
            ref={imgRef}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = placeholder;
            }}
            {...props}
          />
        </picture>
      );
    },
  ),
);

ResponsiveImage.displayName = "ResponsiveImage";

export default ResponsiveImage;
