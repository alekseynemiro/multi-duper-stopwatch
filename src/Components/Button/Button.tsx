import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native-windows";
import { ButtonProps } from "./ButtonProps";
import { buttonStyles } from "./ButtonStyles";

export function Button({ title, variant, style, onPress  }: ButtonProps): JSX.Element {
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
        <Text style={buttonStyles[`${variant ?? "primary"}Title`]}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
