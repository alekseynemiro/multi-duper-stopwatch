import React, { memo } from "react";
import { View } from "react-native";
import { reportViewStyles } from "@views/Report/ReportViewStyles";

function SeparatorComponent(): JSX.Element {
  return (
    <View
      style={reportViewStyles.separator}
    />
  );
}

export const Separator = memo(SeparatorComponent);
