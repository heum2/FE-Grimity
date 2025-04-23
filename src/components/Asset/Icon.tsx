import React from "react";
import { ICONS } from "@/constants/asset";
import { ReactSVG } from "react-svg";

const colorMap = {
  green: "#2bc466",
  red: "#f5506c",
  gray: "#adafbb",
};

export interface IconComponentProps {
  name: keyof typeof ICONS;
  color?: keyof typeof colorMap;
  size?: number;
  padding?: number;
  isBtn?: boolean;
}

export default function IconComponent({
  name,
  color,
  size = 24,
  padding,
  isBtn = false,
}: IconComponentProps) {
  const iconSrc = ICONS[name];
  const selectedColor = color ? colorMap[color] : undefined;

  // size가 3 이하일 경우 padding-bottom 추가
  const additionalPadding = size <= 3 ? "10px" : padding;

  if (!iconSrc) {
    console.warn(`Icon "${name}" not found in ICONS`);
    return null;
  }

  if (typeof iconSrc === "string") {
    return (
      <span
        style={{
          padding: padding,
          paddingBottom: additionalPadding,
          cursor: isBtn ? "pointer" : "default",
        }}
      >
        <ReactSVG
          src={iconSrc}
          beforeInjection={(svg) => {
            svg.setAttribute("width", `${size}`);
            svg.setAttribute("height", `${size}`);
            if (selectedColor) {
              svg.setAttribute("fill", selectedColor);
            }
          }}
          style={{ display: "inline-block", paddingTop: "3px" }}
        />
      </span>
    );
  }

  return null;
}
