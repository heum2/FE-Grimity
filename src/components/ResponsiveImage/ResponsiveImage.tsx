import { forwardRef, useImperativeHandle } from "react";

import { useInViewImage } from "@/hooks/useInViewImage";

import { ResponsiveImageProps } from "./ResponsiveImage.types";

const ResponsiveImage = forwardRef<HTMLImageElement, ResponsiveImageProps>(
  ({ src, alt = "", ...props }, forwardedRef) => {
    const { imgRef, imageSrc, isInView } = useInViewImage(src);
    useImperativeHandle(forwardedRef, () => imgRef.current!);

    const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E';

    return (
      <picture>
        {isInView && (
          <>
            <source media="(min-width: 1024px)" srcSet={`${imageSrc}?s=1200`} />
            <source media="(min-width: 768px)" srcSet={`${imageSrc}?s=600`} />
            <source media="(max-width: 767px)" srcSet={`${imageSrc}?s=300`} />
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
);

ResponsiveImage.displayName = "ResponsiveImage";

export default ResponsiveImage;
