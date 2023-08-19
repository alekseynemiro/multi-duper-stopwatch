import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { DurationFormatter } from "@components/DurationFormatter";
import { useLocalizationService } from "@config";
import { colors } from "@styles";
import { getColorCode } from "@utils/ColorPaletteUtils";
import { reportViewStyles } from "@views/Report/ReportViewStyles";
import { TotalProps } from "./TotalProps";
import { TotalRealTimeValue } from "./TotalRealTimeValue";

export function Total(props: TotalProps): JSX.Element {
  const localization = useLocalizationService();

  const {
    activityId,
    activityColor,
    elapsed,
    realTimeUpdate,
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
    <View
      style={reportViewStyles.totalRow}
    >
      {
        activityId
        && (
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
        )
      }
      <View
        style={reportViewStyles.nameCol}
      >
        <Text style={reportViewStyles.totalText}>
          {localization.get("report.total")}
        </Text>
      </View>
      <View
        style={reportViewStyles.elapsedCol}
      >
        <Text style={reportViewStyles.totalText}>
          {
            realTimeUpdate
              && (
                <TotalRealTimeValue
                  value={elapsed}
                />
              )
              || (
                <DurationFormatter
                  value={elapsed}
                />
              )
          }
        </Text>
      </View>
    </View>
  );
}
