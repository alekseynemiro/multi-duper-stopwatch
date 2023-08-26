import React, { useCallback } from "react";
import { Text, View } from "react-native";
import { DurationFormatter } from "@components/DurationFormatter";
import { useLocalizationService } from "@config";
import { ColorPalette } from "@data";
import { colors } from "@styles";
import { getColorCode } from "@utils/ColorPaletteUtils";
import { FilteredActivityModel } from "@views/Report/Models";
import { reportViewStyles } from "@views/Report/ReportViewStyles";
import { TotalProps } from "./TotalProps";
import { TotalRealTimeValue } from "./TotalRealTimeValue";

export function Total(props: TotalProps): JSX.Element {
  const localization = useLocalizationService();

  const {
    activities,
    elapsed,
    realTimeUpdate,
    basedOnElapsed,
  } = props;

  const getColor = useCallback(
    (color: ColorPalette | null): string => {
      if (color) {
        return getColorCode(color);
      }

      return colors.white;
    },
    []
  );

  return (
    <View
      style={reportViewStyles.totalRow}
    >
      {
        activities?.length > 0
        && (
          <View
            style={reportViewStyles.iconCol}
          >
            {
              activities?.slice(0, 3).map(
                (x: FilteredActivityModel, index: number): JSX.Element => {
                  return (
                      <View
                        key={x.id}
                        style={[
                          reportViewStyles.icon,
                          {
                            backgroundColor: getColor(x.color),
                          },
                          activities.length > 1
                          && {
                            ...reportViewStyles.multipleIcons,
                            left: (index * reportViewStyles.multipleIconsStep.left) + reportViewStyles.iconCol.paddingLeft,
                          },
                        ]}
                      />
                  );
                }
              )
            }
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
                  basedOnValue={basedOnElapsed}
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
