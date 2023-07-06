import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native-windows";
import { ButtonProps } from "./ButtonProps";
import { buttonStyles } from "./ButtonStyles";

export function Button(props: ButtonProps): JSX.Element {
  const {
    children,
    title,
    variant,
    style,
    onPress,
  } = props;

  return (
    <View style={buttonStyles.container}>
      <TouchableOpacity
        style={[
          buttonStyles.button,
          buttonStyles[variant ?? "primary"],
          style,
        ]}
        onPress={onPress}
      >
        {
          title
          && (
            <Text style={buttonStyles[`${variant ?? "primary"}Title`]}>
              {title}
            </Text>
          )
        }
        {
          children
          && (
            <Text style={buttonStyles[`${variant ?? "primary"}Title`]}>
              {children}
            </Text>
          )
        }
      </TouchableOpacity>
    </View>
  );
}
