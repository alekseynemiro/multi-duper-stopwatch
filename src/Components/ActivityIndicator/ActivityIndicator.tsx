import React from "react";
import { ActivityIndicator as NativeActivityIndicator } from "react-native";
import { colors } from "@styles";
import { ActivityIndicatorProps } from "./ActivityIndicatorProps";

export function ActivityIndicator(props: ActivityIndicatorProps): JSX.Element {
  const {
    size,
    variant,
  } = props;

  return (
    <NativeActivityIndicator
      size={size === "x-large" ? 48 : size}
      color={colors[`${variant ?? "primary"}`]}
    />
  );
}
