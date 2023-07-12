import React from "react";
import { View } from "react-native-windows";
import { horizontalLineStyles } from "./HorizontalLineStyles";

export function HorizontalLine(): JSX.Element {
  return (
    <View
      style={horizontalLineStyles.default}
    />
  );
}