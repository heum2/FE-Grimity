import { forwardRef } from "react";

import { ResponsiveImageProps } from "./ResponsiveImage.types";

const ResponsiveImage = forwardRef<HTMLImageElement, ResponsiveImageProps>(
  ({ src, alt = "", ...props }, ref) => {
    return (
      <picture>
        <source media="(min-width: 1024px)" srcSet={`${src}?s=1200`} />
        <source media="(min-width: 768px)" srcSet={`${src}?s=600`} />
        <source media="(max-width: 767px)" srcSet={`${src}?s=300`} />
        <img src={src} alt={alt} ref={ref} {...props} />
      </picture>
    );
  },
);

ResponsiveImage.displayName = "ResponsiveImage";

export default ResponsiveImage;
