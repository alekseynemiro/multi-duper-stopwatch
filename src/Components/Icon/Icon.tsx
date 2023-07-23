import React from "react";
import ReactNativeIcon from "react-native-vector-icons/FontAwesome5";
import { colors } from "@styles";
import { iconMap } from "./IconMap";
import { IconProps } from "./IconProps";

export function Icon({ name, variant, size, style }: IconProps): JSX.Element {
  let color = colors.text;

  if (variant) {
    const part1 = variant.split("-")[0];
    const part2 = (variant.split("-")[1]?.charAt(0).toUpperCase() ?? "") + (variant.split("-")[1]?.slice(1) ?? "");
    color = (colors as any)[part1 + part2] ?? colors.text;
  }

  return (
    <ReactNativeIcon
      name={iconMap.get(name) ?? name}
      size={size ?? 18}
      color={color}
      style={style}
    />
  );
}
