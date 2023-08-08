import React from "react";
import { Text } from "react-native";
import { colors } from "@styles";
import { LabelProps } from "./LabelProps";
import { labelStyles } from "./LabelStyles";

export function Label(props: LabelProps): JSX.Element {
  const {
    style,
    variant,
    children,
  } = props;

  return (
    <Text
      style={[
        labelStyles.label,
        style,
        {
          color: variant && variant !== "default"
            ? colors[variant]
            : colors.text,
        },
      ]}
    >
      {children}
    </Text>
  );
}
