import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ButtonProps } from "./ButtonProps";
import { buttonStyles } from "./ButtonStyles";

export function Button(props: ButtonProps): JSX.Element {
  const {
    children,
    title,
    variant,
    style,
    titleStyle,
    childWrapperStyle,
    disabled,
    accessible,
    accessibilityHint,
    accessibilityLabel,
    accessibilityState,
    accessibilityValue,
    importantForAccessibility,
    onPress,
    onLongPress,
  } = props;

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        buttonStyles.button,
        buttonStyles[variant ?? "primary"],
        disabled && buttonStyles.disabled,
        style,
      ]}
      accessible={accessible}
      accessibilityState={accessibilityState}
      accessibilityValue={accessibilityValue}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      importantForAccessibility={importantForAccessibility}
      onPress={(): void => {
        if (!disabled) {
          onPress && onPress();
        }
      }}
      onLongPress={(): void => {
        if (!disabled) {
          onLongPress && onLongPress();
        }
      }}
    >
      {
        title
        && (
          <Text
            style={[
              buttonStyles[`${variant ?? "primary"}Title`],
              titleStyle,
            ]}
          >
            {title}
          </Text>
        )
      }
      {
        children
        && (
          <View
            style={childWrapperStyle}
          >
            {children}
          </View>
        )
      }
    </TouchableOpacity>
  );
}
