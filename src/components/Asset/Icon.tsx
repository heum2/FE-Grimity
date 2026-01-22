import React, { useMemo, memo } from "react";
import { ICONS } from "@/constants/asset";
import { ReactSVG } from "react-svg";

const colorMap = {
  green: "#2bc466",
  red: "#f5506c",
  gray: "#adafbb",
};

const svgStyle = { display: "inline-block", paddingTop: "3px" } as const;

export interface IconComponentProps {
  name: keyof typeof ICONS;
  color?: keyof typeof colorMap;
  size?: number;
  padding?: number;
  isBtn?: boolean;
}

function IconComponent({
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

  const spanStyle = useMemo(
    () => ({
      padding: padding,
      paddingBottom: additionalPadding,
      cursor: isBtn ? "pointer" : "default",
    }),
    [padding, additionalPadding, isBtn],
  );

  const beforeInjection = useMemo(
    () => (svg: SVGSVGElement) => {
      svg.setAttribute("width", `${size}`);
      svg.setAttribute("height", `${size}`);
      if (selectedColor) {
        svg.setAttribute("fill", selectedColor);
      }
    },
    [size, selectedColor],
  );

  if (!iconSrc) {
    console.warn(`Icon "${name}" not found in ICONS`);
    return null;
  }

  if (typeof iconSrc === "string") {
    return (
      <span style={spanStyle}>
        <ReactSVG
          src={iconSrc}
          beforeInjection={beforeInjection}
          style={svgStyle}
        />
      </span>
    );
  }

  return null;
}

export default memo(IconComponent);
