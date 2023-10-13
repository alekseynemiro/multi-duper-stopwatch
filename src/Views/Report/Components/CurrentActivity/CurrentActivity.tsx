import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "@styles";
import { getColorCode } from "@utils/ColorPaletteUtils";
import { reportViewStyles } from "@views/Report/ReportViewStyles";
import { CurrentActivityProps } from "./CurrentActivityProps";
import { CurrentActivityValue } from "./CurrentActivityValue";

export function CurrentActivity(props: CurrentActivityProps): JSX.Element {
  const {
    activityId,
    activityName,
    activityColor,
    onPress,
    onLongPress,
  } = props;

  const color = useMemo(
    (): string => {
      if (activityColor) {
        return getColorCode(activityColor);
      }

      return colors.white;
    },
    [
      activityColor,
    ]
  );

  return (
    <TouchableOpacity
      style={reportViewStyles.currentActivityRow}
      onPress={(): void => {
        onPress({ activityId, activityColor });
      }}
      onLongPress={(): void => {
        onLongPress({ activityId, activityColor });
      }}
    >
      <View
        style={reportViewStyles.iconCol}
      >
        <View
          style={[
            reportViewStyles.icon,
            {
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <View
        style={reportViewStyles.nameCol}
      >
        <Text>
          {activityName}
        </Text>
      </View>
      <View
        style={reportViewStyles.elapsedCol}
      >
        <CurrentActivityValue />
      </View>
    </TouchableOpacity>
  );
}
