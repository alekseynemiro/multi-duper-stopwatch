import React from "react";
import { Linking, Text } from "react-native";
import { LinkProps } from "./LinkProps";
import { linkStyles } from "./LinkStyles";

export function Link(props: LinkProps): JSX.Element {
  const {
    style,
    url,
    text,
  } = props;

  return (
    <Text
      style={[
        linkStyles.link,
        style,
      ]}
      onPress={(): void => {
        Linking.openURL(url);
      }}
    >
      {text}
    </Text>
  );
}
