import React from "react";
import Image from "next/image";
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
          padding,
          cursor: isBtn ? "pointer" : "default",
        }}
      >
        <Image
          src={iconSrc as string}
          alt={alt}
          width={width}
          height={height}
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }

  return null;
}
