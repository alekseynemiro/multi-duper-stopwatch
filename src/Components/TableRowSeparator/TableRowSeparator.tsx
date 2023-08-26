import React, { memo } from "react";
import { View } from "react-native";
import { tableRowSeparatorStyles } from "./TableRowSeparatorStyles";

function TableRowSeparatorComponent(): JSX.Element {
  return (
    <View
      style={tableRowSeparatorStyles.separator}
    />
  );
}

export const TableRowSeparator = memo(TableRowSeparatorComponent);
