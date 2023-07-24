import React from "react";
import { View } from "react-native";
import { HorizontalLineProps } from "./HorizontalLineProps";
import { horizontalLineStyles } from "./HorizontalLineStyles";

export function HorizontalLine(props: HorizontalLineProps): JSX.Element {
  const {
    size,
  } = props;

  return (
    <View
      style={[
        horizontalLineStyles.default,
        horizontalLineStyles[size ?? "md"],
      ]}
    />
  );
}
