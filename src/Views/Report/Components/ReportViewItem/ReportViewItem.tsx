import React, { memo, useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "@styles";
import { getColorCode } from "@utils/ColorPaletteUtils";
import { getTimeSpan } from "@utils/TimeUtils";
import { reportViewStyles } from "@views/Report/ReportViewStyles";
import { ReportViewItemProps } from "./ReportViewItemProps";

function ReportViewItemComponent(props: ReportViewItemProps): JSX.Element {
  const {
    activityId,
    activityColor,
    activityName,
    elapsedTime,
    onPress,
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

  const pressHandler = useCallback(
    (): void => {
      onPress({
        activityId,
        activityColor,
      });
    },
    [
      activityId,
      activityColor,
      onPress,
    ]
  );

  return (
    <TouchableOpacity
      style={reportViewStyles.tableRow}
      onPress={pressHandler}
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
        <Text>
          {getTimeSpan(elapsedTime).displayValue}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export const ReportViewItem = memo(ReportViewItemComponent);
