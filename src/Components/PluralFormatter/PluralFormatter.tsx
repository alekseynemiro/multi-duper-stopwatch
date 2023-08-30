import React from "react";
import { Text } from "react-native";
import { PluralFormatterProps } from "./PluralFormatterProps";

// TODO: Service + tests
export function PluralFormatter(props: PluralFormatterProps): JSX.Element {
  const {
    value,
    zero,
    one,
    few,
    other,
    style,
  } = props;

  if (!value || value % 10 === 0) {
    return (
      <Text style={style}>
        {zero || other}
      </Text>
    );
  }

  if (value === 1 || value % 10 === 1) {
    return (
      <Text style={style}>
        {one || other}
      </Text>
    );
  }

  if ([2, 3, 4].includes(value % 10)) {
    return (
      <Text style={style}>
        {few || other}
      </Text>
    );
  }

  return (
    <Text style={style}>
      {other}
    </Text>
  );
}
