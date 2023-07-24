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
    </View>
  );
}
