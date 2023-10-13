import React, { memo, useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "@styles";
import { getColorCode, isNotEmptyColor } from "@utils/ColorPaletteUtils";
import { getTimeSpan } from "@utils/TimeUtils";
import { reportViewStyles } from "@views/Report/ReportViewStyles";
import { ReportViewItemProps } from "./ReportViewItemProps";

function ReportViewItemComponent(props: ReportViewItemProps): JSX.Element {
  const {
    id,
    activityId,
    activityColor,
    activityName,
    elapsedTime,
    onPress,
    onLongPress,
  } = props;

  const color = useMemo(
    (): string => {
      if (isNotEmptyColor(activityColor)) {
        return getColorCode(activityColor!);
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
        id,
        activityId,
        activityColor,
      });
    },
    [
      id,
      activityId,
      activityColor,
      onPress,
    ]
  );

  const longPressHandler = useCallback(
    (): void => {
      onLongPress({
        id,
        activityId,
        activityColor,
      });
    },
    [
      id,
      activityId,
      activityColor,
      onLongPress,
    ]
  );

  return (
    <TouchableOpacity
      style={reportViewStyles.tableRow}
      onPress={pressHandler}
      onLongPress={longPressHandler}
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
