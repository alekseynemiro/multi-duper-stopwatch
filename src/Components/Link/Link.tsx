import React from "react";
import { Linking, Text } from "react-native";
import { LinkProps } from "./LinkProps";
import { linkStyles } from "./LinkStyles";

export function Link(props: LinkProps): JSX.Element {
  const {
    style,
    url,
    text,
    onPress,
  } = props;

  return (
    <Text
      style={[
        linkStyles.link,
        style,
      ]}
      onPress={(): void => {
        if (url) {
          Linking.openURL(url);
        }

        if (onPress) {
          onPress();
        }
      }}
    >
      {text}
    </Text>
  );
}
