import React from "react";
import { Text } from "react-native";
import { DurationFormatterProps } from "./DurationFormatterProps";

export function DurationFormatter(props: DurationFormatterProps): JSX.Element {
  const {
    value,
  } = props;

  return (
    <Text>
      {value.displayValue}
    </Text>
  );
}
