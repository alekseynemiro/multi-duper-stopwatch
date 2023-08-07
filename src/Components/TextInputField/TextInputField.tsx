import React from "react";
import { Text, TextInput } from "react-native";
import { Label } from "@components/Label";
import { TextInputFieldProps } from "./TextInputFieldProps";
import { textInputFieldStyles } from "./TextInputFieldStyles";

export function TextInputField(props: TextInputFieldProps): JSX.Element {
  const {
    label,
    value,
    style,
    error,
    accessible,
    accessibilityHint,
    accessibilityLabel,
    accessibilityState,
    accessibilityValue,
    onChangeText,
    onFocus,
    onBlur,
    onPressIn,
  } = props;

  return (
    <>
      {
        label
        && (
          <Label>
            {label}
          </Label>
        )
      }
      <TextInput
        value={value}
        style={[
          textInputFieldStyles.textInput,
          !!error && textInputFieldStyles.textInputError,
          style,
        ]}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={accessibilityState}
        accessibilityValue={accessibilityValue}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        onPressIn={onPressIn}
      />
      {
        error
        && (
          <Text style={textInputFieldStyles.errorMessage}>
            {error}
          </Text>
        )
      }
    </>
  );
}
