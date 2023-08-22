import React, { memo } from "react";
import { View } from "react-native";
import { filterModalStyles } from "./FilterModalStyles";

function SeparatorComponent(): JSX.Element {
  return (
    <View
      style={filterModalStyles.separator}
    />
  );
}

export const Separator = memo(SeparatorComponent);
