import React from "react";
import { View } from "react-native";
import { FormRowProps } from "./FormRowProps";
import { formRowStyles } from "./FormRowStyles";

export function FormRow(props: FormRowProps): JSX.Element {
  const {
    style,
    children,
  } = props;

  return (
    <View
      style={[
        formRowStyles.formRow,
        style,
      ]}
    >
      {children}
    </View>
  );
}
