import React from "react";
import { Text } from "react-native";
import { LabelProps } from "./LabelProps";
import { labelStyles } from "./LabelStyles";

export function Label(props: LabelProps): JSX.Element {
  const {
    style,
    children,
  } = props;

  return (
    <Text
      style={[
        labelStyles.label,
        style,
      ]}
    >
      {children}
    </Text>
  );
}
