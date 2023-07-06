import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native-windows";
import { ButtonProps } from "./ButtonProps";
import { buttonStyles } from "./ButtonStyles";

export function Button({ title, variant, onPress  }: ButtonProps): JSX.Element {
  return (
    <View style={buttonStyles.container}>
      <TouchableOpacity
        style={{
          ...buttonStyles.button,
          ...buttonStyles[variant ?? "primary"],
        }}
        onPress={onPress}
      >
        <Text style={buttonStyles[`${variant ?? "primary"}Title`]}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
