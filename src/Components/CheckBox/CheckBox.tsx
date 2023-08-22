import React from "react";
import ReactNativeCheckBox from "@react-native-community/checkbox";
import { CheckBoxProps } from "./CheckBoxProps";

export function CheckBox(props: CheckBoxProps): JSX.Element {
  const {
    disabled,
    value,
    style,
    onValueChange,
  } = props;

  return (
    <ReactNativeCheckBox
      disabled={disabled}
      value={value}
      style={style}
      onValueChange={onValueChange}
    />
  );
}
