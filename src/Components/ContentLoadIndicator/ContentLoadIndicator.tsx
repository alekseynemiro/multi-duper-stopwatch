import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "@components/ActivityIndicator";
import { ContentLoadIndicatorProps } from "./ContentLoadIndicatorProps";
import { contentLoadIndicatorStyles } from "./ContentLoadIndicatorStyles";

export function ContentLoadIndicator(props: ContentLoadIndicatorProps): JSX.Element {
  const {
    variant,
  } = props;

  return (
    <View style={contentLoadIndicatorStyles.default}>
      <ActivityIndicator
        size="x-large"
        variant={variant}
      />
    </View>
  );
}
