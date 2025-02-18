import React from "react";
import { ICONS } from "@/constants/asset";

export interface IconComponentProps {
  name: keyof typeof ICONS;
  alt?: string;
  width?: number;
  height?: number;
  padding?: number;
  isBtn?: boolean;
}

export default function IconComponent({
  name,
  alt = "",
  width,
  height,
  padding,
  isBtn = false,
}: IconComponentProps) {
  const iconSrc = ICONS[name];

  if (!iconSrc) {
    console.warn(`Icon "${name}" not found in ICONS`);
    return null;
  }

  if (typeof iconSrc === "string") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding,
          cursor: isBtn ? "pointer" : "default",
        }}
      >
        <img
          src={iconSrc as string}
          alt={alt}
          loading="lazy"
          width={width}
          height={height}
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }

  return null;
}
